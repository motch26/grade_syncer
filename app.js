require("dotenv").config({ path: "./.env" });
const logger = require("./logger");

const { getAllPendingRecords, getIndividualGrades } = require("./utils");

const startProcess = async () => {
  logger.info(`Start ${process.env.PROCESS} Process`);

  const rows = await getAllPendingRecords();
  if (rows.length) {
    logger.info("Processing records");
    for (const row of rows) {
      await getIndividualGrades(row.student_grades_id);
    }
  } else {
    logger.info("No records to process.");
  }
  logger.info("Process Finished.");
};

startProcess();
