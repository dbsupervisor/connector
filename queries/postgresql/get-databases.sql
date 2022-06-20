SELECT
    d.oid AS identifier,
    d.datname AS name,
    pg_database_size(d.datname) AS size,
    sd.numbackends AS connection_count,
    CASE
        WHEN (blks_hit + blks_read) > 0 THEN 100 * blks_hit / (blks_hit + blks_read)
        ELSE NULL
    END AS cache_hit_ratio
FROM pg_catalog.pg_database d
JOIN pg_catalog.pg_stat_database sd USING(datname);