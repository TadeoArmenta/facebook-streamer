const  path = require('path');
const { app, BrowserWindow } = require('electron');
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');
const mediaServerConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};
const nms = new NodeMediaServer(mediaServerConfig)

nms.run();

const isDev = process.env.IS_DEV === "true";
const serverApp = express();
serverApp.get('/stream.mp4', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'video/mp4'
  })
  video.pipe(res) // sending video to the client
})
const video = ffmpeg()
  .input('video=OBS Virtual Camera')
  .inputFormat("dshow")
  .size('1280x720')
  .fps(25)
  .addOptions([
    "-vcodec libx264",
    "-preset ultrafast",
    "-acodec aac",
    "-pix_fmt yuv422p"
  ])
  .format("flv")
  .save('rtmp://localhost:1935/live/video')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
      isDev
          ? 'http://localhost:3000'
          : `file://${path.join(__dirname, '../dist/index.html')}`
  ) .then(r =>{});
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  if(video){
    // serverApp.listen(5050)
  }
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
