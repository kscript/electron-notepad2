<template>
    <div class="editor-box f100">
      <div class="flex f100">
        <div class="scroll">
          <v-jstree class="file-tree scroll" :style="{width: asideW + 'px', height: '100%'}" :data="data" allow-batch whole-row @item-click="itemClick"></v-jstree>
        </div>
        <div class="scroll" style="overflow-x: auto;">
          <v-deformation
            style="height: 100%;right: 0; width: auto;"
            :x="205"
            :draggable="2"
            :resizable="2"
            :showHandler="false"
            :move="true"
            size="w"
            axis="x"
            @resizing="onResizing">
            <codemirror class="f100 scroll" :value="content" :options="editorConfig" @input="editChanges" ></codemirror>
          </v-deformation>
        </div>
      </div>
    </div>
</template>
<script>
import menu from '../../../assets/menu.js'
import deformation from '../../common/deformation.vue'
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
      asideW: 200,
      editorConfig: {
        mode: 'javascript',
        lineNumbers: true,
        theme: 'base16-dark'
      },
      data: [],
      treedata: [
        {
          text: 'web',
          opened: true,
          isLeaf: true,
          children: [
            {
              text: 'electron',
              opened: true,
              isLeaf: true,
              children: [
                {
                  icon: 'tree-file',
                  // isLeaf: true,
                  text: 'package.json'
                }
              ]
            }
          ]
        },
        {
          text: 'web',
          opened: true,
          isLeaf: true,
          children: [
            {
              text: 'electron',
              opened: true,
              isLeaf: true,
              children: [
                {
                  icon: 'tree-file',
                  // isLeaf: true,
                  text: 'package.json'
                }
              ]
            }
          ]
        }
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
    editChanges (val) {
      this.$store.commit('SET_FILE', val)
    },
    onResizing (left, top, width, height) {
      this.asideW = left
      // console.log(arguments)
    },
    itemClick (node, item) {
      item.opened = !item.opened
      this.$nextTick(() => {
        if (item.type === 'file') {
          this.$file.readFile(item.path, (err, data) => {
            if (err === null) {
              this.$store.commit('SET_FILE', data)
              item.opened = !item.opened
            }
          })
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

