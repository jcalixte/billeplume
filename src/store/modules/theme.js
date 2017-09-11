const state = {
  backgrounds: [{
    name: 'Buddha',
    src: require('@/assets/wallpapers/buddha.jpg'),
    color: '#aaaaaa'
  }, {
    name: 'Rocks',
    src: require('@/assets/wallpapers/rocks.jpg'),
    color: '#000000'
  }, {
    name: 'Water',
    src: require('@/assets/wallpapers/water.jpg'),
    color: '#000000'
  }, {
    name: 'Zen',
    src: require('@/assets/wallpapers/zen.jpg'),
    color: '#000000'
  }],
  musics: []
}

const getters = {
  backgrounds: state => state.backgrounds,
  musics: state => state.musics
}

export default {
  state,
  getters
}
