const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const TYPES = require("tedious").TYPES;
const EventEmitter = require("events");

const {
  DB_NAME,
  USER_NAME,
  PASSWORD,
  HOSTNAME,
  DATABASE_OPT,
} = require("../config");

/**
 * This class takes care the connetion with microsoft sql database.
 */
class Database extends EventEmitter {
  constructor(
    hostName = HOSTNAME,
    dbName = DB_NAME,
    userName = USER_NAME,
    password = PASSWORD,
    opt = DATABASE_OPT
  ) {
    super();

    this.hostName = hostName;
    this.dbName = dbName;
    this.userName = userName;
    this.password = password;
    this.state = {
      connected: false,
      error: false,
    };

    this.config = {
      server: this.hostName,
      authentication: {
        type: "default",
        options: {
          userName: this.userName, // update me
          password: this.password, // update me
        },
      },
      options: {
        database: this.dbName,
        trustServerCertificate: true,
        // encrypt: true,
        // enableArithAbort: true
      },
    };

    // create connection to DB
    this.connection = this.ConnectDB(this.config);

    this.InitEventHandler();
  }

  ConnectDB(config) {
    let connection = new Connection(config);
    connection.connect();

    return connection;
  }

  InitEventHandler() {
    this.connection.on("connect", this.EventHandlerConnect.bind(this));
    this.connection.on("error", this.EventHandlerConnectError.bind(this));
  }

  EventHandlerConnect(err) {
    this.emit("connect", err);
  }

  EventHandlerConnectError(err) {
    this.emit("error", err);
  }
}

let tableName = "dbo.PDO_Test_Table";
/*
// Attempt to connect and execute queries if connection goes through
connection.on("connect", function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
    InsertData(
      {
        MachineID: "T3_OCA_01",
        Result: 1,
      },
      tableName
    )
      .then((rowCount) => {
        console.log(`${rowCount} row(s) inserted`);
      })
      .catch((err) => {
        console.log("[!] Error occurred during insert data: ", err);
      });

    RequestTableContents(10, tableName).catch((err) => {
      console.log("[!] Error occurred during reading table contents...", err);
    });
  }
});

connection.on("error", (err) => {
  console.log("Error occurred:", err);
});

connection.connect();

function RequestTableContents(firstNRows, tableName) {
  console.log("Reading rows from the Table...");
  return new Promise((resolve, reject) => {
    // Read all rows from table
    var request = new Request(
      `SELECT TOP ${firstNRows} * FROM ${tableName};`,
      function (err, rowCount, rows) {
        if (err) {
          reject(err);
        } else {
          console.log(rowCount + " row(s) returned");
          resolve(rowCount);
        }
      }
    );

    // Print the rows read
    var result = "";
    request.on("row", function (columns) {
      columns.forEach(function (column) {
        if (column.value === null) {
          console.log("NULL");
        } else {
          result += column.value + " ";
        }
      });
      console.log(result);
      result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
  });
}
*/
module.exports = Database;
