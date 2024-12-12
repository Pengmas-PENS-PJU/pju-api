const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { subMonths } = require('date-fns');
const { DateTime } = require('luxon');
const { convertTimeZone, toLocalString } = require('../utils/convertTimeZone');

// tambah semua data monitor
exports.addMonitorData = async (monitor, pjuId) => {
    const monitorPromises = monitor.map(async (monitorItem) => {
        const monitorType = await prisma.monitorType.findUnique({
            where: {
                code: monitorItem.attributeCode,
            },
        });

        if (!monitorType) {
            throw new Error(`monitor type with code ${monitorItem.attributeCode} not found`);
        }

        return await prisma.monitorData.create({
            data: {
                value: monitorItem.value,
                monitorTypeId: monitorType.id,
                code: monitorItem.attributeCode,
                pju_id: pjuId,
            },
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
            orderBy: { timestamp: 'desc' },
            include: { monitorType: true },
        });
    });

    return await Promise.all(latestMonitorDataPromises);
};

exports.getMonitorByFilter = async (filter, pjuId) => {
    try {
        console.log('muulai');
        const monitorTypes = await prisma.monitorType.findMany({
            where: {
                code: {
                    in: filter,
                },
            },
        });

        if (monitorTypes.length === 0) {
            return [];
        }

        console.log('ambi tipe');

        // get sensor by type
        const monitorDataPromises = monitorTypes.map(async (monitorType) => {
            return await prisma.monitorData.findFirst({
                where: {
                    pju_id: pjuId,
                    monitorTypeId: monitorType.id,
                },
                orderBy: {
                    timestamp: 'desc',
                },
            });
        });

        console.log('ambi data');

        const monitorDataResults = await Promise.all(monitorDataPromises);

        return monitorDataResults.filter((data) => data !== null);
    } catch (error) {
        console.error('Error getting sensor data by filter:', error.message);
        throw new Error('Failed to get sensor data by filter');
    }
};

// get moniotr data by type id
exports.getMonitorById = async (typeId, multiple = true) => {
    if (multiple) {
        const monitors = await prisma.monitorData.findMany({
            where: {
                monitorTypeId: typeId,
            },
            orderBy: {
                timestamp: 'desc',
            },
            limit: 10,
        });

        return monitors;
    }

    const monitor = await prisma.monitorData.findFirst({
        where: {
            monitorTypeId: typeId,
        },
        orderBy: {
            timestamp: 'desc',
        },
    });

    return monitor;
};

exports.DeleteByPjuIdAndTimestamp = async (pjuId, timestamp) => {
    const oneMonthBefore = subMonths(new Date(timestamp), 1);
    
    return await prisma.monitorData.deleteMany({
        where: {
            pju_id: pjuId,
            timestamp: {
                lt: oneMonthBefore,
            },
        },
    });
};


exports.GetMonitorDataByRange = async (monitorCode = [], startDate = null, endDate = null, pju_id) => {
    const monitorData = await prisma.monitorData.findMany({
        where: {
          code: { in: monitorCode },
          ...(startDate || endDate
            ? {
                timestamp: {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lt: endDate }),
                },
              }
            : {}),
            pju_id: pju_id,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });    

    const formattedMonitorData = monitorData.map((data) => {
        data.timestamp = toLocalString(data.timestamp);

        return data;
    });


    return formattedMonitorData;
  };
  
