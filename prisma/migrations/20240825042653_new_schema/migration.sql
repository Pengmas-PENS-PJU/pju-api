-- CreateTable
CREATE TABLE "MonitorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "MonitorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonitorData" (
    "id" SERIAL NOT NULL,
    "value" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monitorTypeId" INTEGER NOT NULL,

    CONSTRAINT "MonitorData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonitorType_name_key" ON "MonitorType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MonitorType_code_key" ON "MonitorType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MonitorType_unit_key" ON "MonitorType"("unit");

-- AddForeignKey
ALTER TABLE "MonitorData" ADD CONSTRAINT "MonitorData_monitorTypeId_fkey" FOREIGN KEY ("monitorTypeId") REFERENCES "MonitorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
