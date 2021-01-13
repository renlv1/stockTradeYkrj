<template>
  <div id="app" :class="lang">
    <input type="text" autocomplete="off" style="display:none;" />
    <input type="password" style="display:none;" autocomplete="off" />
    <!--全局loading-->
    <!--<div class="ajax-loading" v-show="$store.state.showLoading">-->
      <!--<div class="loading-content">-->
        <!--<img class="rotate" src="@img/loading2.svg" alt="">-->
        <!--<p>正在提交中...</p>-->
      <!--</div>-->
    <!--</div>-->

    <!--全局使用element loading   -->
    <div class="ajax-loading" v-show="$store.state.showLoading">
      <div class="loading-content">
        <div v-loading="true"></div>
      </div>
    </div>
    <web-header></web-header>
    <transition :name="$route.path.includes('user/') ? '' : 'zoom'">
      <router-view class="main-container" />
    </transition>
    <web-footer></web-footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showList: false,
      lang: (localStorage.getItem('lang') || 'CN').toLowerCase()
    }
  },
  created() {
    this.$store.dispatch('getBalance')
  },
  components: {
    webHeader: require('@/components/header').default,
    webFooter: require('@/components/footer').default,
  }
};
</script>

<style lang="less">
  @import "assets/css/reset.less";
  @import "assets/css/common.less";
  .red{
    color: #ff415d;
  }
  #app {
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    min-width: 1100px;
  }
  &:focus{
    border: none;
    outline: none;
  }
  .el-picker-panel.el-date-range-picker{
    filter: none;
    .el-range-input{
      color: #1c1c1c;
    }
  }
  .el-picker-panel.el-date-range-picker1 {
    background-color: #272730;
    border: 1px solid #41414f;
    .is-left {
      border-right: 1px solid #41414f;
    }
    th {
      border-bottom: 1px solid #41414f;
    }
    .prev-month, .next-month {
      color: #41414f;
    }
    .available {
      color: #fff;
    }
    .el-date-table td.in-range div,
    .el-date-table td.in-range div:hover,
    .el-date-table.is-week-mode .el-date-table__row.current div,
    .el-date-table.is-week-mode .el-date-table__row:hover div {
      background-color: rgba(235, 235, 235, .25);
    }
    .el-picker-panel__icon-btn {
      color: #fff;
      &:hover {
        color: #409EFF;
      }
    }
    .popper__arrow {
      border-bottom-color: #41414f !important;
      &::after {
        border-bottom-color: #272730 !important;
      }
    }
  }

  .main-container {
    padding-top: 80px;
    min-height: calc(100vh - 60px);
  }

  .zoom-leave {
    display: none;
  }

  .zoom-enter-to {
    transition: .35s;
  }

  .zoom-enter {
    transform: scale(.98);
    opacity: .2;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>
