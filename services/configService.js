const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const CustomError = require("../utils/customError");

// get pju configs by pjuId
const getConfigsByPjuId = async (pjuId) => {
  const configs = await prisma.config.findMany({
    where: { pju_id: pjuId },
  });

  return configs;
};

// get config by id
const getConfigById = async (id) => {
  const config = await prisma.config.findFirst({ id: id });

  if (!config) {
    throw new CustomError("Config doesn' exist", 400);
  }

  return config;
};

// get config by name
const getConfigByName = async (name) => {
  const config = await prisma.config.findFirst({ name: name });

  if (!config) {
    throw new CustomError("Config doesn' exist", 400);
  }
};

// check specific pju config
const checkDataSentConfig = async (pjuId, dataSent = "") => {
  if (!dataSent) {
    throw new CustomError("Specific config is null", 400);
  }

  // get cache first if exist
  const config = await getConfigsByPjuId(pjuId);

  if (!config || config.length === 0) {
    throw new CustomError("PJU configuration not found", 404);
  }

  const dataConfig = config.find((c) => c.name === "Data-Sent");
  if (!dataConfig) {
    throw new CustomError("Data-Sent configuration not found", 404);
  }

  let parsedConfig;
  try {
    parsedConfig = JSON.parse(dataConfig.value);
  } catch (error) {
    throw new CustomError("Invalid configuration format", 500);
  }

  if (!parsedConfig[dataSent]) {
    throw new CustomError(`${dataSent} data is not allowed for this PJU`, 400);
  }

  return true;
};

module.exports = {
  getConfigById,
  getConfigsByPjuId,
  checkDataSentConfig,
};
