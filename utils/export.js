const excelJS = require("exceljs");

const toXlsx = async (data = []) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
        { header: "Code", key: "code", width: 15 },
        { header: "Created At", key: "timestamp", width: 25 },
        { header: "Value", key: "value", width: 10 },
    ];

    // Tambahkan data ke worksheet
    data.forEach((item) => {
        worksheet.addRow({
            code: item.code,
            timestamp: item.timestamp,
            value: item.value,
        });
    });

    // Kembalikan workbook untuk disimpan atau dikirim
    return workbook;
};


module.exports = {
    toXlsx,
}