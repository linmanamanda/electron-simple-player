const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const DataStore = require('./renderer/MusicDataStore')

const musicStore = new DataStore({ name: 'music_list' })
let musicFilesPath = []

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    let baseConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        devTools: true
      },
      show: false
    }

    let finalConfig = { ...baseConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

const createWindow = () => {
  const mainWindow = new AppWindow({}, './renderer/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('fetch-music', musicStore.getTracks())
  })
  
  ipcMain.on('add-music-window', () => {
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './renderer/add.html')
  })

  ipcMain.on('select-music', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters:[{
        name: 'Music', extensions: ['mp3']
      }]
    })
    .then(result => {
      event.sender.send('selected-music', result.filePaths)
      musicFilesPath = result.filePaths
    })
  })

  ipcMain.on('import-music', (event) => {
    const tracks = musicStore.addTracks(musicFilesPath).getTracks()
    mainWindow.send('fetch-music', tracks)
  })

  ipcMain.on('delete-music', (event, id) => {
    const tracks = musicStore.deleteTrack(id).getTracks()
    mainWindow.send('fetch-music', tracks)
  })
}

app.whenReady().then(createWindow)
