const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { Database, RS232 } = require("./src/index.js");
const logger = require("./src/ErrorLogger/");
const ReadConfig = require("./src/configs");
const config = require("./src/config.js");

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
  let db = await new Database(
    (hostName = HOSTNAME),
    (dbName = DB_NAME),
    (userName = USER_NAME),
    (password = PASSWORD),
    (opt = DATABASE_OPT)
  );
  db.on("connect", () => {
    console.log("Successfully connected to database");
  });

  let rs232;
  let target = { manufacturer: "Moxa Inc." };

  rs232 = new RS232();
  rs232.on("open", () => {
    logger.info("Serial opened");
    rs232.serialPort.port.emitData(
      JSON.stringify({ key: "hello alley" }) + "\n"
    );
  });
  rs232.on("data", (data, err) => {
    if (err) {
      logger.error(`error occurred {err: ${err}, data: ${data}}`);
    } else {
      console.log(data);
    }
  });
  rs232.mockSerialPort();

  //   RS232.Find(target)
  //     .then((result) => {
  //       if (!result) {
  //         Logger.error(`Cannot find ${JSON.stringify(target)}.`);
  //         return;
  //       }

  //       rs232 = new RS232();
  //       rs232.Connect(result, 9600);
  //       rs232.on("open", (err) => {
  //         if (err) {
  //           Logger.error("Error occurred when opening RS232: " + err);
  //         } else {
  //           Logger.info("Successfully opened rs232");
  //           rs232.Write("Hello world!\n");
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       Logger.error(err);
  //     });

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
  let port = 80 | process.env.PORT;
  app.listen(port, () => {
    logger.info(`Currenttly listening at port ${port}`);
  });
}

Main();

// var Connection = require('tedious').Connection;
// var Request = require('tedious').Request;
// var TYPES = require('tedious').TYPES;

// // Create connection to database
// var config = {
//     server: 't1-pe-support',
//     authentication: {
//         type: 'default',
//         options: {
//             userName: 'pieng', // update me
//             password: 'Q2iT5cwHJW3FH', // update me
//         }
//     },
//     options: {
//         database: 'PESupport',
//         trustServerCertificate: true,
//         // encrypt: true,
//         // enableArithAbort: true
//     }
// }
// var connection = new Connection(config);
// let tableName = 'dbo.PDO_Test_Table';

// // Attempt to connect and execute queries if connection goes through
// connection.on('connect', function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Connected');
//         InsertData({
//             MachineID: 'T3_OCA_01',
//             Result: 1,
//         }, tableName)
//         .then(rowCount=>{
//             console.log(`${rowCount} row(s) inserted`);
//         })
//         .catch(err=>{
//             console.log('[!] Error occurred during insert data: ', err);
//         });

//         RequestTableContents(10, tableName)
//         .catch(err=>{
//             console.log('[!] Error occurred during reading table contents...', err);
//         });
//     }
// });

// connection.on('error', (err) => {
//     console.log('Error occurred:', err);
// });

// connection.connect();

// function RequestTableContents(firstNRows, tableName) {
//     console.log('Reading rows from the Table...');
//     return new Promise((resolve, reject) => {

//         // Read all rows from table
//         var request = new Request(
//             `SELECT TOP ${firstNRows} * FROM ${tableName};`,
//             function (err, rowCount, rows) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     console.log(rowCount + ' row(s) returned');
//                     resolve(rowCount);
//                 }
//             });

//         // Print the rows read
//         var result = "";
//         request.on('row', function (columns) {
//             columns.forEach(function (column) {
//                 if (column.value === null) {
//                     console.log('NULL');
//                 } else {
//                     result += column.value + " ";
//                 }
//             });
//             console.log(result);
//             result = "";
//         });

//         // Execute SQL statement
//         connection.execSql(request);
//     })
// }

// /*
// para:
// model- an objectized data to be inserted in table.
// tableName- name of table.
// */
// function InsertData(model, tableName){
//     return new Promise((resolve, reject)=>{
//         let columns = '';
//         let values = '';

//         Object.keys(model).map((column, value)=>{
//             if (columns !== ''){
//                 columns+=',';
//                 values+=',';
//             }
//             columns += `${column}`;
//             values += `${value}`;
//         })
//         // console.log(columns,values);
//         var request = new Request(`INSERT INTO ${tableName} (${columns}) VALUES (${values});`,
//         (err, rowCount)=>{
//             if(err){
//                 reject(err);
//             }
//             else{
//                 resolve(rowCount);
//             }
//         });

//         connection.execSql(request);
//     });
// }
