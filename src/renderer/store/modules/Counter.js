const state = {
  main: 0,
  dir: {},
  file: '',
  currentfile: ''
}

const mutations = {
  SET_FILE (state, val) {
    state.file = val
    setLocal('file', val)
  },
  SET_DIR (state, val) {
    state.dir = val
    setLocal('dir', JSON.stringify(val))
  },
  SET_CURRENT (state, val) {
    state.currentfile = val
    // setLocal('currentfile', JSON.stringify(val))
  },
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}
const getters = {
  file (state) {
    return state.file || getLocal('file')
  },
  currentfile (state) {
    return state.currentfile
  },
  dir (state) {
    return getStore(state, 'dir')
  }
}
const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}
function getStore (state, key) {
  return isEmpty(state[key]) ? getLocal(key, true) : state[key]
}
function isEmpty (obj) {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      return false
    }
  }
  return true
}

function getLocal (key, isObj) {
  let str = localStorage.getItem(key)
  let data
  if (isObj) {
    try {
      data = JSON.parse(str)
    } catch (e) {
      data = str
    }
  }
  return data || str
}
function setLocal (key, val) {
  localStorage.setItem(key, val)
  return val
}
export default {
  state,
  mutations,
  getters,
  actions
}
