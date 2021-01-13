<template>
  <div class="c-page">
    <div class="wrap wrap-content">
      <div class="tabs-container">
        <!-- 审核已通过 -->
        <div v-if="isbusinessman == 2">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 广告交易统计 -->
            <el-tab-pane class="tab-content" :label="$t('advertising.texta')" name="first">
              <div class="title-wrap">
                <h3>{{$t('advertising.text1')}}</h3>
                <h5>{{$t('advertising.text2')}}{{statisInfo.sysDate | time}}</h5>
              </div>
              <div class="table-wrap">
                <div class="tabs">
                  <div class="tab" @click="tabClick(1)" :class="{'activeTab': currentTab === 1}">{{$t('advertising.text3')}}</div>
                  <div class="tab" @click="tabClick(2)" :class="{'activeTab': currentTab === 2}">{{$t('advertising.text4')}}</div>
                </div>
                <table>
                  <tr class="left" style="border-top: 1px solid #323243">
                    <td>{{$t('advertising.text5')}}</td>
                    <td>
                      <div class="sell-box">{{$t('advertising.text6')}}</div>
                      {{$t('advertising.text7')}}
                    </td>
                    <td>
                      <div class="buy-box">{{$t('advertising.text8')}}</div>
                      {{$t('advertising.text9')}}
                    </td>
                  </tr>
                  <tr class="left">
                    <td>{{$t('advertising.text10')}}</td>
                    <td>{{statisInfo.sellNumbers}}</td>
                    <td>{{statisInfo.buyNumbers}}</td>
                  </tr>
                  <tr class="left">
                    <td>{{$t('advertising.text11')}}</td>
                    <td>{{statisInfo.sellFinishNumbers}}</td>
                    <td>{{statisInfo.buyFinishNumbers}}</td>
                  </tr>
                  <tr class="left">
                    <td>{{$t('advertising.text12')}}</td>
                    <td>{{statisInfo.sellRate * 100}}%</td>
                    <td>{{statisInfo.buyRate * 100}}%</td>
                  </tr>
                  <tr class="left">
                    <td>{{$t('advertising.text13')}}</td>
                    <td>{{statisInfo.sellTotal}}</td>
                    <td>{{statisInfo.buyTotal}}</td>
                  </tr>
                  <tr class="left">
                    <td>{{$t('advertising.text14')}}</td>
                    <td>{{statisInfo.sellAmountCNY}}</td>
                    <td>{{statisInfo.buyAmountCNY}}</td>
                  </tr>
                  <tr class="left">
                    <td>{{$t('advertising.text15')}}</td>
                    <td>{{statisInfo.sellAmountUSD}}</td>
                    <td>{{statisInfo.buyAmountUSD}}</td>
                  </tr>
                </table>
              </div>
            </el-tab-pane>
            <!-- 我的广告 -->
            <el-tab-pane class="tab-content" :label="$t('advertising.text16')" name="second">
              <!-- 按需加载 -->
              <component :is="componentName" :ceche="cacheIndex"></component>
            </el-tab-pane>
            <!-- 广告认证 -->
            <el-tab-pane class="tab-content" :label="$t('advertising.text17')" name="third">
              <div class="title-wrap">
                <h3 v-if="$store.state.allUserInfo.businessman">Hi，{{$store.state.allUserInfo.businessman.userName}}</h3>
                <!-- 审核通过市商 -->
                <h5>
                  <img src="./images/success.png" />
                  {{$t('advertising.text18')}}
                  <button @click="cancelCertification">{{$t('advertising.text19')}}</button>
                </h5>
              </div>
              <div class="table-wrap">
                <div class="table-head">{{$t('advertising.text20')}}</div>
                <div class="table-body">
                  <div class="hCenter">
                    <span>{{$t('advertising.text21')}}</span>
                    <span>{{homeAddress}}</span>
                  </div>
                  <div class="hCenter">
                    <span>{{$t('advertising.text22')}}</span>
                    <span>{{$t('advertising.text23')}}</span>
                  </div>
                  <div class="hCenter">
                    <span>{{$t('advertising.text24')}}</span>
                    <span>{{$t('advertising.text25')}}</span>
                  </div>
                  <div class="hCenter">
                    <span>{{$t('advertising.text26')}}</span>
                    <span>{{$store.state.allUserInfo.bondLimit}}USDT</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 广告认证 -->
            <el-tab-pane class="tab-content" :label="$t('advertising.text27')" name="four">
              <div class="table-wrap" style="margin: 30px 0 40px">
                <div class="table-head">{{$t('advertising.text28')}}</div>
                <div class="table-body">
                  <div class="hCenter">
                    <span>{{$t('advertising.text29')}}</span>
                    <el-switch
                      @change="changeNewOrderTip"
                      :value="$store.state.allUserInfo.businessman.alertType === 1"
                      active-color="#16dd9f"
                      inactive-color="#32323e"
                    >
                    </el-switch>
                  </div>
                  <div class="hCenter">
                    <span>{{$t('advertising.text30')}}</span>
                    <el-switch
                      @change="changeDealOrderTip"
                      :value="$store.state.allUserInfo.businessman.waitAlert === 1"
                      active-color="#16dd9f"
                      inactive-color="#32323e">
                    </el-switch>
                  </div>
                </div>
              </div>
              <div class="table-wrap">
                <div class="table-head">{{$t('advertising.text31')}}</div>
                <div class="table-body">
                  <div class="hCenter" v-for="item in quickList" :key="item.index">
                    <p class="reply-content">{{item.content}}</p>
                    <div>
                      <span @click="edit(item.id, item.content)" class="edit">{{$t('advertising.text32')}}</span>
                      <span @click="del(item.id)" class="del">{{$t('advertising.text33')}}</span>
                    </div>
                  </div>
                  <div class="hCenter" v-show="quickList.length < 6">
                    <p class="pointer" style="color: #639cff; font-size: 14px" @click="add">+ {{$t('advertising.text34')}}</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 审核正在处理/失败 -->
        <div class="tab-content" v-else>
          <div class="title-wrap">
            <h3 v-if="$store.state.allUserInfo.businessman">Hi，{{$store.state.allUserInfo.businessman.userName}}</h3>
            <!-- 审核失败 -->
            <h5 v-if="businessmanStatus == 3">
              <img src="./images/error.png" />
              {{$t('advertising.text35')}}
              <button @click="$router.push('/advertising/unAuth')">{{$t('advertising.text36')}}</button>
            </h5>
            <h5 v-if="isbusinessman == 3">
              <img src="./images/review.png" />
              {{$t('advertising.text37')}}
            </h5>

            <!-- 注销市商 -->
            <h5 v-if="isbusinessman == 6">
              <img src="./images/error.png" />
              {{$t('advertising.text38')}}
              <button @click="showPayDialog = true">{{$t('advertising.text39')}}</button>
            </h5>

            <!-- 审核中取消 -->
            <h5 v-if="isbusinessman == 1">
              <img src="./images/error.png" />
              {{$t('advertising.text40')}}
              <button @click="$router.push('/advertising/unAuth')">{{$t('advertising.text41')}}</button>
            </h5>

          </div>
          <div class="table-wrap">
            <div class="table-review-body">
              <div>
                <span>{{$t('advertising.text42')}}</span>
                <span>{{homeAddress}}</span>
              </div>
              <div>
                <span>{{$t('advertising.text43')}}</span>
                <span>{{$t('advertising.text44')}}</span>
              </div>
              <div>
                <span>{{$t('advertising.text45')}}</span>
                <span>{{$t('advertising.text46')}}</span>
              </div>
              <div>
                <span>{{$t('advertising.text47')}}</span>
                <span>{{(isbusinessman == 3 || isbusinessman == 6) ? $t('exchangeOrder.text19') : ''}}{{$store.state.allUserInfo.bondLimit}}USDT</span>
              </div>
              <button v-show="isbusinessman == 3" class="submit" @click="cancel">{{$t('advertising.text48')}}</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 删除，开启，暂停弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        custom-class="reset-el-dialog-ui"
        :center="dialogTitle === $t('advertising.text49')"
      >
        <!-- 有弹窗文本内容的是要操作的弹窗 -->
        <span v-if="dialogDescription">{{dialogDescription}}</span>
        <!-- 否则是含有textarea具有输入文本功能的弹窗 -->
        <div class="textarea-wrap" v-else>
          <!-- keyup为了兼容maxlength有时失效 -->
          <textarea v-model="replyContent" maxlength="140" @keyup="replyContent = replyContent.slice(0, 140)"
                    :placeholder="$t('advertising.text49_a')"></textarea>
          <span class="textareaTextTip">{{textMaxLen}}/140</span>
        </div>
        <span slot="footer" class="dialog-footer">
        <button class="sure-btn" @click="submitDialog">{{$t('advertising.text50')}}</button>
        <button class="cancel-btn" @click="cancelDialog">{{$t('advertising.text51')}}</button>
      </span>
      </el-dialog>
      <pay-dialog :visible.sync="showPayDialog" @submit="payConfirm" />
    </div>
  </div>
