<template>
  <div class="user-head" :style="`background:${color}`" :title="online ? $t('common.online') : ''">
    <div class="text">{{name && name.slice(0, 1).toUpperCase()}}</div>
    <div class="state-point" :class="{active: online}"></div>
  </div>
</template>

<script>
export default {
  props: {
    code: String,
    name: String,
    online: Number
  },
  computed: {
    color () {
      const reg1 = /[i-p]$/i
      const reg2 = /[q-z]$/i
      let color = '#68b4ff'
      if (reg1.test(this.code)) {
        color = '#66cc99'
      } else if (reg2.test(this.code)) {
        color = '#ffcc99'
      }
      return '#4d4d5b'
    }
  }
}
</script>

<style lang="less" scopd>
.user-head{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  position: relative;
  .allCenter;
  justify-content: center;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  margin-right: 10px;
  line-height: 1;
  .state-point{
    position: absolute;
    right: -3px;
    bottom: 2px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    border: 2px solid #fff;
    background: #ccc;
    &.active{
      background: #12e58a;
    }
  }
}
</style>