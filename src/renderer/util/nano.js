import {nSQL} from 'nano-sql'
export class Nano {
  constructor (dbname, option) {
    this.dbname = dbname
    this.option = option
    this.model = option.model || {}
    this.config = option.config || {}
    this.nSQL = nSQL
    this.db = null
    this.instance = null
    this.state = 0
  }
  get (url, option) {
    this.canuse().then(() => {
      switch (url) {
        case '':
          break
        default:
          break
      }
    })
  }
  post (url, option) {
    this.canuse().then(() => {
      switch (url) {
        case '':
          break
        default:
          break
      }
    })
  }
  connect () {
    this.db = this.nSQL(this.dbname)
    this.state = 1
    this.instance = this.db
      .model(this.model)
      .config(this.config)
      .connect()
      .then(() => {
        this.state = 2
      })
    return this.instance
  }
  canuse () {
    if (this.state < 1) {
      this.instance = this.connect()
    }
    return this.instance
  }
  output () {
    return this.canuse().then(() => {
      return this.db.rawDump([this.dbname])
    })
  }
  input (data) {
    return this.canuse().then(() => {
      return this.db.loadJS(this.dbname, data)
    })
  }
}
export default Nano
