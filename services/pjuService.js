const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const CustomError = require('../utils/customError');

// check if exist
const getPjuById = async (id) => {
    const pju = await prisma.pju.findFirst({
        where: { id: id },
    });

    if (!pju) {
        throw new CustomError('Pju doesnt exist', 400);
    }

    return pju;
};

const setPjuDefault = (pju_id, defaultValue = 1) => {
    if (typeof pju_id === 'undefined') {
        return defaultValue;
    } else if (typeof pju_id === 'string') {
        return parseInt(pju_id, 10);
    } else {
        return pju_id;
    }
};

module.exports = { getPjuById, setPjuDefault };
