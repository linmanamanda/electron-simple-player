const { ipcRenderer } = require('electron')
const { $, convertTime } = require('./helper')

let musicList = []
let currentMusic = {}
const audio = new Audio()

$('add-music-window').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})


const renderHTML = (filesPath) => {
  const lis = filesPath.reduce((html, file) => {
    return html += `<li class="list-group-item row d-flex align-items-center justify-content-between">
      <div class="col-10">
        <i class="fas fa-music mr-2"></i>
        <b>${file.fileName}</b>
      </div>
      <div class="col-2">
        <i class="fas fa-play mr-3" data-id="${file.id}" style="cursor: pointer;"></i>
        <i class="fas fa-trash-alt" data-id="${file.id}" style="cursor: pointer;"></i>
      </div>
    </li>`
  }, '')

  $('music-list').innerHTML = `<ul class="list-group">${lis}</ul>`
}

ipcRenderer.on('fetch-music', (event, filesPath) => {
  musicList = filesPath
  renderHTML(filesPath)
})

// 播放音乐
$('music-list').addEventListener('click', event => {
  const { dataset, classList } = event.target
  const id = dataset && dataset.id

  if (id) {
    if (classList.contains('fa-play')) {
      if (id !== currentMusic.id) {
        const music = musicList.find(music => music.id === id)
        audio.src = music.path
        currentMusic = music
        const pause = document.querySelector('.fa-pause')
        if (pause) {
          pause.classList.replace('fa-pause', 'fa-play')
        }
      } 

      audio.play()
      classList.replace('fa-play', 'fa-pause')
    } else if (classList.contains('fa-pause')) {
      audio.pause()
      classList.replace('fa-pause', 'fa-play')
    } else {
      ipcRenderer.send('delete-music', id)
    }
  }
})

// 控制音乐
const renderControl = (name, currentTime, duration) => {
  $('music-control').innerHTML = `
    <hr/>
    <div class="row d-flex align-items-center m-4">
      <div class="col">正在播放：${name}</div>
      <div class="col">${convertTime(currentTime)} / ${convertTime(duration)}</div>
    </div>
    <div class="progress m-4">
      <div class="progress-bar" style="width: ${currentTime / duration * 100}%" role="progressbar"></div>
    </div>
  `
}
audio.addEventListener('loadedmetadata', () => {
  renderControl(currentMusic.fileName, 0, audio.duration)
})
audio.addEventListener('timeupdate', () => {
  renderControl(currentMusic.fileName, audio.currentTime, audio.duration)
})