const Readline = require("@serialport/parser-readline");
var { SerialPort, ReadlineParser, SerialPortMock } = require("serialport");
const EventEmitter = require("events");

class RS232 {
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  /**
   * This method is used to list all the devices connecting to your host now, and it is supported a Promise return.
   *
   * @returns {Promise} results of port info in Object form
   */
  static List() {
    return new Promise((resolve, reject) => {
      SerialPort.list()
        .then((portInfo) => {
          resolve(portInfo);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * This method is used to find the com port path with specified property of port information as parameter portProperty.
   *
   * @param {Object=} portProperty - search for the port having property specified in Object portProperty, and if successful, it returns port's path.
   *                                  e.g. { manufacturer: 'Moxa Inc.' }
   * @returns {Promise} path of port
   */
  static Find(portProperty) {
    return new Promise((resolve, reject) => {
      this.List()
        .then((portInfo) => {
          if (!portProperty) resolve(portInfo);
          else {
            portInfo.map((info) => {
              if (
                info[Object.keys(portProperty)[0]] ===
                Object.values(portProperty)[0]
              ) {
                // console.log(info.path);
                resolve(info.path);
              }
            });
            resolve(null);
          }
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    });
  }

  /**
   * Connect to a serial port.
   *
   * @param {String} devPath - the path of device
   * @param {Number} baudRate - baud rate
   * @returns {Promise} - if success, emit an event, 'open'. Promise is also supported.
   */
  Connect(devPath, baudRate = 9600) {
    this.serialPort = new SerialPort({
      path: devPath,
      baudRate: baudRate,
    });

    return new Promise((resolve, reject) => {
      this.serialPort.on("open", (err) => {
        if (err) reject(err);
        else {
          this.EnableReadLineParser();
          this.InitEventHandler();
          resolve(this.emit("open"));
        }
      });
    });
  }

  Write(data) {
    try {
      const jsonData = JSON.parse(data);
      this.serialPort.write(jsonData);
    } catch (err) {
      this.serialPort.write(data);
      console.log("Failed to parse data during writing data via serial port");
      console.log(err);
    }
  }

  EnableReadLineParser() {
    this.readLineParser = this.serialPort.pipe(new ReadlineParser());
  }

  InitEventHandler() {
    // this.serialPort.on("error", this.EventHandlerSerialPortError);
    // this.serialPort.on("close", this.EventHandlerSerialPortError);
    // this.serialPort.on("open", this.EventHandlerSerialPortOpen);
    this.serialPort.on("data", this.EventHandlerReadLineParser);
  }

  EventHandlerSerialPortError(err) {
    this.emit("error", err);
  }

  EventHandlerSerialPortClose(err) {
    this.emit("close", err);
  }
  EventHandlerSerialPortOpen(err) {
    this.emit("open", err);
  }

  EventHandlerReadLineParser(data) {
    let str = data.toString(); //Convert to string
    str = str.replace(/\r?\n|\r/g, ""); //remove '\r' from this String

    try {
      str = JSON.stringify(data); // Convert to JSON
      let jsonData = JSON.parse(data); //Then parse it
      console.log(this.eventEmitter.emit("dataReady", jsonData, null));
      console.log(this.eventEmitter.eventNames());
      console.log("emit json", jsonData);
    } catch (err) {
      //   this.emit("dataReady", str, err);
    }
  }

  mockSerialPort(path = "/dev/robot", baudRate = 9600) {
    SerialPortMock.binding.createPort(path);
    this.serialPort = new SerialPortMock({ path, baudRate: baudRate });
    this.InitEventHandler();
    this.serialPort.on("open", () => {
      console.assert(this.serialPort.isOpen, "serial port not opened");
      this.serialPort.port.emitData(
        JSON.stringify({ key: "hello alley" }) + "\n"
      );
      //   this.serialPort.port.emitData("\n");
      this.eventEmitter.emit("opened");
      console.log(this.eventEmitter.eventNames());
    });
    console.log(this.serialPort.eventNames());
  }
}

module.exports = RS232;
