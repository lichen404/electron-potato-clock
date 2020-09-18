const {ipcRenderer} = require('electron')
const Timer = require('timer.js')
const ProgressBar = require('progressbar.js/dist/progressbar.js')

let timeContainer = document.querySelector('#timer-container')
let switchButton = document.querySelector('#switch-button')
let progressBar = new ProgressBar.Circle('#timer-container', {
    strokeWidth: 2,
    color: '#f44336',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: null

})
const workTime = 25 * 60 //工作时间25分钟
const restTime = 5 * 60 //休息5分钟
const state = {}
const buttonTextList = ['start work', 'end work', 'start rest', 'end rest']

function render() {
    let {remainTime: s, type} = state
    let maxTime = type < 2 ? workTime : restTime
    let ss = s % 60
    let mm = ((s - ss) / 60).toFixed()
    progressBar.set(1 - s / maxTime)
    progressBar.setText(`${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`)

    switchButton.textContent = buttonTextList[type]


}

switchButton.onclick = function () {
    if (this.innerText === 'start work') {
        startWork()
    } else if (this.innerText === 'start rest') {
        startRest()
    } else {
        workTimer.stop()
    }
}

function setState(_state) {
    Object.assign(state, _state)
    render()
}

function startWork() {
    setState({type: 1, remainTime: workTime})
    workTimer.start(workTime)

}

function startRest() {
    setState({type: 3, remainTime: restTime})
    workTimer.start(restTime)
}

async function notification({title, body, actionText, closeButtonText, onClose, onAction}) {
    let res = await ipcRenderer.invoke('notification', {
        title,
        body,
        actions: [{text: actionText, type: 'button'}],
        closeButtonText
    })
    res.event === 'close' ? onClose() : onAction()
}

const workTimer = new Timer({
    ontick: (ms) => {
        setState({remainTime: (ms / 1000).toFixed(0)})
    },
    onstop: () => {
        setState({type: 0, remainTime: 0})
    },
    onend: () => {
        const {type} = state
        if (type === 3) {
            setState({type: 2, remainTime: 0})
            if (process.platform === 'darwin') {
                // 在Mac OS 环境下才能使用notification
                notification({
                    body: 'start new work',
                    title: 'rest end',
                    closeButtonText: 'keep rest',
                    onAction: startRest,
                    onClose: startWork
                }).then()
            } else {
                // windows 平台直接alert
                window.alert('work finished')
            }
        } else if (type === 1) {
            setState({type: 2, remainTime: 0})
            if (process.platform === 'darwin') {
                notification({
                    title: 'Congratulations on completing the task',
                    body: "Do you want to have a rest?",
                    actionText: "rest 5 minutes",
                    closeButtonText: "keep work",
                    onAction: startWork,
                    onClose: startRest
                }).then()
            } else {
                alert('work finished')
            }
        }
    }


})


setState({
    remainTime: 0,
    type: 0 //0开始工作,1停止工作,2开始休息,3停止休息
})
