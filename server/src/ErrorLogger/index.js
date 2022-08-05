const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}: ${level}: ${message}`;
});

const transportError = new transports.DailyRotateFile({
  level: "error",
  dirname: "logs",
  filename: "application-error-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});
const transport = new transports.DailyRotateFile({
  dirname: "logs",
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

transport.on("rotate", function (oldFilename, newFilename) {
  // do something fun
});

const logger = createLogger({
  level: "info",
  format: combine(
    format.timestamp({
      format: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Taipei",
        hour12: false,
      }),
    }),
    myFormat
  ),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new transports.File({
    //   filename: "error.log",
    //   level: "error",
    // }),
    // new transports.File({ filename: "combined.log" }),
    transportError,
    transport,
  ],
  silent: false,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

module.exports = logger;
