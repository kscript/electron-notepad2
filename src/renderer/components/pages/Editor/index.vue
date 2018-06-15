<template>
    <div class="editor-box f100">
      <div class="flex f100">
        <div class="fl fl3 f100">
          <v-jstree class="file-tree" :data="data" allow-batch whole-row @item-click="itemClick"></v-jstree>
        </div>
        <div class="fl fl9 f100">
          <codemirror class="f100" :value="content" :options="editorConfig"></codemirror>
        </div>
      </div>
    </div>
</template>
<script>
import menu from '../../../assets/menu.js'
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
      editorConfig: {
        mode: 'javascript',
        lineNumbers: true,
        theme: 'base16-dark'
      },
      data: [
        {
          'text': 'Same but with checkboxes',
          'children': [
            {
              'text': 'initially selected',
              'selected': true
            },
            {
              'text': 'custom icon',
              'icon': 'fa fa-warning icon-state-danger'
            },
            {
              'text': 'initially open',
              'icon': 'fa fa-folder icon-state-default',
              'opened': true,
              'children': [
                {
                  'text': 'Another node'
                }
              ]
            },
            {
              'text': 'custom icon',
              'icon': 'fa fa-warning icon-state-warning'
            },
            {
              'text': 'disabled node',
              'icon': 'fa fa-check icon-state-success',
              'disabled': true
            }
          ]
        },
        {
          'text': 'Same but with checkboxes',
          'opened': true,
          'children': [
            {
              'text': 'initially selected',
              'selected': true
            },
            {
              'text': 'custom icon',
              'icon': 'fa fa-warning icon-state-danger'
            },
            {
              'text': 'initially open',
              'icon': 'fa fa-folder icon-state-default',
              'opened': true,
              'children': [
                {
                  'text': 'Another node'
                }
              ]
            },
            {
              'text': 'custom icon',
              'icon': 'fa fa-warning icon-state-warning'
            },
            {
              'text': 'disabled node',
              'icon': 'fa fa-check icon-state-success',
              'disabled': true
            }
          ]
        },
        {
          'text': 'And wholerow selection'
        }
      ]
    }
  },
  watch: {
    content: {
      handler (newVal) {
        this.$store.commit('SET_FILE', newVal)
      }
    }
  },
  methods: {
    // editBlur () {
    //   this.$store.commit('SET_FILE', this.content)
    // },
    itemClick (node) {
      console.log(node.model.text + ' clicked !')
    },
    init () {
      // console.log(this)
    }
  },
  created () {
    this.$store.watch((state) => {
      this.content = state.Counter.file
      return state.Counter.file
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
.editor-box .file-tree .tree-ocl{
  display: none;
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

