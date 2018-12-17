import Nano from './nano'
export default new Nano('Settings', {
  model: [
    {key: 'id', type: 'int', props: ['pk', 'ai']}, // 自增
    {key: 'ui', type: 'map'},
    {key: 'base', type: 'map'},
    {key: 'theme', type: 'map'},
    {key: 'plugin', type: 'map'},
    {key: 'snippet', type: 'map'}
  ],
  config: {
    mode: 'PERM', // store changes permenantly
    history: 'row' // store each row's changes as a revision history
  }
})
