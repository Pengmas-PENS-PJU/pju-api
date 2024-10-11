-- AlterTable
ALTER TABLE "MonitorData" ADD COLUMN     "pju_id" INTEGER;

-- AlterTable
ALTER TABLE "SensorData" ADD COLUMN     "pju_id" INTEGER;

-- CreateTable
CREATE TABLE "Pju" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT,
    "lat" TEXT,
    "longtitude" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pju_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT,
    "pju_id" INTEGER NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_pju_id_fkey" FOREIGN KEY ("pju_id") REFERENCES "Pju"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorData" ADD CONSTRAINT "MonitorData_pju_id_fkey" FOREIGN KEY ("pju_id") REFERENCES "Pju"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config" ADD CONSTRAINT "config_pju_id_fkey" FOREIGN KEY ("pju_id") REFERENCES "Pju"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
