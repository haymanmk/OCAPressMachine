module.exports = {
  DB_NAME: "PESupport",
  USER_NAME: "pieng",
  PASSWORD: "Q2iT5cwHJW3FH",
  HOSTNAME: "t1-pe-support",
  DATABASE_OPT: {
    dialect: "mssql",
    port: 1433, // Default port
    logging: false, // disable logging; default: console.log

    dialectOptions: {
      requestTimeout: 30000, // timeout = 30 seconds
    },
  },
};
