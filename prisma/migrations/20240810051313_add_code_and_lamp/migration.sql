/*
  Warnings:

  - The primary key for the `SensorType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SensorType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `SensorType` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `sensorTypeId` on the `SensorData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `code` to the `SensorType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SensorData" DROP CONSTRAINT "SensorData_sensorTypeId_fkey";

-- AlterTable
ALTER TABLE "SensorData" DROP COLUMN "sensorTypeId",
ADD COLUMN     "sensorTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SensorType" DROP CONSTRAINT "SensorType_pkey",
ADD COLUMN     "code" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "LampLog" (
    "id" SERIAL NOT NULL,
    "on" BOOLEAN NOT NULL,
    "brightsness" INTEGER NOT NULL,
    "isPJU" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LampLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_code_key" ON "SensorType"("code");

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_sensorTypeId_fkey" FOREIGN KEY ("sensorTypeId") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
