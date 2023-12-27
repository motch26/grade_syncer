require("dotenv").config({ path: "../.env" });
const logger = require("../logger");

const {
  endConnection,
  startLocalConnection,
  startCloudConnection,
} = require("../config");

const getAllPendingRecords = async () => {
  const conn =
    process.env.PROCESS === "LOCAL"
      ? await startLocalConnection()
      : await startCloudConnection();
  try {
    const [rows] = await conn.query(
      "SELECT student_grades_id FROM grade_logs WHERE status = 'NP'"
    );
    logger.info(`Not Processed: ${rows.length}`);
    await endConnection(conn);
    return rows;
  } catch (error) {
    logger.error(`[getAllPendingRecords] ERRFETCH - ${error.message}`);
  }
};

const getIndividualGrades = async (student_grades_id) => {
  const conn =
    process.env.PROCESS === "LOCAL"
      ? await startLocalConnection()
      : await startCloudConnection();
  try {
    logger.verbose(`Processing student_grades_id: ${student_grades_id}`);
    const [rows] = await conn.query(
      "SELECT student_grades_id, mid_grade, final_grade, grade, remarks FROM student_grades WHERE student_grades_id = ?",
      [student_grades_id]
    );
    const row = rows[0];
    await updateGradeToOtherDB(row);

    logger.verbose(`Change status: ${student_grades_id}`);
    await conn.execute(
      "UPDATE grade_logs SET status = 'P' WHERE student_grades_id = ?",
      [student_grades_id]
    );

    await endConnection(conn);
  } catch (error) {
    logger.error(`[getIndividualGrades] ERRFETCH: ${error.message}`);
  }
};

const updateGradeToOtherDB = async (row) => {
  const { student_grades_id, mid_grade, final_grade, grade, remarks } = row;
  const otherConn =
    process.env.PROCESS === "LOCAL"
      ? await startCloudConnection()
      : await startLocalConnection();
  try {
    logger.verbose("Updating Grade.");
    await otherConn.execute(
      "UPDATE student_grades SET mid_grade = ?, final_grade = ?, grade = ?, remarks = ? WHERE student_grades_id = ?",
      [mid_grade, final_grade, grade, remarks, student_grades_id]
    );
  } catch (error) {
    logger.error(`[updateGradeToOtherDB] ERRUPDATE - ${error.message}`);
  }
  await endConnection(otherConn);
};
module.exports = {
  getAllPendingRecords,
  getIndividualGrades,
};
