/*
  Warnings:

  - You are about to drop the column `brightness` on the `LampLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LampLog" DROP COLUMN "brightness";

-- AlterTable
ALTER TABLE "MonitorData" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "SensorData" ADD COLUMN     "code" TEXT;

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");
