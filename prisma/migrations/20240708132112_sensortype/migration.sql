/*
  Warnings:

  - You are about to drop the column `type` on the `SensorData` table. All the data in the column will be lost.
  - Added the required column `sensorTypeId` to the `SensorData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SensorData" DROP COLUMN "type",
ADD COLUMN     "sensorTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SensorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_sensorTypeId_fkey" FOREIGN KEY ("sensorTypeId") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
