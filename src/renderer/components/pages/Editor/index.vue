<template>
    <div class="editor-box h100">
      <codemirror class="h100" :value="content" :options="editorConfig"></codemirror>
      <!-- <textarea  class="h100" v-model="content"></textarea> -->
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
      }
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
.editor-box textarea{
  width: 100%;
  padding: 10px;
  outline: none;
  resize: none;
  display: block;
  color: #eee;
  background-color: #333;
}
.editor-box .CodeMirror{
  height: 100%;
}
</style>

