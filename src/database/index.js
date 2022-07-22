const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const EventEmitter = require('events');

const { DB_NAME, USER_NAME, PASSWORD, HOSTNAME, DATABASE_OPT } = require('../config');

/**
 * This class takes care the connetion with microsoft sql database.
 */
class Database extends EventEmitter {
    constructor(hostName = HOSTNAME, dbName = DB_NAME, userName = USER_NAME, password = PASSWORD, opt = DATABASE_OPT) {
        super();
        
        this.hostName = hostName;
        this.dbName = dbName;
        this.userName = userName;
        this.password = password;
        this.opt = {
            ...opt,
            host: this.hostName,
        };
        this.state = {
            connected: false,
            error: false,
        }
        // Initialize Sequelize to connect to DB
        this.db = this.ConnectDB(this.dbName, this.userName, this.password, this.opt);
    }

    ConnectDB(dbName, userName, password, opt){
        let db = new Sequelize(this.dbName, this.userName, this.password, this.opt);

        // validate connection
        return new Promise((resolve, reject)=>{
            db.authenticate()
            .then(result=>{
                console.log('Connection has been established successfully.');
                this.state.connected = true;
                this.state.error = false;
                this.emit('connected');
                resolve(db);
            })
            .catch(err=>{
                console.error('Unable to connect to the database:', error);
                this.state.connected = false;
                this.state.error = true;
                this.emit('error');
                reject(err);
            });
        });
    }

    ReadNRows(nRows, tableName){
        Model.findAll()
    }
}

module.exports = Database;