<template>
    <div class="editor-box f100">
      <div class="flex f100">
        <div class="scroll">
          <v-jstree
            class="file-tree scroll"
            whole-row
            allow-batch
            :data="data"
            :style="{width: asideW + 'px', height: '100%', overflowX: 'hidden'}"
            :item-events="treeEvents"
            @item-click="itemClick">
            <template slot-scope="_">
              <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
              <span v-html="_.model.text" v-if="!_.model.input"></span>
              <template v-else>
                <input v-model="editInputVal" @keyup.13="editFileName(_.model)" @blur="editFileNameBlur(_.model)"/>
              </template>
            </template>
          </v-jstree>
        </div>
        <div class="scroll" style="overflow-x: auto;">
          <v-deformation
            class="editor-el"
            :class="{movedown: files.length > 0}"
            :x="asideW + 5"
            :draggable="2"
            :resizable="2"
            :showHandler="false"
            :move="true"
            size="w"
            axis="x"
            @resizing="onResizing">
            <div class="name-list ellipsis" v-if="files.length > 0">
              <ul class="list-group" v-sortable="{onUpdate: onUpdate}">
                <li class="list-group-item" v-for="(vo, index) in files" :key="index">
                  <div class="label" :class="{'active': currentPath === vo.path}" @click="clickTab(vo)" :title="vo.text">
                    <cite>
                      <i class="icon-file handler-icon">&nbsp;</i>
                      {{vo.text}}
                      <i class="icon-close" @click.prevent.stop="closeTab(index)">&nbsp;</i>
                    </cite>
                  </div>
                </li>
              </ul>
            </div>
            <template v-if="viewmode === 'editor'">
              <codemirror ref="codemirror" class="f100 scroll" :value="content" :options="editorConfig" @input="editChanges"></codemirror>
            </template>
            <template v-if="viewmode === 'markdown'">
              <v-vuemarkdown class="md-editor-preview markdown-body f100 scroll" style="background: #fff;padding: 10px 20px;">{{content}}</v-vuemarkdown>
            </template>
          </v-deformation>
        </div>
      </div>
    </div>
</template>
<script>
import 'github-markdown-css'
import VueMarkdown from 'vue-markdown'
import deformation from '../../common/deformation.vue'
// import { setTimeout } from 'timers';
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/vue/vue')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')
require('codemirror/theme/base16-dark.css')

