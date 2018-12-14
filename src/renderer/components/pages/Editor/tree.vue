<template>
  <div class="tree-box" 
      :style="{width: asideW + 'px', height: '100%', overflowX: 'hidden'}">
    <v-jstree
      class="file-tree scroll"
      whole-row
      allow-batch
      :data="data"
      :item-events="treeEvents"
      @item-click="itemClick">
      <template slot-scope="vo">
        <i :class="vo.vm.themeIconClasses" role="presentation" v-if="!vo.model.loading"></i>
        <span v-html="vo.model.text" v-if="!vo.model.input"></span>
        <template v-else>
          <input v-model="editInputVal" ref="renameInput" @keyup.13="editFileName(vo.model, vo)" @blur="editFileName(vo.model, vo)"/>
        </template>
      </template>
    </v-jstree>
  </div>
</template>
<script>
export default {
  data () {
    return {
      editInputVal: '',
      treeEvents: {
        contextmenu: (node, data, $event) => {
          // console.log(node, data, $event)
          // this.$emit('treeContextmenu', node, data, $event)
          this.treeContextmenu(node, data, $event)
        }
      }
    }
  },
  props: {
    asideW: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 点击右键菜单 - 重命名
    renameClick (data) {
      this.editInputVal = data.text
      this.$set(data, 'input', 1)
      this.$nextTick(() => {
        this.inputfocus()
      })
    },
    itemClick (node, item) {
      this.$emit('treeItemClick', node, item)
    },
    // 确认修改文件
    editFileName (data) {
      this.$set(data, 'input', 0)
      if (this.editInputVal && this.editInputVal !== data.text) {
        this.$set(data, 'text', this.editInputVal)
        this.$bus.$emit('rename', data)
      }
    },
    inputfocus () {
      this.$refs.renameInput && this.$refs.renameInput.focus()
    },
    treeContextmenu (node, data, $event) {
      let Menu = this.$menu.Menu
      let MenuItem = this.$menu.MenuItem
      let remote = this.$menu.remote

      let menu = new Menu()
      let finfo = this.$path.parse(data.path)
      // this.$store.getters
      menu.append(new MenuItem({
        label: '重命名',
        click: () => {
          this.renameClick(data)
        }
      }))
      if (data.type === 'file') {
        if (finfo.ext === '.md') {
          menu.append(new MenuItem({
            label: 'markdown文件预览',
            click: () => {
              data.viewmode = 'markdown'
              this.$emit('viewmodeChange', data, 'markdown')
            }
          }))
        }
      } else if (data.type === 'dir') {
        menu.append(new MenuItem({
          label: '新建文件',
          click: () => {
            this.$bus.$emit('newFile', data.path)
          }
        }))
        menu.append(new MenuItem({
          label: '添加文件夹',
          click: () => {
            this.$bus.$emit('newPath', data.path)
          }
        }))
      }
      menu.popup({
        window: remote.getCurrentWindow()
      })
    }
  },
  created () {
    this.$bus.$off('rename').$on('rename', file => {
      if (file && file.path && file.text) {
        let value = file.text
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
                  file.text = value
                  file.path = newPath
                  this.$emit('editFileName', oldPath, newPath, file)
                }
              })
            }
          }
        }
      }
    })
  }
}
</script>
<style lang="scss">
.tree-box .file-tree {
    height: 100%;
    color: #ccc!important;
    .tree-selected{
      input{
        outline: none;
      }
    }
    .tree-wholerow{
      z-index: 0!important;
    }
    .tree-wholerow-hovered{
      background: #3f3f3f!important;
    }
    .tree-wholerow-clicked,
    .tree-wholerow-hovered.tree-wholerow-clicked{
      background: #505050!important;
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
</style>

