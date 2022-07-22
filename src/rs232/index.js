const Readline = require('@serialport/parser-readline')
var {SerialPort} = require("serialport");

class RS232 extends SerialPort{
    constructor(devPath, baudRate=9600){
        super({
            path: devPath,
            baudRate: baudRate,
        });

        
    }

    static List(){
        return new Promise((resolve, reject)=>{
            this.list()
            .then(portInfo=>{
                resolve(portInfo);
            })
            .catch(err=>{
                reject(err);
            });
        })
    }
}

module.exports = RS232;