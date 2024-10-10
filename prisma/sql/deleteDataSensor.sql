DELETE FROM "SensorData"
WHERE id IN (
    SELECT id FROM "SensorData"
    ORDER BY "timestamp" ASC
    LIMIT (SELECT COUNT(*) - 50000 FROM "SensorData")
);