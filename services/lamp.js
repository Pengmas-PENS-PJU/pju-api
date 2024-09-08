const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// add lamp log
exports.addLampLog = async (lamp) => {
  try {
    const lampLog = await prisma.lampLog.create({
      data: {
        on: lamp.on,
        isPJU: lamp.isPJU,
        automated: lamp.automated,
      },
    });

    return lampLog;
  } catch (error) {
    throw new Error(`Cannot add lamp log ${error.message}`);
  }
};

exports.getLastLampLog = async (isPJU) => {
  try {
    const lamp = await prisma.lampLog.findFirst({
      where: { isPJU: isPJU },
      orderBy: { timestamp: "desc" },
    });

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

    const isSameOn = pjuLampLog?.on === nonPjuLampLog?.on;
    const isSameAuto = pjuLampLog?.automated === nonPjuLampLog?.automated;

    if (!isSameOn) {
      return {
        isSame: false,
        success: true,
        clientLampStatus: nonPjuLampLog,
        config: "on",
        value: nonPjuLampLog.automated,
      };
    } else if (!isSameAuto) {
      return {
        isSame: false,
        success: true,
        clientLampStatus: nonPjuLampLog,
        config: "auto",
        value: nonPjuLampLog.on,
      };
    } else {
      return { isSame: true, success: true, clientLampStatus: nonPjuLampLog };
    }
  } catch (error) {
    console.error("Error checking lamp status:", error.message);
    return { isSame: false, success: false, error: error.message };
  }
};
