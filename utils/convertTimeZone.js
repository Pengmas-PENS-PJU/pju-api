const { DateTime } = require('luxon')

const convertTimeZone = (dateColumn, timeZone = 'Asia/Jakarta') => {
  if (!dateColumn) {
    return null
  }

  const convertedTime = DateTime.fromJSDate(dateColumn, {
    zone: 'utc',
  }).setZone(timeZone)

  return convertedTime.toISO()
}

const toLocalString = (dateColumn) => {
  if (!dateColumn) {
    return null
  }

  const date = new Date(dateColumn)

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }

  return date.toLocaleString('id-ID', options)
}

module.exports = {
  convertTimeZone,
  toLocalString,
}
