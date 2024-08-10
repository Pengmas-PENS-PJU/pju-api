/*
  Warnings:

  - The primary key for the `SensorType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SensorData" DROP CONSTRAINT "SensorData_sensorTypeId_fkey";

-- AlterTable
ALTER TABLE "SensorData" ALTER COLUMN "sensorTypeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SensorType" DROP CONSTRAINT "SensorType_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SensorType_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_sensorTypeId_fkey" FOREIGN KEY ("sensorTypeId") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
