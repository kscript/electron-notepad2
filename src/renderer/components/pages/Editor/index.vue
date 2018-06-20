<template>
    <div class="editor-box f100">
      <div class="flex f100">
        <div class="scroll">
          <v-jstree class="file-tree scroll" :style="{width: asideW + 'px', height: '100%'}" :data="data" allow-batch whole-row @item-click="itemClick"></v-jstree>
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
            <div class="name-list ellipsis">
              <ul class="list-group" v-if="files.length > 0" v-sortable>
                <li class="list-group-item" v-sortable v-for="(vo, index) in files" :key="index">
                  <div class="label" :class="{'active': currentFile === vo.path}" @click="clickTab(vo)">
                    <cite>
                      <i class="icon-file handler-icon">&nbsp;</i>
                      {{vo.text}}
                      <i class="icon-close" @click.prevent.stop="closeTab(index)">&nbsp;</i>
                    </cite>
                  </div>
                </li>
              </ul>
            </div>
            <codemirror class="f100 scroll" :value="content" :options="editorConfig" @input="editChanges" ></codemirror>
          </v-deformation>
        </div>
      </div>
    </div>
</template>
<script>
import menu from '../../../assets/menu.js'
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
    return {
      content: '',
      asideW: 240,
      editorConfig: {
        mode: 'javascript',
        lineNumbers: true,
        theme: 'base16-dark'
      },
      files: [],
      pathMap: {},
      nextFile: '',
      currentFile: '',
      nextId: 0,
      data: [],
      treedata: [
      ]
    }
  },
  components: {
    'v-deformation': deformation
  },
  watch: {
    content: {
      handler (newVal) {
        this.$store.commit('SET_FILE', newVal)
      }
    }
  },
  methods: {
    clickTab (vo) {
      this.currentFile = vo.path
      this.$file.readFile(this.currentFile, (err, data) => {
        if (err === null) {
          this.$store.commit('SET_FILE', data)
        }
      })
    },
    closeTab (index) {
      let num
      let len = this.files.length
      if (len === 1) {
        this.content = ''
      } else if (len > 1) {
        if (this.currentFile === this.files[index].path) {
          if (index === len - 1) {
            num = index - 1
          } else {
            num = index + 1
          }
          this.nextFile = this.files[num].path
          clearTimeout(this.nextId)
          this.nextId = setTimeout(() => {
            this.currentFile = this.nextFile
            this.$file.readFile(this.nextFile, (err, data) => {
              if (err === null) {
                this.$store.commit('SET_FILE', data)
              }
            })
          }, 300)
        }
      }
      let node = this.pathMap[this.files[index].path]
      node.pushed = false
      this.files.splice(index, 1)
    },
    editChanges (val) {
      this.$store.commit('SET_FILE', val)
    },
    onResizing (left, top, width, height) {
      this.asideW = left
    },
    itemClick (node, item) {
      item.opened = !item.opened
      this.$nextTick(() => {
        if (item.type === 'file') {
          if (item.opened) {
            if (!item.pushed) {
              this.pathMap[item.path] = item
              this.$set(item, 'pushed', 1)
              this.files.push(item)
            }
            this.currentFile = item.path
            this.$file.readFile(item.path, (err, data) => {
              if (err === null) {
                this.$store.commit('SET_FILE', data)
                item.opened = !item.opened
              }
            })
          }
        } else {
          if (item.opened) {
            this.$set(item, 'loading', true)
            let dir = this.$file.fileDisplay(item.path)
            this.$set(item, 'loading', false)
            this.$set(item, 'children', dir.children || dir)
          }
        }
      })
    },
    init () {
      // console.log(this)
    }
  },
  created () {
    // console.log(this)
    this.$store.commit('SET_DIR', this.$store.getters.dir)
    this.$store.watch((state) => {
      this.content = state.Counter.file
      return state.Counter.file
    }, (val) => {
      // console.log(val)
    })
    this.$store.watch((state) => {
      this.data = [JSON.parse(JSON.stringify(state.Counter.dir))]
      return state.Counter.dir
    }, (val) => {
      // console.log(val)
    })
    this.$nextTick(() => {
      menu.headMenu()
      menu.contentMenu()
      this.init()
    })
  }
}
</script>
<style>
.editor-box .file-tree {
  color: #ccc!important;
}
.editor-box .file-tree li{
  word-break: break-all;
}
.editor-box .file-tree .tree-last .tree-ocl{
  display: none;
}
.editor-box .file-tree .tree-loading .tree-ocl{
  display: inline-block;
}
.editor-box .name-list{
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
}
.editor-box .name-list .label{
  padding: 4px 20px 4px 8px;
  font-size: 14px;
  /* background: rgba(255, 255, 255, .05); */
  /* border-radius: 3px; */
  margin-right: 3px;
  display: inline-block;
}
.editor-box .name-list .label cite{
  cursor: pointer;
  font-style: normal;
}
.editor-box .name-list .list-group-item{
  display: inline-block;
}
.editor-box .name-list .list-group-item .label.active{
  background: rgba(0, 0, 0, .5);
}
.editor-box .name-list .label .icon-close{
  color: #ccc;
  font-size: 10px;
  font-weight: bold;
  display: none;
  margin-left: 2px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -5px;
  left: auto;
}
.editor-box .name-list .list-group-item .label:hover .icon-close,
.editor-box .name-list .list-group-item .label.active .icon-close{
  display: inline;
}

.editor-box .editor-el{
  height: 100%!important;
  right: 0!important;
  width: auto!important;
  cursor: auto!important;
}
.editor-box .editor-el.movedown{
  padding-top: 24px!important;
  margin-top: -24px;
}
/* .editor-box textarea{
  width: 100%;
  padding: 10px;
  outline: none;
  resize: none;
  display: block;
  color: #eee;
  background-color: #333;
} */
.editor-box .CodeMirror{
  height: 100%;
}
</style>

