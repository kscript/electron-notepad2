<template>
    <div class="editor-box h100">
      <textarea  class="h100" v-model="content"></textarea>
    </div>
</template>
<script>
import menu from '../../../assets/menu.js'
export default {
  data () {
    return {
      content: ''
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
</style>

