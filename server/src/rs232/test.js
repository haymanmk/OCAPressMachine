const RS232 = require("./index.js");

const rs232 = new RS232();
rs232.mockSerialPort();
rs232.on("open", () => {
  rs232.serialPort.port.emitData("hello world");
});

rs232.on("dataReady", (data) => {
  console.log(data);
});
