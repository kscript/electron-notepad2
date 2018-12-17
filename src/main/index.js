'use strict'

import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, ipcMain } from 'electron'
// import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
// import { URL } from 'url'
// app.on('web-contents-created', (event, contents) => {
//   contents.on('will-navigate', (event, navigationUrl) => {
//     const parsedUrl = new URL(navigationUrl)
//     if (parsedUrl.protocol !== 'file') {
//       dialog.showMessageBox({
//         title: '提示',
//         message: '是否使用外部浏览器打开当前连接?',
//         buttons: ['取消', '打开'],
//         type: 'warning',
//         callback (index) {
//           if (index) {
//             shell.openExternal(navigationUrl, {
//               activate: false
//             })
//           } else {
//             event.preventDefault()
//           }
//         }
//       })
//     }
//   })
// })

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage (text) {
  mainWindow.webContents.send('message', text)
}
(function updateHandle () {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  }
  // const os = require('os')
  const uploadUrl = 'http://web.cn/autoupdate/' // 下载地址，不加后面的.exe
  autoUpdater.setFeedURL(uploadUrl)
  autoUpdater.on('error', (error) => {
    sendUpdateMessage(error, message.error)
  })
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  })
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  }) // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate) {
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments)
      console.log('开始更新')
      autoUpdater.quitAndInstall()
    })

    mainWindow.webContents.send('isUpdateNow')
  })
  // 执行自动更新检查
  ipcMain.on('checkForUpdate', () => {
    autoUpdater.checkForUpdates()
  })
})()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    // https://electronjs.org/docs/tutorial/security#2-禁止nodejs集成远程内容
    nodeIntegration: false,
    contextIsolation: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
