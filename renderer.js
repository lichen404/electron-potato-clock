const {ipcRenderer} = require('electron')
const Timer = require('timer.js')

function startWork() {
    let workTimer = new Timer({
        ontick: (ms) => {
            updateTime(ms)
        },
        onend: async () => {
            await notification()
        }
    })
    workTimer.start(10)

}

function updateTime(ms) {
    let timerContainer = document.querySelector('#timer-container')

    const ss = (ms / 1000).toFixed(0)
    const s = ss % 60
    const m = (s / 60).toFixed(0)

    timerContainer.textContent = `${m.toString().padStart(2,'0')} : ${s.toString().padStart(2,'0')}`

}

async function notification() {
    let res = await ipcRenderer.invoke('work-notification')
    if (res === 'rest') {
        setTimeout(() => {
            alert('rest')
        }, 5 * 1000)
    } else if (res === 'work') {
        startWork()
    }
}

startWork()