SELECT
  s.dbid,
  s.queryid,
  s.query,
  s.calls,
  s.total_exec_time
FROM pg_stat_statements s
JOIN pg_catalog.pg_database d
  ON s.dbid = d.oid
WHERE s.toplevel = TRUE
  AND d.datname = $1;