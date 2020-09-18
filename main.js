const {app, BrowserWindow, Notification, ipcMain} = require('electron')

async function createWindow() {
    // 创建浏览器窗口
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    handleIPC()
    // 并且为你的应用加载index.html
    await win.loadFile('index.html')
    win.webContents.openDevTools()
}

function handleIPC() {
    ipcMain.handle('notification', async function (e, {body, title, actions, closeButtonText}) {

        return await new Promise(((resolve, reject) => {
            console.log({
                title,
                body,
                actions,
                closeButtonText
            })
            let notification = new Notification({
                title,
                body,
                actions,
                closeButtonText
            })
            notification.show()
            notification.on('action', () => {
                resolve({event: 'action'})
            })
            notification.on('close', () => {
                resolve({event: 'close'})
            })

        }))
    })
}

app.whenReady().then(createWindow)
