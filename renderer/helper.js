exports.$ = (id) => {
  return document.getElementById(id)
}

exports.convertTime = (time) => {
  const minute = '0' + Math.floor(time / 60)
  const second = '0' + Math.floor(time - minute * 60)
  return minute.substr(-2) + ':' + second.substr(-2)
}