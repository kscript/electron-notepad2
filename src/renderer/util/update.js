import electron from 'electron'
export const checkUpdateVersion = (messageCb, progressCb) => {
  electron.ipcRenderer.send('checkForUpdate')
  // event, state, text
  electron.ipcRenderer.on('message', messageCb)
  electron.ipcRenderer.on('downloadProgress', progressCb)
  electron.ipcRenderer.on('isUpdateNow', () => {
    electron.ipcRenderer.send('isUpdateNow')
  })
}
export default checkUpdateVersion
