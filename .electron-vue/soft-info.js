const fs = require('fs')
module.exports = function (cb){
  let pack = JSON.parse(fs.readFileSync('package.json'))
  let electron = JSON.parse(fs.readFileSync('node_modules/electron/package.json'))
  let result = {
    name: pack.name,
    version: pack.version,
    electron: electron.version,
    author: pack.author,
    license: pack.license,
    time: new Date().toUTCString()
  }
  fs.writeFileSync('src/renderer/config/system.json', JSON.stringify(result, null, 2))
  cb && cb()
}
