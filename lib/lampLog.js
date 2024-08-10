const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// check if lamp status
exports.isLampStatusSame = async () => {
  try {
    // cke status dari pju
    const pjuLampLog = await prisma.lampLog.findFirst({
      where: { isPJU: true },
      orderBy: { timestamp: "desc" },
    });

    // check dari pju client
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
