DELETE FROM "MonitorData"
WHERE id IN (
    SELECT id FROM "MonitorData"
    ORDER BY "timestamp" ASC
    LIMIT (SELECT COUNT(*) - 50000 FROM "MonitorData")
);