const schedule = require("node-schedule");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  deleteDataLamp,
  deleteDataMonitor,
  deleteDataSensor,
} = require("@prisma/client/sql");

const startDeleteScheduler = () => {
  //   schedule.scheduleJob("0 1 * * *", async function () {
  schedule.scheduleJob("0 1 * * *", async function () {
    try {
      console.log("Trying delete data sensor");
      const deletedSensor = await prisma.$queryRawTyped(deleteDataSensor());
      console.log("Deleted sensor: " + deletedSensor);

      console.log("Trying delete data monitor");
      const deletedMonitor = await prisma.$queryRawTyped(deleteDataMonitor());
      console.log("Deleted monitor: " + deletedMonitor);

      //   console.log("Trying delete data lamplog");
      //   const deletedLamp = await prisma.$queryRawTyped(deleteDataLamp());
      //   console.log("Deleted lamplog: " + deleted);
    } catch (error) {}
  });
};
console.log("Deleting latest data");

module.exports = { startDeleteScheduler };
