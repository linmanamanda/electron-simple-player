const { ipcRenderer } = require('electron')
const { $ } = require('./helper')
const path = require('path')

$('select-music').addEventListener('click', () => {
  ipcRenderer.send('select-music')
})


const renderHTML = (filePaths) => {
  const lis = filePaths.reduce((html, filePath) => {
    html += `<li class="list-group-item">${path.basename(filePath)}</li>`
    return html
  }, '')

  return `<ul class="list-group">${lis}</ul>`
}

ipcRenderer.on('selected-music', (event, filePaths) => {
  $('music-list').innerHTML = renderHTML(filePaths)
})

// 导入音乐
$('import-music').addEventListener('click', () => {
  ipcRenderer.send('import-music')
})