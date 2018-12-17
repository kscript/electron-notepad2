import db from './sql'
import file from './file'
import menu from './menu'
import { eventBus } from './eventBus'

export const copy = function (data) {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (e) {
    console.log('复制失败', e)
    return data
  }
}

export default {
  db,
  file,
  menu,
  copy,
  eventBus
}
