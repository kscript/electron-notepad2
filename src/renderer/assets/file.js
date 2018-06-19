import fs from 'fs'
import Path from 'path'
import { remote } from 'electron'

const { dialog } = remote
const ignore = 'node_modules,.git'.split(',')

// class Pathids {
//   constructor () {
//     this.id = 0
//     this.maps = {}
//   }
//   set (item) {
//     this.maps[this.id++] = item
//   }
//   get (id) {
//     return this.maps[id]
//   }
//   all () {
//     return this.maps
//   }
//   toString () {
//     return JSON.stringify(this.maps)
//   }
// }

export const openDirectory = function (conf) {
  return dialog.showOpenDialog({ properties: conf || ['openFile', 'openDirectory', 'multiSelections'] })
}
export const openFile = function (conf) {
  return dialog.showOpenDialog({ properties: conf || ['openFile', 'multiSelections'] })
}
export const selectFile = function (then) {
  var path = openFile(['openFile'])
  return path ? fs.readFile(path[0], 'utf8', then) : then()
}
export const readFile = function (path, then) {
  return path ? fs.readFile(path, 'utf8', then) : then()
}
export const setFilePath = function (then) {
  return dialog.showSaveDialog({}, then)
}

export const fileDisplay = function (filePath, deep) {
  var index = [filePath.lastIndexOf('\\'), filePath.lastIndexOf('/')]
  var names = filePath.slice(index[index[0] < 0 ? 1 : 0] + 1)
  var tree = {
    type: 'dir',
    text: names || filePath,
    opened: false,
    path: filePath,
    children: []
  }
  var dir = filePath
  // 根据文件路径读取文件，返回文件列表
  var files = fs.readdirSync(filePath)
  var list = []
  // 遍历读取到的文件列表
  files.forEach(function (filename) {
    // dir += '/' + filename
    var current = Path.join(dir, filename)
    if (filename !== '/' || filename !== '\\') {
      try {
        var stats = fs.fstatSync(fs.openSync(current, 'r'))
        var isFile = stats.isFile() // 是文件
        var isDir = stats.isDirectory() // 是文件夹
        var res
        if (isFile) {
          list.push({
            type: 'file',
            icon: 'tree-file',
            text: filename,
            path: current,
            opened: false
          })
        }
        if (isDir) {
          if (ignore.indexOf(filename) < 0) {
            res = deep ? fileDisplay(current, true) : []
            list.push({
              type: 'dir',
              text: filename,
              opened: false,
              path: current,
              children: res.children || res
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  })
  tree.children = list
  return tree
}
export default {
  fs,
  dialog,
  openFile,
  selectFile,
  readFile,
  setFilePath,
  fileDisplay,
  // saveFile,
  openDirectory
}