export default {
  data () {
    let self = this
    return {
      viewmode: 'editor',
      deformationPopup: null,
      content: '',
      asideW: 240,
      editInputVal: '',
      editorConfig: {
        mode: 'javascript',
        lineNumbers: true,
        theme: 'base16-dark'
      },
      treeEvents: {
        contextmenu () {
          self.treeContextmenu.apply(self, arguments)
        }
      },
      newFileNum: 1,
      files: [],
      pathMap: {},
      nextFile: '',
      currentPath: '',
      nextId: 0,
      data: [],
      treedata: [
      ]
    }
  },
  components: {
    'v-vuemarkdown': VueMarkdown,
    'v-deformation': deformation
  },
  watch: {
    // content: {
    //   handler (newVal) {
    //     this.$store.commit('SET_FILE', newVal)
    //   }
    // }
  },
  methods: {
    editFileName (data) {
      this.$set(data, 'input', 0)
      this.$bus.$emit('rename', data)
    },
    editFileNameBlur (data) {
      this.$set(data, 'input', 0)
    },
    treeContextmenu (node, data, $event) {
      let self = this
      let Menu = this.$menu.Menu
      let MenuItem = this.$menu.MenuItem
      let remote = this.$menu.remote

      let menu = new Menu()
      let finfo = this.$path.parse(data.path)

      if (data.type === 'file') {
        menu.append(new MenuItem({
          label: '重命名',
          click () {
            self.editInputVal = data.text
            self.$set(data, 'input', 1)
          }
        }))
        if (finfo.ext === '.md') {
          menu.append(new MenuItem({
            label: 'markdown文件预览',
            click () {
              self.itemClick2(data).then(() => {
                self.viewmode = 'markdown'
                data.viewmode = 'markdown'
              })
            }
          }))
        }
      } else if (data.type === 'dir') {
        menu.append(new MenuItem({
          label: '新建文件',
          click () {
            self.$bus.$emit('newFile', data.path)
          }
        }))
        menu.append(new MenuItem({
          label: '添加文件夹',
          click () {
            self.$bus.$emit('newPath', data.path)
          }
        }))
      }
      // }
      menu.popup({
        window: remote.getCurrentWindow()
      })
    },
    onUpdate (event) {
      // this.files.splice(event.newIndex, 0, this.files.splice(event.oldIndex, 1)[0])
    },
    clickTab (vo) {
      this.currentPath = vo.path
      let data = this.pathMap[vo.path]
      this.openFile(data).then(() => {
        this.viewmode = data.viewmode
      })
    },
    closeTab (index) {
      let num
      let len = this.files.length
      let file
      if (len === 1) {
        this.content = ''
      } else if (len > 1) {
        if (this.currentPath === this.files[index].path) {
          if (index === len - 1) {
            num = index - 1
          } else {
            num = index + 1
          }
          file = this.files[num]
          this.nextPath = file.path
          clearTimeout(this.nextId)
          this.nextId = setTimeout(() => {
            this.currentPath = this.nextPath
            this.$file.readFile(this.nextPath, (err, data) => {
              if (err === null) {
                this.content = data
                this.viewmode = (file || {}).viewmode || 'editor'
              }
            })
          }, 200)
        }
      }
      let node = this.pathMap[this.files[index].path]
      node.pushed = false
      this.files.splice(index, 1)
    },
    editChanges (val) {
      this.content = val
    },
    onResizing (left, top, width, height) {
      this.asideW = left
    },
    itemClick (node, item) {
      if (item.input !== 1) {
        this.openFile(item).then(() => {
          this.viewmode = 'editor'
          item.viewmode = 'editor'
        })
      }
    },
    itemClick2 (item) {
      return this.openFile(item)
    },
    openFile (item) {
      item.opened = !item.opened
      this.viewmode = 'editor'
      return new Promise(resolve => {
        let res
        if (item.type === 'file') {
          if (item.opened) {
            if (!item.pushed) {
              this.pathMap[item.path] = item
              this.$set(item, 'pushed', 1)
              this.files.push(item)
            }
            this.currentPath = item.path
            // this.$store.commit('SET_CURRENT', this.currentPath)
            this.$file.readFile(item.path, (err, data) => {
              if (err === null) {
                // this.$store.commit('SET_FILE', data)
                this.content = data
                item.opened = !item.opened
                resolve(res)
              }
            })
          } else {
            resolve(res)
          }
        } else {
          if (item.opened) {
            this.$set(item, 'loading', true)
            let dir = this.$file.fileDisplay(item.path)
            this.$set(item, 'loading', false)
            this.$set(item, 'children', dir.children || dir)
          }
          resolve(res)
        }
      })
    },
    init () {
      // console.log(this)
    }
  },
  created () {
    console.log(this)
    this.$bus.$off('setFile').$on('setFile', file => {
      this.content = file
    })
    this.$bus.$off('rename').$on('rename', file => {
      let value = this.editInputVal
      if (file && file.path && value) {
        if (!/(\?|\*|\||<|>|"|\/|:|\\)/.test(value)) {
          let pathInfo = this.$path.parse(file.path)
          let newPath = this.$path.resolve(pathInfo.dir, value)
          let oldPath = file.path
          if (newPath.length) {
            if (file.type === 'file') {
              this.$file.renameFile(oldPath, newPath, error => {
                if (error) {
                  console.log(error)
                } else {
                  if (this.currentPath === oldPath) {
                    this.currentPath = newPath
                  }
                  file.text = value
                  file.path = newPath
                  this.pathMap[newPath] = file
                  delete this.pathMap[oldPath]
                }
              })
            }
          }
        }
      }
    })
    this.$bus.$off('showMarkdown').$on('showMarkdown', file => {
      this.viewmode = 'markdown'
    })
    this.$bus.$off('setPath').$on('setPath', path => {
      this.currentPath = path
    })
    this.$bus.$off('newPath').$on('newPath', path => {
      path && this.$file.mkdir(path, () => {
        // this.currentPath = path
      })
    })
    this.$bus.$off('setDir').$on('setDir', () => {
      let dir
      let path = this.$file.openDirectory(['openDirectory'])
      if (path && path[0]) {
        dir = this.$file.fileDisplay(path[0])
        this.$store.commit('SET_DIR', this.$copy(dir))
        this.data = [dir]
      }
    })
    this.$bus.$off('openFile').$on('openFile', () => {
      this.$file.selectFile({}, (err, data, path) => {
        let node
        if (err === null) {
          data && this.$bus.$emit('setFile', data)
          path && this.$bus.$emit('setPath', path)
          if (path && this.files.filter(item => item.path === path).length < 1) {
            node = {
              icon: 'tree-file',
              path: path,
              text: path,
              type: 'file',
              pushed: 1,
              selected: false
            }
            this.files.push(node)
            this.pathMap[path] = node
          }
        }
      })
    })
    this.$bus.$off('newFile').$on('newFile', path => {
      let newFile = {
        icon: 'tree-file',
        path: path || 'Untitled-' + this.newFileNum,
        text: 'Untitled-' + this.newFileNum++,
        type: 'file',
        newFile: 1,
        pushed: 1,
        selected: false
      }
      this.content = ''
      this.currentPath = newFile.path
      this.files.push(newFile)
      this.pathMap[newFile.path] = newFile
    })
    this.$bus.$off('saveFile').$on('saveFile', () => {
      let text = this.content
      let path = this.currentPath
      let node = this.pathMap[path]
      if (node.newFile === 1) {
        this.$bus.$emit('saveAsFile', path)
      } else {
        text = text.replace(/\n/g, '\r\n')
        this.$file.saveFile(path, text, () => {
        })
      }
    })
    this.$bus.$off('saveAsFile').$on('saveAsFile', path => {
      let text = this.content
      text = text.replace(/\n/g, '\r\n')
      this.$file.setFilePath({
        defaultPath: this.currentPath
      }, filename => {
        if (filename) {
          this.$file.saveFile(filename, text, () => {
            if (path) {
              let node = this.pathMap[path]
              node.path = filename
              node.text = filename
              node.newFile = 2
              this.pathMap[filename] = node
              delete this.pathMap[path]
            }
          })
        }
      })
    })
    this.data = [this.$store.getters.dir]
    this.$nextTick(() => {
      this.$menu.headMenu()
      this.init()
    })
  }
}
</script>
<style lang="scss">
.editor-box {
  .file-tree {
    color: #ccc!important;
    .tree-container-ul{
      width: 100%;
    }
    li{
      word-break: break-all;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .tree-last .tree-ocl{
      display: none;
    }
    .tree-loading .tree-ocl{
      display: inline-block;
    }
  }
  .name-list{
    height: 24px;
    width: 100%;
    background-color: #282828;
    /* display: none; */
    position: relative;
    z-index: 20;
    color: #ccc;
    cursor: auto;
    padding: 0px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
    .label{
      width: 100%;
      padding: 4px 20px 4px 8px;
      font-size: 14px;
      /* background: rgba(255, 255, 255, .05); */
      /* border-radius: 3px; */
      margin-right: 3px;
      display: inline-block;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .icon-close{
        color: #ccc;
        font-size: 10px;
        font-weight: bold;
        display: none;
        margin-left: 2px;
        cursor: pointer;
        position: absolute;
        top: 50%;
        margin-top: -5px;
        right: 3px;
        left: auto;
      }
      cite{
        cursor: pointer;
        font-style: normal;
      }
    }
    .list-group-item{
      display: inline-block;
      max-width: 120px;
      .label.active{
        background: rgba(0, 0, 0, .5);
      }
      .label:hover .icon-close,
      .label.active .icon-close{
        display: inline;
      }
    }
  }
  .editor-el{
    height: 100%!important;
    right: 0!important;
    width: auto!important;
    cursor: auto!important;
    &.movedown{
      padding-top: 24px!important;
      margin-top: -24px;
    }
    .CodeMirror{
      height: 100%;
    }
  }
}
</style>

