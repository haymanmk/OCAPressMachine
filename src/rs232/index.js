const Readline = require('@serialport/parser-readline')
var {SerialPort} = require("serialport");

class RS232 extends SerialPort{
    constructor(devPath, baudRate=9600){
        super({
            path: devPath,
            baudRate: baudRate,
        });
    }
    /**
     * This method is used to list all the devices connecting to your host now, and it is supported a Promise return.
     * 
     * @returns {Promise} results of port info in Object form
     */
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

    /**
     * This method is used to find the com port path with specified property of port information as parameter portProperty.
     * 
     * @param {Object=} portProperty - search for the port having property specified in Object portProperty, and if successful, it returns port's path. 
     *                                  e.g. { manufacturer: 'Moxa Inc.' }
     * @returns {Promise} path of port
     */
    static Find(portProperty){
        return new Promise((resolve, reject)=>{
            this.List()
            .then(portInfo=>{
                if(!portProperty) resolve(portInfo);
                else{
                    portInfo.map(info=>{
                        if(info[Object.keys(portProperty)[0]] === Object.values(portProperty)[0]){
                            // console.log(info.path);
                            resolve(info.path);
                        }
                    })
                    resolve({});
                }

            })
            .catch(err=>{
                // console.log(err);
                reject(err);
            })
        });
    }
}

module.exports = RS232;