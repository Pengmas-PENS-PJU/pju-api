-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorData" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensorTypeId" INTEGER NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LampLog" (
    "id" SERIAL NOT NULL,
    "on" BOOLEAN NOT NULL,
    "brightness" INTEGER NOT NULL,
    "isPJU" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LampLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_name_key" ON "SensorType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_code_key" ON "SensorType"("code");

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_sensorTypeId_fkey" FOREIGN KEY ("sensorTypeId") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
