// import Vue from 'Vue'
// import store from '../store'
import { remote } from 'electron'
import { Bus } from '../eventBus'
// import file from './file.js'
let { Menu, MenuItem } = remote

export const headMenu = function () {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开文件',
          accelerator: 'CommandOrControl + O',
          click () {
            Bus.$emit('openFile')
          }
        },
        {
          label: '打开文件夹',
          accelerator: 'Shift + CommandOrControl + O',
          click () {
            Bus.$emit('setDir')
          }
        },
        {
          label: '新建文件',
          accelerator: 'CommandOrControl + N',
          click () {
            Bus.$emit('newFile')
          }
        },
        {
          label: '保存文件',
          accelerator: 'CommandOrControl + S',
          click () {
            Bus.$emit('saveFile')
          }
        },
        {
          label: '另存为',
          accelerator: 'Shift + CommandOrControl + S',
          click () {
            Bus.$emit('saveAsFile')
          }
        },
        {
          label: '设置',
          accelerator: 'CommandOrControl + C',
          click () {
            Bus.$emit('openSettings')
          }
        },
        {
          label: '退出',
          role: 'quit',
          accelerator: 'CommandOrControl + E'
        }
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '重载' },
        { role: 'forcereload', label: '硬性重载' },
        { role: 'toggledevtools', label: '开发者工具', accelerator: 'F12' },
        { type: 'separator' },
        { role: 'resetzoom', label: '重置' },
        { role: 'zoomin', label: '放大' },
        { role: 'zoomout', label: '缩小' },
        { type: 'separator' },
        { role: 'minimize', label: '最小化' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      role: 'help',
      label: '帮助',
      submenu: [
        {
          // label: 'Learn More',
          label: '学习更多..',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
export const contentMenu = function (area) {
}

export default {
  headMenu,
  contentMenu,
  remote,
  Menu,
  MenuItem
}
