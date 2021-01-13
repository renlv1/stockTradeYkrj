<template>
  <div class="footer">
    <!-- <div class="wrap row">
      <div class="row">
        <div v-for="(item, index) in list" :key="index" :href="item.link">
          <a class="link" v-if="item.link.includes('https://')" target="_blank" :href="item.link">{{item.text}}</a>
          <router-link class="link" v-else :to="item.link">{{item.text}}</router-link>
        </div>
      </div>
      <div class="row">
        CopyRight ©{{new Date().getFullYear()}} EPOCA
      </div>
    </div> -->
    CopyRight ©{{new Date().getFullYear()}} StockCoin
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          text: this.$t('common.footer.text1'),
          link: 'https://www.radarlab.org/cn'
        },
        {
          text: this.$t('common.footer.text2'),
          link: 'https://t.radarlab.org/'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.footer{
  text-align: center;
  font-size: 12px;
  background: #111114;
  color: #fff;
  line-height: 60px;
  // position: relative;
  // z-index: 2;
  // .link{
  //   margin-right: 60px;
  //   &:hover{
  //     color: #fff !important;
  //   }
  // }
  // .row{
  //   opacity: .7;
  //   font-size: 14px;
  // }
}
</style>

