DELETE FROM "LampLog"
WHERE AGE(NOW(), "timestamp") > '1 day';