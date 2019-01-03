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
      shouldUpdate: false,
      downloadPercent: 10,
      tips: ''
    }
  },
  created () {
    let system = this.$config.system
    if (window) {
      window.app = this
    }
    // 关于
    this.$bus.$off('about').$on('about', () => {
      this.$msgbox({
        type: 'none',
        title: '关于',
        customClass: 'msgbox-about',
        dangerouslyUseHTMLString: true,
        message: `<ul class="about-detail">
          <li>版本: ${system.version}</li>
          <li>名称: ${system.name}</li>
          <li>作者: ${system.author}</li>
          <li>许可证: ${system.license}</li>
          <li>更新时间: ${system.time}</li>
          <li>Electron:  ${system.electron}</li>
        </ul>`
      }).then(() => {
      }).catch(() => {
      })
    })
    // 自动检查
    this.tool.update((event, state, text) => {
      // 后期发提醒
    }, () => {
    })
    // 手动检查
    this.$bus.$off('checkVersion').$on('checkVersion', () => {
      this.tool.update((event, state, text, error) => {
        this.tips = typeof text === 'string' ? text : ''
        if (state === 'updateNotAva') {
          this.downloadPercent = 100
          this.shouldUpdate = false
          this.$msgbox({
            type: 'success',
            title: '检测完成!',
            message: text
          })
            .then(() => {})
            .catch(() => {})
        } else if (state === 'updateAva') {
          this.shouldUpdate = true
        } else if (state === 'error') {
          console.log(event, state, text, error)
        }
      }, (event, progressObj) => {
        this.downloadPercent = progressObj.percent || 0
      })
    })
    this.$bus.$off('CssSprite').$on('CssSprite', () => {
      this.$router.push({
        path: '/CssSprite'
      })
    })
  }
}
</script>
<style lang="scss">
.msgbox-about{
  .about-detail{
    padding: 0 10px 0 20px;
  }
}
.tips-box{
  padding: 50px;
  text-align: center;
}
</style>

