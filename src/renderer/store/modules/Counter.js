const state = {
  main: 0,
  file: ''
}

const mutations = {
  SET_FILE (state, val) {
    state.file = val
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
    return state.file
  }
}
const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
