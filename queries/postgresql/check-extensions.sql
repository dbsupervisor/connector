SELECT
	e.extname AS "name"
FROM pg_extension e
WHERE e.extname = ANY($1::text[]);