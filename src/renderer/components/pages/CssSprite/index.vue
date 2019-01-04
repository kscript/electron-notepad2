<template>
  <div class="css-sprite">
    <div class="hd">
      <el-form :inline="true">
        <el-form-item>
          <el-button @click="selectFile" size="mini">选择文件</el-button>
        </el-form-item>
        <el-form-item label="宽度">
          <el-input v-model="width" size="mini" style="width: 60px;"></el-input>
        </el-form-item>
        <el-form-item label="间距">
          <el-input v-model="padding" size="mini" style="width: 60px;"></el-input>
        </el-form-item>
        <el-form-item label="每排个数">
          <el-input v-model="num" size="mini" style="width: 60px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="build" size="mini">生成</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="clear" size="mini">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="save" size="mini">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bd">
      <el-row type="flex">
        <el-col :span="8">
          <div class="table-box scoll">
            <el-table :data="files" size="mini" style="width: 100%;" height="400">
              <el-table-column prop="path" label="图片">
                <template slot-scope="scope">
                  <img :src="scope.row.data" alt="scope.name">
                </template>
              </el-table-column>
              <el-table-column prop="name" label="文件名">
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <span class="handler-icon">
                    <i class="el-icon-arrow-up" @click="fileHandler('up', scope)"></i>
                    <i class="el-icon-arrow-down" @click="fileHandler('down',scope)"></i>
                    <i class="el-icon-close" @click="fileHandler('close',scope)"></i>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="canvas-box">
            <canvas
             ref="canvas"
             :width="cxtWidth +'px'"
             :height="cxtHeight + 'px'"
             @mousedown="onmousedown"
             @mousemove="onmousemove"
             @mouseup="onmouseup"
            >
            </canvas>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      width: 32,
      padding: 1,
      num: 15,
      cxt: null,
      imgBuffer: null,
      selecteIndex: 0,
      offsetX: 0,
      offsetY: 0,
      drag: false,
      isSave: false,
      files: []
    }
  },
  computed: {
    cxtWidth () {
      return (this.width + this.padding * 2) * this.num
    },
    cxtHeight () {
      return (this.width + this.padding * 2) * Math.ceil(this.files.length / this.num)
    }
  },
  methods: {
    getIndex ($event) {
      let x = ~~($event.offsetX / (this.width + this.padding * 2))
      let y = ~~($event.offsetY / (this.width + this.padding * 2))
      return x + this.num * y
    },
    onmousedown ($event) {
      this.drag = true
      this.offsetX = $event.offsetX % (this.num + this.padding * 2)
      this.offsetY = $event.offsetY % (this.num + this.padding * 2)
      this.selecteIndex = this.getIndex($event)
    },
    onmousemove ($event) {
      if (this.drag) {
        this.build({
          index: this.selecteIndex,
          x: $event.offsetX - this.offsetX,
          y: $event.offsetY - this.offsetY
        })
      }
    },
    onmouseup ($event) {
      if (this.drag) {
        let index = this.getIndex($event)
        this.drag = false
        this.isSave = false
        if (this.selecteIndex !== index) {
          this.exchange(this.files, this.selecteIndex, index)
        }
        this.build()
      }
    },
    selectFile () {
      this.tool.file.openFile({
        properties: ['multiSelections'],
        securityScopedBookmarks: true
      }, (files, bookmarks) => {
        if (files) {
          this.files = this.files.concat(files.map(item => {
            let file = this.tool.file.fs.readFileSync(item)
            return {
              path: item,
              file: file,
              img: null,
              data: 'data:image/png;base64,' + file.toString('base64'),
              name: this.tool.path.parse(item).base
            }
          }))
          this.build()
        }
      })
    },
    fileHandler (type, scope) {
      if (type === 'up') {
        scope.$index > 0 && this.exchange(this.files, scope.$index, scope.$index - 1)
      } else if (type === 'down') {
        scope.$index < this.files.length - 1 && this.exchange(this.files, scope.$index, scope.$index + 1)
      } else if (type === 'close') {
        this.files.splice(scope.$index, 1)
      }
      this.$nextTick(() => {
        this.build()
      })
    },
    exchange (ary, indexA, indexB) {
      if (Array.isArray(ary)) {
        ary.splice(indexA, 1, ary.splice(indexB, 1, ary[indexA])[0])
      }
    },
    loadImg (item) {
      return new Promise(resolve => {
        if (item.img) {
          resolve(item)
        } else {
          let img = new Image()
          img.onload = (e) => {
            item.img = img
            resolve(item)
          }
          img.src = item.data
        }
      })
    },
    build (selected) {
      let current
      let count = 0
      let cxt = this.cxt
      cxt.clearRect(0, 0, this.cxtWidth, this.cxtHeight)
      this.files.forEach((item, index) => {
        this.loadImg(item).then(item => {
          if (selected && index === selected.index) {
            current = item
          } else if (!selected || !this.isSave) {
            let x = (index % this.num) * (this.width + this.padding * 2)
            let y = ~~(index / this.num) * (this.width + this.padding * 2)
            this.drawImage(cxt, item, x, y)
          }
          count++
          if (count === this.files.length - 1 && current) {
            this.drawImage(cxt, current, selected.x, selected.y)
          }
        })
      })
    },
    drawImage (cxt, item, x, y) {
      cxt.drawImage(item.img, x, y, item.img.width, item.img.height)
    },
    clear () {
      this.files.splice(0)
    },
    save () {
      let path = this.tool.path.parse(this.files[this.selecteIndex].path)
      this.tool.file.setFilePath({
        defaultPath: this.tool.path.join(path.dir, 'download.png'),
        filters: [{
          name: '图片文件',
          extensions: ['png', 'gif', 'jpg', 'jpeg']
        }]
      }, filename => {
        if (filename) {
          let base64 = this.$refs.canvas.toDataURL('image/png')
          this.imgBuffer = Buffer.from(base64.replace('data:image/png;base64,', ''), 'base64')
          this.tool.file.saveFile(filename, this.imgBuffer, () => {
          })
        }
      })
    }
  },
  mounted () {
    this.cxt = this.$refs.canvas.getContext('2d')
  },
  created () {
    console.log(this)
  }
}
</script>
<style lang="scss" scoped>
.css-sprite{
  padding: 10px;
  .hd{
    // width: 600px;
  }
  .bd{
    .handler-icon{
      cursor: pointer;
      i{
        font-size: 14px;
        padding: 1px;
        &:hover{
          color: red;
        }
      }
    }
    .table-box{
      img{
        max-width: 32px;
      }
    }
    .canvas-box{
      padding: 0 10px;
    }
  }
}
</style>

