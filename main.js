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
    ipcMain.handle('work-notification', async function () {
        return await new Promise(((resolve) => {
            let notification = new Notification({
                title: 'task finished',
                body: 'start to rest or not',
                actions: [{text: 'start to rest', type: 'button'}],
                closeButtonText: 'keep working'
            })
            notification.show()
            notification.on('action', () => {
                resolve('rest')
            })
            notification.on('close', () => {
                resolve('work')
            })

        }))
    })
}

app.whenReady().then(createWindow)