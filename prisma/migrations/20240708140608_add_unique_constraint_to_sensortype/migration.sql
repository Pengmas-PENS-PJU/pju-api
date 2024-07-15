/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SensorType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SensorType_name_key" ON "SensorType"("name");
