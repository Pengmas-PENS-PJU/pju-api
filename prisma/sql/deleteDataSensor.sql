DELETE FROM "SensorData"
WHERE AGE(NOW(), "timestamp") >  '1 day';