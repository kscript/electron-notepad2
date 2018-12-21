import fs from 'fs'
import Path from 'path'
import { remote } from 'electron'

const { dialog } = remote
const ignore = 'node_modules,.git'.split(',')

export const openDirectory = function (conf) {
  return dialog.showOpenDialog({ properties: conf || ['openFile', 'openDirectory', 'multiSelections'] })
}
export const openFile = function (conf) {
  return dialog.showOpenDialog(conf)
}
export const selectFile = function (conf, then) {
  conf = conf || {}
  conf.properties = conf.properties || ['openFile']
  var path = openFile(conf)
  return path ? fs.readFile(path[0], 'utf8', function (err, data) {
    then && then(err, data, path[0])
  }) : then()
}
export const readFile = function (path, then) {
  return path ? fs.readFile(path, 'utf8', then) : then()
}
export const setFilePath = function (conf, then) {
  return dialog.showSaveDialog(conf, then)
}
export const saveFile = function (filename, text, then) {
  return fs.writeFile(filename, text, then)
}
export const renameFile = function (oldPath, newPath, then) {
  return fs.rename(oldPath, newPath, then)
}
export const mkdir = function (path, mode, then) {
  return fs.mkdir(path, mode, then)
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
  var filelists = fs.readdirSync(filePath)
  var dirs = []
  var files = []
  // 遍历读取到的文件列表
  filelists.forEach(function (filename) {
    // dir += '/' + filename
    var current = Path.join(dir, filename)
    if (filename !== '/' || filename !== '\\') {
      try {
        var stats = fs.fstatSync(fs.openSync(current, 'r'))
        var isFile = stats.isFile() // 是文件
        var isDir = stats.isDirectory() // 是文件夹
        var res
        if (isFile) {
          var extIndex = filename.lastIndexOf('.')
          var ext = extIndex < 0 ? '' : filename.slice(extIndex + 1)
          files.push({
            type: 'file',
            path: current,
            text: filename,
            // 扩展名
            ext: ext,
            // 显示图标
            icon: (ext ? 'tree-type tree-type-' + ext + ' ' : '') + 'tree-file',
            // 文件信息
            stats: {
              size: stats.size
            },
            // 是否加入到文件tab
            pushed: 0,
            // vue-jstree中的属性
            opened: 0,
            selected: 0
          })
        }
        if (isDir) {
          if (ignore.indexOf(filename) < 0) {
            res = deep ? fileDisplay(current, true) : []
            dirs.push({
              type: 'dir',
              path: current,
              text: filename,
              ext: '',
              stats: {
                size: stats.size
              },
              children: res.children || res,
              pushed: 0,
              opened: 0,
              selected: 0
            })
          }
        }
      } catch (e) {
        // console.log(e)
      }
    }
  })
  tree.children = dirs.concat(files)
  return tree
}
export const getStats = function (path) {
  return fs.fstatSync(fs.openSync(path, 'r'))
}
export default {
  fs,
  dialog,
  selectFile,
  openFile,
  readFile,
  saveFile,
  renameFile,
  setFilePath,
  mkdir,
  getStats,
  fileDisplay,
  openDirectory
}
