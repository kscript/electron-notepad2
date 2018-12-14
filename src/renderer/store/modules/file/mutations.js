import { setLocal } from '../../../util/store'

export const mutations = {
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
  },
  settings (state, val) {
    state.settings = val
  }
}
export default mutations
