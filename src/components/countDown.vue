<template>
  <span style="margin-left: 4px;">
    <i v-if="dataTime >= 1000">{{getDuration(dataTime)}}</i>
    <i v-else class="el-icon-loading"></i>
  </span>
</template>

<script>
export default {
  data () {
    return {
      timer: null,
      dataTime: ''
    }
  },
  props: {
    time: [String, Number]
  },
  watch: {
    time: {
      handler: function() {
        clearInterval(this.timer)
        this.dataTime = parseInt(this.time)
        this.timer = setInterval(() => {
          this.dataTime -= 1000
          if (this.dataTime <= 0) {
            this.$emit('finish')
            clearInterval(this.timer)
          }
        }, 1000)
      },
      immediate: true
    }
  },
  methods: {
    getDuration (mss) {
      if (!mss || mss < 1000) {
        mss = '- -'
      } else {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        mss = `${this.toDouble(hours)}:${this.toDouble(minutes)}:${this.toDouble(seconds)}`
      }
      return mss
    },
    toDouble (num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style>

</style>