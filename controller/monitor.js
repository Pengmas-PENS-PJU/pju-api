const express = require('express');
const router = express.Router();
const { getIo } = require('../socket');
const monitorService = require('../services/monitor.js');
const { validateMonitorPayload } = require('../validate/validate.js');
const pjuService = require('../services/pjuService.js');
const configService = require('../services/configService.js');
const { DateTime } = require('luxon');
const { toXlsx } = require('../utils/export.js');

const allowedMonitorCodes = ['VOLT', 'CURR', 'POW', 'TEMP', 'LUM'];

exports.AddMonitorData = async (req, res) => {
    const { monitor, pju_id } = req.body;

    try {
        const validation = validateMonitorPayload(monitor, allowedMonitorCodes);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message,
                data: {},
            });
        }

        // set pju
        let ValidPjuId = pjuService.setPjuDefault(pju_id);

        await pjuService.getPjuById(ValidPjuId);

        // check config
        await configService.checkDataSentConfig(ValidPjuId, 'monitor');

        if (monitor) {
            result = await monitorService.addMonitorData(monitor, ValidPjuId);

            const startOfDayInUTC = DateTime.now().setZone('Asia/Jakarta').startOf('day').toUTC().toJSDate();

            await monitorService.DeleteByPjuIdAndTimestamp(ValidPjuId, startOfDayInUTC);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Data tidak boleh kosong',
                data: {},
            });
        }

        // trigger frontend
        if (result) {
            const io = getIo();
            io.emit('monitorUpdate', result);
        }

        return res.status(201).json({
            success: true,
            message: 'Berhasil memasukkan data',
            data: result,
        });
    } catch (error) {
        console.error('Error saving data:', error.message);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan data',
            error: error.message,
            data: {},
        });
    }
};

// get monitor data
exports.GetMonitorData = async (req, res) => {
    const { pjuId } = req.params;
    const pjuIdInt = parseInt(pjuId);

    try {
        const monitorData = await monitorService.getMonitorByFilter(allowedMonitorCodes, pjuIdInt);
        // const monitorData = await monitorService.getAllLatest();

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data',
            data: monitorData,
        });
    } catch (error) {
        console.error('Error getting monitor data:', error.message);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data',
            error: error.message,
            data: {},
        });
    }
};

// export weather data
exports.ExportMonitorData = async (req, res) => {
    const { pju_id } = req.body;

    const paramStartDate = req.query.startDate ?? null;
    const paramEndDate = req.query.endDate ?? null;
    const paramCode = req.query.code ?? null;

    try {
        let ValidPjuId = pjuService.setPjuDefault(pju_id);

        await pjuService.getPjuById(ValidPjuId);
    
        const startDate = paramStartDate != null ? DateTime.fromISO(paramStartDate, { zone: 'Asia/Jakarta' }).startOf('day').toJSDate() : null;
        const endDate = paramEndDate != null ? DateTime.fromISO(paramEndDate, { zone: 'Asia/Jakarta' }).endOf('day').toJSDate() : null;

        // if null or not allowed return null
        let codes = paramCode ? paramCode.split(',').filter((code) => allowedMonitorCodes.includes(code)): [];
        if (codes.length === 0) {
            codes = null;
        }

        const monitorData = await monitorService.GetMonitorDataByRange(
            codes == null ? allowedMonitorCodes : codes,
            startDate,
            endDate,
            ValidPjuId,
        );

        if (monitorData.length > 0) {
            const workbook = await toXlsx(monitorData);
            const filename = `MonitorData_${DateTime.now().setZone("Asia/Jakarta").toFormat("yyyy-LL-dd_HH-mm-ss")}.xlsx`;
            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition",`attachment; filename="${filename}"`);

            return res.status(200).send(buffer);

        } else {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data yang ditemukan untuk rentang tanggal ini.",
            });
        }
    } catch (error) {
      console.error('Error getting monitor data:', error.message);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data',
        error: error.message,
        data: {},
      });
    }
  }
  