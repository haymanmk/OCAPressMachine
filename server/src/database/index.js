const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const TYPES = require("tedious").TYPES;
const EventEmitter = require("events");
const filepath = require("filepath");
const ReadConfig = require("../configs/index.js");

const {
  DB_NAME,
  USER_NAME,
  PASSWORD,
  HOSTNAME,
  DATABASE_OPT,
  MAIN_CONFIG,
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
          userName: this.userName,
          password: this.password,
        },
      },
      options: {
        database: this.dbName,
        trustServerCertificate: true,
      },
    };

    this.ReadMainConfig()
      .then((conf) => {
        this.mainConfig = conf;
      })
      .catch((err) => {
        this.emit(err);
      });

    // this.connection = this.ConnectDB(this.config);
    // this.InitEventHandler();
  }

  ConnectDB() {
    this.connection = new Connection(this.config);
    this.connection.connect();
    this.InitEventHandler();

    return new Promise((resolve, reject) => {
      this.connection.on("connect", (err) => {
        if (err) {
          this.emit(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
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

  ReadMainConfig() {
    const path = MAIN_CONFIG;

    return new Promise((resolve, reject) => {
      ReadConfig(path)
        .then((conf) => {
          resolve(conf);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  Insert(row, tableName) {
    console.log(`Inserting ${Object.keys(row)} into ${tableName}...`);

    const path = this.mainConfig.DataBase.DB_COLUMNS_CONFIG;

    return new Promise((resolve, reject) => {
      ReadConfig(path)
        .then((conf) => {
          //   console.log(conf);
          const columnNames = Object.keys(row);
          const valueVariables = columnNames.map((element) => {
            return `@${element}`;
          });

          let request = new Request(
            `INSERT INTO ${tableName} (${columnNames}) VALUES (${valueVariables});`,
            function (err, rowCount, rows) {
              if (err) {
                reject(err);
              } else {
                console.log(rowCount + " row(s) inserted");
                resolve();
              }
            }
          );

          columnNames.map((name) => {
            let type = conf.COLUMNS[name];
            request.addParameter(name, TYPES[type], row[name]);
          });

          // Execute SQL statement
          this.connection.execSql(request);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Update(name, location, callback) {
  //   console.log(
  //     "Updating Location to '" + location + "' for '" + name + "'..."
  //   );

  //   // Update the employee record requested
  //   request = new Request(
  //     "UPDATE TestSchema.Employees SET Location=@Location WHERE Name = @Name;",
  //     function (err, rowCount, rows) {
  //       if (err) {
  //         callback(err);
  //       } else {
  //         console.log(rowCount + " row(s) updated");
  //         callback(null, "Jared");
  //       }
  //     }
  //   );
  //   request.addParameter("Name", TYPES.NVarChar, name);
  //   request.addParameter("Location", TYPES.NVarChar, location);

  //   // Execute SQL statement
  //   connection.execSql(request);
  // }

  // Delete(name, callback) {
  //   console.log("Deleting '" + name + "' from Table...");

  //   // Delete the employee record requested
  //   request = new Request(
  //     "DELETE FROM TestSchema.Employees WHERE Name = @Name;",
  //     function (err, rowCount, rows) {
  //       if (err) {
  //         callback(err);
  //       } else {
  //         console.log(rowCount + " row(s) deleted");
  //         callback(null);
  //       }
  //     }
  //   );
  //   request.addParameter("Name", TYPES.NVarChar, name);

  //   // Execute SQL statement
  //   connection.execSql(request);
  // }

  // Read(callback) {
  //   console.log("Reading rows from the Table...");

  //   // Read all rows from table
  //   request = new Request(
  //     "SELECT Id, Name, Location FROM TestSchema.Employees;",
  //     function (err, rowCount, rows) {
  //       if (err) {
  //         callback(err);
  //       } else {
  //         console.log(rowCount + " row(s) returned");
  //         callback(null);
  //       }
  //     }
  //   );

  //   // Print the rows read
  //   var result = "";
  //   request.on("row", function (columns) {
  //     columns.forEach(function (column) {
  //       if (column.value === null) {
  //         console.log("NULL");
  //       } else {
  //         result += column.value + " ";
  //       }
  //     });
  //     console.log(result);
  //     result = "";
  //   });

  //   // Execute SQL statement
  //   connection.execSql(request);
  // }

  // Complete(err, result) {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     console.log("Done!");
  //   }
  // }
}

module.exports = Database;
