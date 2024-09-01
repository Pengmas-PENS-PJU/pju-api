const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// add lamp log
exports.addLampLog = async (lamp) => {
  try {
    const lampLog = await prisma.lampLog.create({
      data: {
        on: lamp.on,
        brightness: lamp.brightness,
        isPJU: lamp.isPJU,
        automated: lamp.automated,
      },
    });

    return lampLog;
  } catch (error) {
    throw new Error(`Cannot add lamp log ${error.message}`);
  }
};

exports.getLastLampLog = async () => {
  try {
    const lamp = await prisma.lampLog.findFirst({
      where: { isPJU: true },
      orderBy: { timestamp: "desc" },
    });

    // return Promise.all(lamp);

    return lamp;
  } catch (error) {
    throw new Error(`Cannot get last lamp log ${error.message}`);
  }
};

// check if lamp status is the same
exports.isLampStatusSame = async () => {
  try {
    // Check status dari PJU
    const pjuLampLog = await prisma.lampLog.findFirst({
      where: { isPJU: true },
      orderBy: { timestamp: "desc" },
    });

    // Check status dari non-PJU (client)
    const nonPjuLampLog = await prisma.lampLog.findFirst({
      where: { isPJU: false },
      orderBy: { timestamp: "desc" },
    });

    const isSame = pjuLampLog?.on === nonPjuLampLog?.on;

    return { isSame, success: true };
  } catch (error) {
    console.error("Error checking lamp status:", error.message);
    return { isSame: false, success: false, error: error.message };
  }
};
