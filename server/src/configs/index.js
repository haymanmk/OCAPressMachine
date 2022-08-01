const fs = require("fs");
const logger = require("../ErrorLogger");

/**
 * This fucntion read the system configuration file in JSON fomat.
 *
 * @param {String} fileName
 * @returns {Promise}
 */
function ReadConfig(fileName = __dirname + "/mainConfig.json") {
  console.log(fileName);
  return new Promise((resolve, reject) => {
    try {
      let rawdata = fs.readFileSync(fileName);
      let config = JSON.parse(rawdata);
      resolve(config);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

module.exports = ReadConfig;
