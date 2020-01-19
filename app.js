// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })


    let spawn = require('child_process').spawn,
    subpy3 = spawn('python3', ['flaskserver.py']);

    subpy3.stdout.on('data', data => {
        console.info('[py3->]', data.toString());
    })
    subpy3.stdout.on('close', (code, signal) => {
        console.error(`py3 close: ${signal} ${code}`);
        process.kill(0)
    });

    // 加载index.html文件
    mainWindow.loadFile('templates/index.html')
    // 打开开发者工具
    // mainWindow.webContents.openDevTools()


    // 当 window 被关闭，这个事件会被触发。
    mainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null
        // 关闭 Python
        subpy3.kill('SIGTERM', (code, signal) => {
            console.error(`py kill: ${signal} ${code}`);
        })
        subpy3 = null
    })
}


// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', function() {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (mainWindow === null) createWindow()
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.