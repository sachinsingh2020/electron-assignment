const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');

const url = require('url');
const path = require('path');


let mainWindow;
function createMainWindow() {

    let mainWindowState = windowStateKeeper({
        defaultWidth: 1500,
        defaultHeight: 1200
    });


    mainWindow = new BrowserWindow({
        title: "Electron App",
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true,
        }
    });

    // mainWindow.webContents.openDevTools();

    const startUrl = url.format({
        pathname: path.join(__dirname, './react-electron-app/build/index.html'),
        // pathname: path.join(__dirname, './index.html'),
        protocol: 'file',
    });

    mainWindow.loadURL(startUrl);

    mainWindowState.manage(mainWindow);
}

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});


ipcMain.on("message", (event, args) => {
    console.log(args);
    // event.reply("back-reply", "Hello from Main");
}
)

ipcMain.on("minimize", (event, args) => {
    console.log(args);
    mainWindow.minimize();
})

ipcMain.on("closeApp", (event, args) => {
    console.log(args);
    mainWindow.close();
})

ipcMain.on("drag", (event, args) => {
    console.log(args);
    mainWindow.webContents.send("drag", args);
})