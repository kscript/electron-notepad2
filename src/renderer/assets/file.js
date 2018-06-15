import fs from 'fs'
import { remote } from 'electron'

const { dialog } = remote

export const openDirectory = function (conf) {
  return dialog.showOpenDialog({ properties: conf || ['openFile', 'openDirectory', 'multiSelections'] })
}
export const openFile = function (conf) {
  return dialog.showOpenDialog({ properties: conf || ['openFile', 'multiSelections'] })
}
export const readFile = function (then) {
  var path = openFile(['openFile'])
  return path ? fs.readFile(path[0], 'utf8', then) : then()
}
export const setFilePath = function (then) {
  return dialog.showSaveDialog({}, then)
}
export default {
  fs,
  dialog,
  openFile,
  readFile,
  setFilePath,
  // saveFile,
  openDirectory
}