</template>

<script>
import myAdvertising from './myAdvertising'
import {f} from "../../filter";

export default {
  name: "auth",
  data() {
    return {
      currentTab: 1,
      activeName: window.localStorage.getItem('setIndex') || 'first',

      dialogVisible: false,
      dialogTitle: '',
      dialogDescription: '',

      statisInfo: {}, //统计信息对象

      replyContent: '', //编辑回复内容

      quickList: [],
      contentId: '',

      showPayDialog: false,
    }
  },
  components: {
    advertising: myAdvertising
  },
  computed: {
    isbusinessman() {
      return this.$store.state.user.isbusinessman
    },
    textMaxLen() {
      return this.replyContent.length;
    },
    businessmanStatus() {
      let businessmanInfo = this.$store.state.allUserInfo.businessman;
      let status;
      if (businessmanInfo) {
        status = businessmanInfo.status
      }
      return status
    },
    homeAddress() {
      let userCertification = this.$store.state.allUserInfo.userCertification;
      let homeAddress;
      if (userCertification) {
        homeAddress = userCertification.homeAddress
      }
      return homeAddress
    },
    componentName() {
      let name = '';
      if (this.activeName === 'second') {
        name = 'advertising'
      }
      return name
    },
    cacheIndex() {
      let isCache = false;
      if (window.localStorage.getItem('setIndex')) {
        isCache = true;
      }
      return isCache;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (from.path.includes('/advertising/auth') && to.path.includes('/advertising/releaseAd')) {
      // 缓存tabIndex, 类型, 币种, 状态, 页码
      window.localStorage.setItem('setIndex', this.activeName);
    } else {
      // 清除缓存
      window.localStorage.removeItem('setIndex');
    }
    next()
  },

  mounted() {
    // 审核通过后再调用广告接口
    if (this.isbusinessman == 2) {
      this.handleClick();
    }
    if (this.$route.fullPath.includes('aaa')) {
      this.activeName = 'third'
    }
    if (this.activeName === 'first') {
      this.tabClick(1);
    }
  },
  methods: {
    //tab切换
    handleClick() {
      if (this.activeName === 'first') {
        this.tabClick(1);
      } else if (this.activeName === 'four') {
        this.getQuickList();
      }
    },

    cancel() { //撤回市商申请
      this.$fetch.post('/business/cancelApply').then((res) => {
        if (res.success) {
          this.$store.dispatch("getBalance");
          this.showPayDialog = false;
          this.$message.success(this.$t('advertising.text52'))
        }
      })
    },

    payConfirm(p1, p2) { //激活
      this.$fetch.post('/business/activateBusinessMan', {
        tradePwd: p1,
        code: p2,
      }).then((res) => {
        if (res.success) {
          this.$message.success(this.$t('advertising.text53'));
          this.$store.dispatch('getBalance');
          this.showPayDialog = false;
        }
      })
    },

    cancelCertification() {
      this.$confirm(this.$t('advertising.text54'), this.$t('advertising.text55'), {
        confirmButtonText: this.$t('advertising.text50'),
        cancelButtonText: this.$t('advertising.text51'),
        customClass: 'reset-custom-class'
      }).then(() => {
        this.$fetch.post('/business/cancelBusinessman').then((res) => {
          if (res.success) {
            this.$store.dispatch('getBalance');
            this.$message.success(this.$t('advertising.text56'))
          }
        })
      })
    },

    getQuickList() {
      this.$fetch.post('/business/queryQuickList').then((res) => {
        this.quickList = res.data.commonLanguageList;
      })
    }
    ,

    tabClick(index) {
      this.$fetch.post('/business/businessTradeStatistics', {
        type: index,
        loading: true
      }).then((res) => {
        this.currentTab = index;
        this.statisInfo = res.data
      })
    },

    changeNewOrderTip(value) { //切换新订单switch
      this.$fetch.post('/business/setAlertType', {
        type: value ? 1 : 2,
        loading: true
      }).then((res) => {
        if (res.success) {
          this.$store.dispatch('getBalance')
        }
      })
    },

    changeDealOrderTip(value) { //切换处理switch
      this.$fetch.post('/business/setAlertType', {
        waitAlertType: value ? 1 : 2,
        loading: true
      }).then((res) => {
        if (res.success) {
          this.$store.dispatch('getBalance')
        }
      });
    },

    //广告交易设置点击编辑按钮
    edit(id, content) {
      this.contentId = id;
      this.replyContent = content;
      this.dialogVisible = true;
      this.dialogTitle = this.$t('advertising.text57');
      this.dialogDescription = ''
    },

    //广告交易设置点击删除按钮
    del(id) {
      this.contentId = id;
      this.dialogVisible = true;
      this.dialogTitle = this.$t('advertising.text58');
      this.dialogDescription = this.$t('advertising.text59')
    },

    //广告交易设置点击新增快捷回复
    add() {
      this.replyContent = '';
      this.dialogVisible = true;
      this.dialogTitle = this.$t('advertising.text60');
      this.dialogDescription = ''
    },

    cancelDialog() {
      this.dialogVisible = false
    },

    submitDialog() { //提交弹窗
      let url = '';
      let params = {};
      if (this.dialogTitle === this.$t('advertising.text61')) {
        url = '/business/editQuick';
        params = {content: this.replyContent, id: this.contentId, type: 1}
      } else if (this.dialogTitle === this.$t('advertising.text62')) {
        url = '/business/editQuick';
        params = {content: this.replyContent, id: this.contentId, type: 2}
      } else if (this.dialogTitle === this.$t('advertising.text63')) {
        url = '/business/addQuick';
        params = {content: this.replyContent}
      }
      this.$fetch.post(url, params).then((res) => {
        if (res.success) {
          this.getQuickList();
          this.$store.dispatch('getQuickList')
        }
      });
      this.dialogVisible = false;
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrap-content {
    width 1400px
    min-width 1080
    margin 30px auto
    @media screen and (max-width: 1600px) {
      width 80%
    }
    .tab-content {
      .title-wrap {
        margin 30px 0 40px
        h3 {
          font-weight bold
          font-size 15px
          color #fff
        }
        h5 {
          margin-top 12px
          display flex
          align-items center
          color #ccc
          img {
            margin-right 6px
          }
          button {
            height: 28px;
            min-width: 80px;
            padding 0 5px
            line-height: 28px;
            text-align: center;
            background-color: #16dd9f
            color #fff
            border-radius 4px
            margin-left 20px
          }
        }
      }
      .table-wrap {
        .table-review-body {
          div {
            display flex
            align-items center
            min-height 60px
            border-bottom 1px solid #323243
            span {
              width 20%
            }
          }
          .submit {
            margin-top 30px
            width 380px
            margin-left 20%
            height 40px
            line-height 40px
            border-radius 4px
            background-color #4d62ff
            color #fff
            text-align center
            cursor pointer
          }
        }
        .tabs {
          display flex
          margin-bottom 20px
          border-radius 4px
          .tab {
            min-width: 80px;
            padding 0 5px
            height 30px
            text-align center
            line-height 30px
            border 1px solid #4d62ff
            color #ccc
            cursor pointer
          }
          .activeTab {
            border none
            background-color #4d62ff
            color #fff
          }
        }
        .table-head {
          font-weight bold
          padding 0 30px
          color #5f5e6c
        }
        .table-body {
          .hCenter {
            padding 0 30px
            min-height 60px
            border-bottom 1px solid #323243
            color #ccc
            align-items center
            .reply-content {
              padding 20px 0
              width 90%
              line-height 1.6
            }
            div {
              span {
                font-size 13px
                color #639cff
                cursor pointer
              }
              .del {
                margin-left 30px
                color #ff415d
              }
            }
          }
        }
      }
    }
  }
</style>
<style scoped>
  >>> .el-tabs__item {
    font-size: 15px;
    font-weight: bold;
    color: #5f5e6c;
  }

  >>> .el-tabs__nav-wrap::after {
    display: none;
  }

  >>> .el-tabs__item.is-active {
    color: #fff;
  }

  >>> .el-tabs__item:hover {
    color: #fff;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }
</style>
