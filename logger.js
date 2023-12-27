require("dotenv").config({ path: "./.env" });
const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, prettyPrint, timestamp } = format;

const logger = createLogger({
  format: combine(
    timestamp({
      format: () => {
        return new Date().toLocaleString("en-us", { timeZone: "Asia/Manila" });
      },
    }),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `log/${process.env.PROCESS}/info.log`,
    }),
    new transports.File({
      level: "error",
      filename: `log/${process.env.PROCESS}/error.log`,
    }),
    new transports.File({
      level: "verbose",
      filename: `log/${process.env.PROCESS}/verbose.log`,
    }),
  ],
});

module.exports = logger;
