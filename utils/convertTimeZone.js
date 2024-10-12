const { DateTime } = require('luxon');

const convertTimeZone = (dateColumn, timeZone = 'Asia/Jakarta') => {
  if (!dateColumn) {
    return null;
  }

  const convertedTime = DateTime.fromJSDate(dateColumn, { zone: 'utc' }).setZone(timeZone);

  return convertedTime;
};

module.exports = {
  convertTimeZone,
};
