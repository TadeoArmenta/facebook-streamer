const path = require('path');
const { app, BrowserWindow } = require('electron'); 
const Ffmpeg = require('fluent-ffmpeg');
const nms = require('./mediaserver.js');
const { nms:mediaServer, pathToFfmpeg } = nms(app);
const isDev = process.env.IS_DEV === "true";
Ffmpeg.setFfmpegPath(pathToFfmpeg.path);
const video = Ffmpeg()
  .input('video=OBS Virtual Camera:audio=Microphone (Logitech G933 Gaming Headset)')
  .inputFormat("dshow")
  .native()
  .addOutput('rtmp://localhost:1935/live/video')
  .outputOption([
    "-vcodec libx264",
    "-preset ultrafast",
    "-acodec aac",
    "-pix_fmt yuv422p"
  ])
  .fps(25)
  .size('1280x720')
  .format("flv")
  
  // .addOutput('rtmps://live-api-s.facebook.com:443/rtmp/FB-3036736326646833-0-AbwstKITV5L9xV5y')
  // .outputOption([
  //   "-vcodec libx264",
  //   "-preset ultrafast",
  //   "-acodec aac",
  //   "-pix_fmt yuv422p"
  // ])
  // .fps(25)
  // .size('1280x720')
  // .format("flv")
  .on('progress', function(progress) {
    // console.log('Processing: ' + progress.currentFps);
  })
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  })

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
    mediaServer.run();
    video.run()
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
