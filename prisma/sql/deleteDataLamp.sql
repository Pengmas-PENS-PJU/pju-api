DELETE FROM "LampLog"
WHERE id IN (
    SELECT id FROM "LampLog"
    ORDER BY "timestamp" ASC
    LIMIT (SELECT COUNT(*) - 50000 FROM "LampLog")
);