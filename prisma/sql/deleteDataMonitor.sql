DELETE FROM "MonitorData"
WHERE AGE(NOW(), "timestamp") > '1 day';