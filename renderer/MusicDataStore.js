const Store = require('electron-store')
const path = require('path')
const uuidv4 = require('uuid/v4')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    this.tracks = this.getTracks()
  }
  getTracks() {
    return this.get('tracks') || []
  }
  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  } 
  addTracks(tracks) {
    const tracksWithProps = tracks.map(track => {
      return {
        id: uuidv4(),
        path: track,
        fileName: path.basename(track)
      }
    }).filter(track => {
      const currentTracksPath = this.getTracks().map(track => track.path)
      return currentTracksPath.indexOf(track.path) < 0
    })

    this.tracks = [...this.tracks, ...tracksWithProps]
    this.saveTracks()
    return this
  }
  deleteTrack(id) {
    this.tracks = this.getTracks().filter(track => track.id !== id)
    this.saveTracks()
    return this
  }
}

module.exports = DataStore