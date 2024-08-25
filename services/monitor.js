const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// tambah semua data monitor
exports.addMonitorData = async (monitor) => {
  const monitorPromises = monitor.map(async (monitorItem) => {
    const monitorType = await prisma.monitorType.findUnique({
      where: {
        code: monitorItem.attributeCode,
      },
    });

    if (!monitorType) {
      throw new Error(
        `monitor type with code ${monitorItem.attributeCode} not found`
      );
    }

    return await prisma.monitorData.create({
      data: {
        value: monitorItem.value,
        monitorTypeId: monitorType.id,
      },
      include: { monitorType: true },
    });
  });

  return await Promise.all(monitorPromises);
};

// ambil semua data sensor terbaru
exports.getAllLatest = async () => {
  const monitorTypes = await prisma.monitorType.findMany();

  const latestMonitorDataPromises = monitorTypes.map(async (monitorType) => {
    return await prisma.monitorData.findFirst({
      where: { monitorTypeId: parseInt(monitorType.id) },
      orderBy: { timestamp: "desc" },
      include: { monitorType: true },
    });
  });

  return await Promise.all(latestMonitorDataPromises);
};
