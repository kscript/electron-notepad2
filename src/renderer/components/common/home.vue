<template>
    <div class="home f100">
      <template v-if="shouldUpdate">
        <div class="tips-box">
          <div class="hd">
            {{tips}}
          </div>
          <div class="bd">
            <el-progress type="circle" :percentage="downloadPercent"></el-progress>
          </div>
        </div>
      </template>
      <template v-else>
        <router-view></router-view>
      </template>
    </div>
</template>
<script>
export default {
  data () {
    return {
      shouldUpdate: true,
      downloadPercent: 10,
      tips: ''
    }
  },
  methods: {
    checkUpdateVersion () {
      this.tool.electron.ipcRenderer.send('checkForUpdate')
      this.tool.electron.ipcRenderer.on('message', (event, text) => {
        this.tips = typeof text === 'string' ? text : ''
      })
      this.tool.electron.ipcRenderer.on('downloadProgress', (event, progressObj) => {
        console.log('ipcRenderer', progressObj)
        this.downloadPercent = progressObj.percent || 0
      })
      this.tool.electron.ipcRenderer.on('isUpdateNow', () => {
        this.tool.electron.ipcRenderer.send('isUpdateNow')
      })
    }
  },
  created () {
    if (window) {
      window.app = this
    }
    // this.checkUpdateVersion()
  }
}
</script>
<style lang="scss" scoped>
.tips-box{
  padding: 50px;
  text-align: center;
}
</style>

