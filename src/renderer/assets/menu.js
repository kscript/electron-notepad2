import store from '../store'
import { remote } from 'electron'
import file from './file.js'
let { MenuItem, Menu } = remote
export const headMenu = function () {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开文件夹',
          accelerator: 'CommandOrControl + O',
          click () {
            let dir = {}
            let path = file.openDirectory(['openDirectory'])
            if (path && path[0]) {
              dir.selected = path[0]
              store.commit('SET_DIR', file.fileDisplay(path[0]))
            }
          }
        },
        {
          label: '新建文件',
          accelerator: 'CommandOrControl + O',
          click () {
            store.commit('SET_FILE', '')
          }
        },
        {
          label: '打开文件',
          accelerator: 'CommandOrControl + O',
          click () {
            file.selectFile((err, data) => {
              if (err === null) {
                store.commit('SET_FILE', data)
              }
            })
          }
        },
        {
          label: '另存为',
          accelerator: 'Shift + CommandOrControl + S',
          click () {
            let text = store.getters.file
            text = text.replace(/\n/g, '\r\n')
            console.log(store, text)
            file.setFilePath(filename => {
              filename && file.fs.writeFile(filename, text, function () {
                // console.log(arguments)
              })
            })
          }
        }
        // { role: 'undo', label: '撤销' },
        // { role: 'redo', label: '恢复' },
        // { type: 'separator' },
        // { role: 'cut', label: '剪切' },
        // { role: 'copy', label: '复制' },
        // { role: 'paste', label: '粘贴' },
        // { role: 'pasteandmatchstyle', label: '粘贴(保留格式)' },
        // { role: 'delete', label: '删除' },
        // { role: 'selectall', label: '选择全部' }
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
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      role: 'window',
      label: '桌面',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'close', label: '关闭' },
        { role: 'quit', label: '退出' }
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
export const contentMenu = function () {
  const menu = new Menu()
  menu.append(new MenuItem({
    role: 'copy',
    label: '复制',
    click () {
      console.log(this, arguments)
    }
  }))
  menu.append(new MenuItem({
    role: 'cut',
    label: '剪切',
    click () {
      console.log(this, arguments)
    }
  }))
  menu.append(new MenuItem({
    role: 'paste',
    label: '粘贴',
    click () {
      console.log(this, arguments)
    }
  }))
  menu.append(new MenuItem({
    role: 'delete',
    label: '删除',
    click () {
      console.log(this, arguments)
    }
  }))
  menu.append(new MenuItem({
    type: 'separator'
  }))
  // menu.append(new MenuItem({ role: 'toggledevtools', label: '审查元素', click() { console.log(this, arguments) } }))
  menu.append(new MenuItem({
    role: 'reload',
    label: '刷新',
    click () {
      console.log(this, arguments)
    }
  }))
  menu.append(new MenuItem({
    role: 'quit',
    label: '退出',
    click () {
      console.log(this, arguments)
    }
  }))

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup({
      window: remote.getCurrentWindow()
    })
  }, false)
}

export default {
  headMenu,
  contentMenu
}
