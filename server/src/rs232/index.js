const { ReadlineParser } = require("@serialport/parser-readline");
var { SerialPort, SerialPortMock } = require("serialport");
const EventEmitter = require("events");

class RS232 extends EventEmitter {
  constructor() {
    super();
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
    this.devPath = devPath;
    this.baudRate = baudRate;
    this.serialPort = new SerialPort({
      path: devPath,
      baudRate: baudRate,
      autoOpen: false,
    });
    this.InitEventHandler();

    return new Promise((resolve, reject) => {
      if (this.serialPort.isOpen) {
        this.serialPort.flush();
        this.EnableReadLineParser();
        console.log("serial already opened.");
        resolve(this.serialPort.emit("open"));
      } else {
        console.log(`opening serial port ${devPath}`);
        this.serialPort.open((err) => {
          if (err) {
            setTimeout(this.Reconnect.bind(this), 5000);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }

  Reconnect() {
    this.Connect(this.devPath, this.baudRate).catch((err) => {
      console.log(err);
    });
  }

  Write(data) {
    try {
      const jsonData = JSON.stringify(data);
      this.serialPort.write(jsonData + "\n");
    } catch (err) {
      this.serialPort.write(data);
      console.log("Failed to parse data during writing data via serial port");
      console.log(err);
    }
  }

  EnableReadLineParser() {
    this.readLineParser = this.serialPort.pipe(new ReadlineParser());
    this.readLineParser.on("data", this.EventHandlerReadLineParser.bind(this));
  }

  InitEventHandler() {
    this.serialPort.on("error", this.EventHandlerSerialPortError.bind(this));
    this.serialPort.on("close", this.EventHandlerSerialPortError.bind(this));
    this.serialPort.on("open", this.EventHandlerSerialPortOpen.bind(this));
    // this.readLineParser.on("data", this.EventHandlerReadLineParser.bind(this));
  }

  EventHandlerSerialPortError(err) {
    setTimeout(this.Reconnect.bind(this), 5000);
    this.emit("error", err);
  }

  EventHandlerSerialPortClose(err) {
    this.emit("close", err);
  }
  EventHandlerSerialPortOpen(err) {
    this.EnableReadLineParser();
    this.emit("open", err);
  }

  EventHandlerReadLineParser(data) {
    let str = data.toString(); //Convert to string
    str = str.replace(/\r?\n|\r/g, ""); //remove '\r' from this String
    try {
      str = JSON.parse(data); // Convert to JSON
      let jsonData = JSON.parse(data); //Then parse it
      this.emit("data", jsonData, null);
    } catch (err) {
      this.emit("data", str, err);
    }
  }

  mockSerialPort(path = "/dev/robot", baudRate = 9600) {
    SerialPortMock.binding.createPort(path);
    this.serialPort = new SerialPortMock({ path, baudRate: baudRate });
    this.InitEventHandler();
    // this.serialPort.on("open", () => {
    //   console.assert(this.serialPort.isOpen, "serial port not opened");
    //   this.serialPort.port.emitData(
    //     JSON.stringify({ key: "hello alley" }) + "\n"
    //   );
    //   this.eventEmitter.emit("opened");
    // });
  }
}

module.exports = RS232;
