import { getStore, getLocal } from '../../../util/store'

export const getters = {
  file (state) {
    return state.file || getLocal('file')
  },
  currentfile (state) {
    return state.currentfile
  },
  dir (state) {
    return getStore(state, 'dir')
  },
  settings (state) {
    return state.settings
  }
}
export default getters
