const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { Database, RS232 } = require("./src/index.js");
const logger = require("./src/ErrorLogger/");
const ReadConfig = require("./src/configs");

async function Main() {
  let config;
  await ReadConfig()
    .then((conf) => {
      config = conf;
      logger.info(JSON.stringify(conf));
    })
    .catch((err) => {
      logger.error(err);
    });

  let { HOSTNAME, DB_NAME, USER_NAME, PASSWORD, DATABASE_OPT } =
    config.DataBase;
  let db = new Database(
    (hostName = HOSTNAME),
    (dbName = DB_NAME),
    (userName = USER_NAME),
    (password = PASSWORD),
    (opt = DATABASE_OPT)
  );

  db.on("connect", () => {
    console.log("Successfully connected to database");
  });

  db.on("error", (err) => {
    logger.error(err);
  });

  await db.ConnectDB();

  let rs232;
  let target = { manufacturer: "Moxa Inc." };

  rs232 = new RS232();
  rs232.on("open", (err) => {
    if (err) {
      logger.error(`Error occurred after opening serial port: ${err}`);
    } else {
      logger.info("Serial opened");
      rs232.Write({ status: "success", data: {} });
    }
  });
  rs232.on("data", (data, err) => {
    if (err) {
      logger.error(`error occurred {err: ${err}, data: ${data}}`);
      rs232.Write({ status: "error", data: "unknown data" });
    } else {
      console.log(data);
      let response;

      switch (data.CMD) {
        case "status":
          response = { status: "ready" };
          rs232.Write(response);
          break;
        case "write":
          db.Insert(data.data, (tableName = "dbo.PDO_Test_Table"))
            .then(() => {
              response = { status: "success" };
              rs232.Write(response);
            })
            .catch((err) => {
              logger.error(err);
            });
          break;
        default:
          response = { status: "unknown", data: { data } };
          rs232.Write(response);
      }
    }
  });

  rs232.on("error", (err) => {
    logger.error(err);
  });

  // rs232.mockSerialPort();

  RS232.Find(target)
    .then((result) => {
      if (!result) {
        logger.error(`Cannot find ${JSON.stringify(target)}.`);
        return;
      }

      rs232.Connect(result, 9600).catch((err) => {
        logger.error(`Error occurred during connecting to serial port: ${err}`);
      });
    })
    .catch((err) => {
      logger.error(err);
    });

  const platform = process.platform;

  // Routing
  app.route("/").get((req, res) => {
    res.send("hello");
  });

  app.route("/portInfo").get((req, res) => {
    RS232.List()
      .then((portInfo) => {
        logger.info(portInfo);
        res.send(portInfo);
      })
      .catch((err) => {
        logger.error("Error occurred during reading port info: " + err);
        res.send(err);
      });
  });

  app.route("/platform").get((req, res) => {
    res.send(`Current platform is ${platform}`);
  });

  // create listener
  let port = 8500 | process.env.PORT;
  let ip = "172.16.0.10";
  app.listen(port, ip, () => {
    logger.info(`Currenttly listening at port ${port}`);
  });
}

Main();
