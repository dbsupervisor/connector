-- Adapted from https://github.com/pgexperts/pgx_scripts/blob/master/bloat/table_bloat_check.sql
WITH constants AS (
    SELECT
        current_setting('block_size')::INT AS bs,
        23 AS hdr,
        8 AS ma
),
no_stats AS (
    SELECT
        relid,
        table_schema,
        table_name,
        n_live_tup AS est_rows,
        pg_table_size(relid) AS table_size
    FROM information_schema.columns
    JOIN pg_stat_user_tables AS psut
        ON table_schema = psut.schemaname
        AND table_name = psut.relname
    LEFT OUTER JOIN pg_stats
        ON table_schema = pg_stats.schemaname
        AND table_name = pg_stats.tablename
        AND column_name = attname 
    WHERE attname IS NULL
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
    GROUP BY table_schema,
        table_name,
        relid,
        n_live_tup
),
null_headers AS (
    SELECT
        hdr + 1 + (
            SUM(
                CASE
                    WHEN null_frac <> 0 THEN 1
                    ELSE 0
                END
            ) / 8
        ) AS nullhdr,
        SUM((1 - null_frac) * avg_width) AS datawidth,
        MAX(null_frac) AS maxfracsum,
        schemaname,
        tablename,
        hdr,
        ma,
        bs
    FROM pg_stats
    CROSS JOIN constants
    LEFT OUTER JOIN no_stats
        ON schemaname = no_stats.table_schema
        AND tablename = no_stats.table_name
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        AND no_stats.table_name IS NULL
        AND EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE schemaname = columns.table_schema
                AND tablename = columns.table_name
        )
    GROUP BY schemaname,
        tablename,
        hdr,
        ma,
        bs
),
data_headers AS (
    SELECT
        ma,
        bs,
        hdr,
        schemaname,
        tablename,
        (datawidth + (hdr + ma - (
            CASE
                WHEN hdr % ma = 0 THEN ma
                ELSE hdr % ma
            END
        )))::NUMERIC AS datahdr,
        (maxfracsum * (nullhdr + ma - (
            CASE
                WHEN nullhdr % ma = 0 THEN ma
                ELSE nullhdr % ma
            END
        ))) AS nullhdr2
    FROM null_headers
),
table_estimates AS (
    SELECT
        pg_class.oid AS relid,
        schemaname,
        tablename,
        bs,
        reltuples::NUMERIC AS est_rows,
        relpages * bs AS table_bytes,
        CEIL((reltuples * (datahdr + nullhdr2 + 4 + ma - (
            CASE
                WHEN datahdr % ma = 0 THEN ma
                ELSE datahdr % ma
            END
        )) / (bs - 20))) * bs AS expected_bytes,
        reltoastrelid
    FROM data_headers
    JOIN pg_class
        ON tablename = relname
    JOIN pg_namespace
        ON relnamespace = pg_namespace.oid
        AND schemaname = nspname
    WHERE pg_class.relkind = 'r'
),
estimates_with_toast AS (
    SELECT
        relid,
        schemaname,
        tablename,
        est_rows,
        table_bytes + (COALESCE(toast.relpages, 0) * bs) AS table_bytes,
        expected_bytes + (CEIL(COALESCE(toast.reltuples, 0) / 4 ) * bs) AS expected_bytes
    FROM table_estimates
    LEFT OUTER JOIN pg_class AS toast
        ON table_estimates.reltoastrelid = toast.oid
        AND toast.relkind = 't'
),
table_estimates_plus AS (
    SELECT
        relid,
        schemaname,
        tablename,
        est_rows,
        CASE
            WHEN table_bytes > 0 THEN table_bytes
            ELSE NULL
        END AS table_bytes,
        CASE
            WHEN expected_bytes > 0 AND table_bytes > 0 AND expected_bytes <= table_bytes THEN (table_bytes - expected_bytes)
            ELSE 0
        END AS bloat_bytes
    FROM estimates_with_toast

    UNION ALL

    SELECT
        relid,
        table_schema,
        table_name,
        est_rows,
        table_size,
        NULL
    FROM no_stats
)

SELECT
    relid AS identifier,
    (SELECT oid FROM pg_catalog.pg_database WHERE datname = current_database()) AS database_identifier,
    schemaname AS schema_name,
    tablename AS table_name,
    table_bytes AS size,
    bloat_bytes AS bloat_size,
    est_rows AS estimated_rows
FROM table_estimates_plus;
