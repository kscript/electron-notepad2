export const isEmpty = function (obj) {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      return false
    }
  }
  return true
}

export const getLocal = function (key, isObj) {
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
export const setLocal = function (key, val) {
  localStorage.setItem(key, val)
  return val
}

export const getStore = function (state, key) {
  return isEmpty(state[key]) ? getLocal(key, true) : state[key]
}

export default {
  isEmpty,
  getStore,
  getLocal,
  setLocal
}
