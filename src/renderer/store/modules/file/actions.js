import { isEmpty } from '../../../util/store'
import axios from '../../../axios'

export const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  settings ({ getters, commit }) {
    return new Promise((resolve, reject) => {
      if (isEmpty(getters.settings)) {
        axios({
          url: 'static/settings/index.json'
        }).then(response => {
          commit('settings', response.data)
          resolve(response.data)
        }).catch(e => {
          reject(e)
        })
      } else {
        resolve(getters.settings)
      }
    })
  }
}
export default actions
