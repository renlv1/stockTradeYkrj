<template>
  <div class="c-page" @click="showSelect = false">
    <div class="user-gap f1">
      <div class="back cblue" @click="$router.back()"><i class="el-icon-back"></i>{{$t('common.back')}}</div>
      <div class="user-tit">{{$t('otcOrderDetail.text1')}}</div>
      <div class="intro-wrap">
        <div class="intro-info i1" :class="{buy: isBuy, sell: !isBuy}">
          <h3>{{isBuy ? $t('otcOrderDetail.text2') : $t('otcOrderDetail.text3')}}{{$t('otcOrderDetail.text4')}}</h3>
          <div class="big-size">{{detail.total | f}}USDT</div>
          <p><span style="margin-right: 10px; color: #7b7a8c;">{{$t('otcOrderDetail.text5')}}</span> {{detail.rate | f}}{{detail.rateCurrency}}</p>
        </div>
        <div class="intro-info i2">
          <h3>{{$t('otcOrderDetail.text6')}}</h3>
          <div class="flex">
            <div class="n">
              <span>{{$t('otcOrderDetail.text7')}}</span>
              <p>{{detail.id}}</p>
            </div>
            <div class="n">
              <span>{{$t('otcOrderDetail.text8')}}</span>
              <p>{{detail.createTime | time}}</p>
            </div>
            <div class="n">
              <span>{{$t('otcOrderDetail.text9')}}</span>
              <p>{{detail.transferAmount | f}}{{detail.rateCurrency}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="order-detail">
        <!--  卖方卡号    -->
        <div class="bank-account"
          v-if="detail.status !== 1 && detail.status !== 2 || !isBuy"
          >
          <div class="bank-head fz15 mb10">
            <b>{{$t('otcOrderDetail.text10', {name: isBuy ? detail.sellName : $t('otcOrderDetail.text73')})}}</b>
          </div>
          <bank-info :bank="sellBankAccount" showCode :showCopy="isBuy"></bank-info>
        </div>
        <!--  买方卡号    -->
        <div class="bank-account" v-if="giveBankAccount && (detail.status !== 1 && detail.status !== 2 || isBuy)">
          <div class="bank-head fz15 mb10">
            <!-- <b>{{isBuy ? '您' : detail.buyName}}</b>的付款账号 -->

            <b>{{$t('otcOrderDetail.text11', {name: isBuy ? $t('otcOrderDetail.text73') : detail.buyName})}}</b>
          </div>
          <bank-info :bank="giveBankAccount" showCode :showCopy="!isBuy"></bank-info>
        </div>
        <!--    订单状态   -->
        <div class="order-status">
          <div v-if="showAppeal || detail.status === 5 || detail.status === 6">
            <img class="order-icon" src="@img/order/warn.png" alt="">
            <p class="mb20 fz15">{{$t('otcOrderDetail.text12')}}</p>
            <appeal :problem="userProblem" :order="detail" ></appeal>
          </div>
          <template v-else>
            <!--  买方  -->
            <template v-if="isBuy">
              <!--   待选择支付方式   -->
              <div v-if="detail.status === 0">
                <img class="order-icon" src="@img/order/tips.png" alt="">
                <p class="mb20 fz15">{{$t('otcOrderDetail.text13')}}
                  <i v-if="countTime" :class="countTime > 180000 ? 'cblue' : 'cred'">{{getDuration(countTime)}}</i>
                </p>
                <p class="mb10">{{$t('otcOrderDetail.text14')}}</p>
                <template>
                  <el-select :class="{showTips: showUnSelectTips}" :placeholder="selectedBank.id ? '' : $t('otcOrderDetail.text15')" class="select-bank-list mb10" v-model="selectedBank" value-key="id">
                    <span class="prefix" slot="prefix" v-if="selectedBank.id">
                      <bank-info :bank="selectedBank"></bank-info>
                    </span>
                    <el-option
                      v-for="item in bankList"
                      :key="item.id"
                      :value="item"
                    >
                      <bank-info :bank="item"></bank-info>
                    </el-option>
                  </el-select>
                </template>
                <p class="cgray" v-if="!bankList.length">
                  {{$t('otcOrderDetail.text16')}} <span @click="$router.push('/user/france')" class="cblue pointer">{{$t('otcOrderDetail.text17')}}<i class="el-icon-arrow-right"></i></span>
                </p>
                <div class="btns">
                  <button class="btn" @click="selectBank">{{$t('otcOrderDetail.text18')}}</button>
                  <div class="btn plain cred" @click="cancel">{{$t('otcOrderDetail.text19')}}</div>
                </div>
              </div>
              <!--   待转账   -->
              <div v-else-if="detail.status === 1">
                <img class="order-icon" src="@img/order/tips.png" alt="">
                <p class="mb20 fz15">{{$t('otcOrderDetail.text13')}}
                  <i v-if="countTime" :class="countTime > 180000 ? 'cblue' : 'cred'">{{getDuration(countTime)}}</i>
                </p>
                <p class="mb30">{{$t('otcOrderDetail.text20', {name: detail.sellName})}} <i class="cblue">{{detail.transferAmount | f}}{{detail.rateCurrency}}</i>{{$t('otcOrderDetail.text21')}}</p>
                <p class="mb10">{{$t('otcOrderDetail.text22', {name: detail.sellName})}}</p>
                <bank-info :bank="sellBankAccount" showCopy showCode></bank-info>
                <div class="btns">
                  <template v-if="isRecharge">
                    <div class="btn" @click="gived">{{$t('otcOrderDetail.text23')}}</div>
                    <div class="btn plain cred" @click="cancel">{{$t('otcOrderDetail.text19')}}</div>
                  </template>
                  <div class="btn" v-else @click="givedWithdraw">{{$t('otcOrderDetail.text23')}}</div>
                </div>
              </div>
              <!--   已转账   -->
              <div v-else-if="detail.status === 2">
                <img class="order-icon" src="@img/order/wait.png" alt="">
                <p class="mb30">{{$t('otcOrderDetail.text24')}}</p>
                <p class="mb10">{{$t('otcOrderDetail.text22', {name: detail.sellName})}}</p>
                <bank-info :bank="sellBankAccount" showCopy showCode></bank-info>
                <div class="btns">
                  <div class="btn plain" @click="showAppeal = true" v-if="!showAppeal">{{$t('otcOrderDetail.text34')}}</div>
                </div>
              </div>
            </template>
            <!--  卖方  -->
            <template v-else>
              <!--   待收款   -->
              <div v-if="detail.status < 2">
                <img class="order-icon" src="@img/order/wait.png" alt="">
                <p class="mb20 fz15">{{$t('otcOrderDetail.text25')}}
                  <i v-if="countTime" :class="countTime > 180000 ? 'cblue' : 'cred'">{{getDuration(countTime)}}</i>
                </p>
                <p class="mb30"></p>
                <template v-if="giveBankAccount">
                  <p class="mb10">{{$t('otcOrderDetail.text30', {name: detail.buyName})}}</p>
                  <bank-info :bank="giveBankAccount"></bank-info>
                </template>
              </div>
              <!--   待放行   -->
              <div v-else-if="detail.status === 2">
                <img class="order-icon" src="@img/order/tips.png" alt="">
                <p class="mb20 fz15">{{$t('otcOrderDetail.text27')}}</p>
                <p class="mb30">{{detail.buyName}}{{$t('otcOrderDetail.text28')}}<i class="cblue">{{detail.transferAmount | f}}{{detail.rateCurrency}}</i>{{$t('otcOrderDetail.text29')}}</p>
                <p class="mb10">{{$t('otcOrderDetail.text30', {name: detail.buyName})}}</p>
                <bank-info :bank="giveBankAccount" showCopy showCode></bank-info>
                <div class="btns">
                  <div class="btn" v-if="isRecharge" @click="confirmReceive">{{$t('otcOrderDetail.text31')}}</div>
                  <div class="btn" v-else @click="confirmReceiveWithdraw">{{$t('otcOrderDetail.text31')}}</div>
                  <div class="btn plain" @click="showAppeal = true" v-if="!showAppeal">{{$t('otcOrderDetail.text34')}}</div>
                </div>
              </div>
            </template>
            <!--    交易完成   -->
            <div v-if="detail.status === 3">
              <img class="order-icon" src="@img/order/success.png" alt="">
              <p class="mb20 fz15">{{$t('otcOrderDetail.text32')}}</p>
              <p>{{$t('otcOrderDetail.text33')}}</p>
              <div class="btns">
                <div class="btn plain" @click="showAppeal = !showAppeal">{{$t('otcOrderDetail.text34')}}</div>
              </div>
            </div>
            <!--    交易取消   -->
            <div v-else-if="detail.status === 4">
              <img class="order-icon" src="@img/order/cancel.png" alt="">
              <p class="mb20 fz15">{{$t('otcOrderDetail.text35')}}</p>

              <p v-if="isBuy">
                {{$t('otcOrderDetail.text36')}}<span v-if="detail.canRecovery">{{$t('otcOrderDetail.text37')}}</span>
              </p>
              <div v-else>
                <p v-if="detail.recoveryStatus === 0 || detail.recoveryStatus === 2">
                  {{$t('otcOrderDetail.text38')}}
                </p>
                <template v-else>
                  {{$t('otcOrderDetail.text39')}}<span v-if="detail.canRecovery">{{$t('otcOrderDetail.text40')}}</span>
                  <template v-if="detail.canRecovery">
                    <div class="btn" v-if="isRecharge"  @click="recoveryOrder">{{$t('otcOrderDetail.text41')}}</div>
                    <div class="btn" v-else  @click="showPayDialog = true">{{$t('otcOrderDetail.text41')}}</div>
                  </template>
                </template>
              </div>
            </div>
            <!--    待区块链确认   -->
            <div v-else-if="detail.status === 7">
              <img class="order-icon" src="@img/order/wait.png" alt="">
              <p class="mb20 fz15">{{$t('otcOrderDetail.text42')}}</p>
            </div>
          </template>

        </div>
      </div>
    </div>
    <loading v-if="!detail.id"></loading>
    <!-- <chat class="chat" v-if="detail.id" :order="detail"></chat> -->
    <pay-dialog :visible.sync="showPayDialog" @submit="payConfirm"></pay-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      list: [],
      radio: '',
      id: this.$route.query.id,
      selectedBank: {},
      showSelect: false,
      sellBankAccount: {
        bankType: 0
      },
      userProblem: '',
      showAppeal: false,
      countTime: '',
      isBoss: false,
      isRecharge: false,
      showDetail: false,
      showUnSelectTips: false,
      refreshLoading: false,
      isBuy: false,
      giveBankAccount: null,
      showPayDialog: false
    };
  },
  computed: {
    bankList () {
      return this.$store.state.bankList.filter(item => {
        return item.bankType === this.sellBankAccount.bankType && item.currency.includes(this.detail.rateCurrency)
      })
    },
    refreshTime () {
      return this.$store.state.refreshTime
    },
  },
  watch: {
    refreshTime () {
      // 因为有时候刷新了数据还是没变，产品说一次不行刷两次
      this.getData()
      setTimeout(() => {
        this.getData()
      }, 3000)
    }
  },
  mounted() {
    this.getData()
    const data = this.$route.query.data
    if (data) {
      this.transform(JSON.parse(data))
    }
    // 发送类型为9的消息回执
    let remindList = this.$store.state.globalMessageList.filter(item => {
      return item.messageType === 9 && item.messageId === this.id && item.orderType < 5
    })
    remindList.forEach((item, index) => {
      this.sendRepeat(item)
      if (index === remindList.length - 1) {
        setTimeout(() => {
          this.$store.dispatch('getMessageList')
        }, 500)
      }
    })
  },
  components: {
    appeal: require('./appeal').default,
    bankInfo: require('@/components/bankInfo').default,
  },
  methods: {
    getData() {
      this.$fetch.post('/deposit/queryOrderDetail', {
        id: this.id
      }).then(res => {
        this.refreshLoading = false
        if (res.success) {
          res.data = res.data.tradeOrder
          this.transform(res.data)
        }
      }).catch(() => {
        this.refreshLoading = false
      })
    },
    countDown (time) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (time < 1000) {
          clearInterval(this.timer)
          this.countTime = 0
          setTimeout(() => {
            this.getData()
          }, 2000)
        } else {
          this.countTime = time = time - 1000
        }
      }, 1000)
    },
    getDuration (mss) {
      if (!mss) {
        mss = '- -'
      } else if (mss > 0) {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        // mss = `${hours > 0 ? this.toDouble(hours) + ':' : ''}${this.toDouble(minutes)}:${this.toDouble(seconds)}`
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
    transform (data) {
      this.detail = data
      this.isRecharge = this.detail.type === 1
      this.detail.isBuy = this.isBuy = data.currentAddress === data.buySystemCode
      if (this.isRecharge) {
        this.isBoss = data.currentAddress === data.sellSystemCode
      } else {
        this.isBoss = data.currentAddress === data.buySystemCode
      }
      if (this.isBoss) {
        this.detail.commentStatus = this.detail.businessCommentStatus
      }
      this.userProblem = data.problem || ''
      if (data.sellBankAccount) {
        this.sellBankAccount = JSON.parse(data.sellBankAccount)
      }
      if (data.giveAccount) {
        this.giveBankAccount = {
          bankNumber: data.giveAccount,
          bankName: data.giveBankName,
          realName: data.giveRealName,
          bankType: data.payMethod
        }
      }
      if (data.cancelTimes > 0) {
        this.countTime = data.cancelTimes
        this.countDown(data.cancelTimes)
      }
    },
    selectBank () {
      if (!this.selectedBank.id) {
        this.showUnSelectTips = true
        this.$message(this.$t('otcOrderDetail.text43'))
        setTimeout(() => {
          this.showUnSelectTips = false
        }, 2000)
      } else {
        this.$confirm(this.$t('otcOrderDetail.text44')).then(() => {
          this.$fetch.post('/deposit/changeDepositBankInfo', {
            bankinfoid: this.selectedBank.id,
            depositorderid: this.detail.id,
            loading: true
          }).then(res => {
            this.cb(res)
          })
        }).catch(() => {})
      }
    },
    confirmReceive () {
      this.$confirm(`<span class="cred">${this.$t('otcOrderDetail.text45')}</span>`, this.$t('otcOrderDetail.text45_1'), {
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$fetch.post('/deposit/confirmOrder', {
          depositorderid: this.detail.id,
          loading: true
        }).then(() => {
          this.$message.success(this.$t('otcOrderDetail.text46'))
          this.cb()
        })
      })
    },
    gived () {
      this.$confirm(this.$t('otcOrderDetail.text47'), this.$t('otcOrderDetail.text48')).then(() => {
        this.$fetch.post('/deposit/doGiveMoney', {
          depositorderid: this.detail.id,
          loading: true
        }).then(res => {
          this.cb(res)
        })
      }).catch(() => {})
    },
    cancel () {
      this.$confirm(`<span class="cred">${this.$t('otcOrderDetail.text49')}</span>`, this.$t('otcOrderDetail.text50'), {
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$fetch.post('/deposit/cancelDepositOrder', {
          depositorderid: this.detail.id,
          loading: true
        }).then(res => {
          this.cb(res)
        })
      }).catch(() => {})
    },
    cb () {
      this.$store.commit('SET_REFRESH')
    },
    confirmReceiveWithdraw () {
      this.$confirm(`<span class="cred">${this.$t('otcOrderDetail.text45')}</span>`, this.$t('otcOrderDetail.text45_1'), {
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$fetch.post('/draw/confirmOrderDraw', {
          draworderid: this.detail.id,
          loading: true
        }).then(() => {
          this.$message.success(this.$t('otcOrderDetail.text46'))
          this.cb()
        })
      })
    },
    givedWithdraw () {
      this.$confirm(this.$t('otcOrderDetail.text47'), this.$t('otcOrderDetail.text48')).then(() => {
        this.$fetch.post('/draw/waitGiveMoney', {
          draworderid: this.detail.id,
          loading: true
        }).then(res => {
          this.cb(res)
        })
      }).catch(() => {})
    },
    sendRepeat (message) {
      if (window.socket && window.socket.readyState === 1) {
        window.socket.send(JSON.stringify({
          messageBody: message.id,
          messageSource: 3,
          messageType: message.messageType,
          receiveSystemCode: this.$store.state.user.userSystemCode
        }))
      }
    },
    // 恢复订单 （充值单）
    recoveryOrder () {
      this.$confirm(this.$t('otcOrderDetail.text51')).then(() => {
        this.$fetch.post('/deposit/recoveryDepositOrder', {
          id: this.detail.id,
          loading: true
        }).then(res => {
          this.$message.success(this.$t('otcOrderDetail.text52'))
          this.cb()
        })
      })
    },
    // 恢复订单 （提现单）
    payConfirm (tradePwd, code) {
      this.$fetch.post('/draw/recoveryDrawOrder', {
        tradePwd,
        code,
        id: this.detail.id,
        loading: true
      }).then(res => {
        this.$message.success(this.$t('otcOrderDetail.text52'))
        this.cb()
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>

.c-page{
  display: flex;
  background: #1c1c23;
  padding-right: 10px;
  .select-bank-list{
    width: 500px;
  }
  @media screen and (max-width: 1600px) {
    .intro-wrap{
      .intro-info{
        margin-left: 0 !important;
      }
      .i1{
        width: 280px !important;;
      }
      .i2{
        flex: 1;
      }
    }
    .chat{
      width: 320px;
    }
  }
  @media screen and (max-width: 1400px) {
    .intro-wrap{
      .intro-info{
        width: 100% !important;
        margin-bottom: 10px;
      }
    }
  }
  @media screen and (max-width: 1300px) {
    .select-bank-list{
      width: 360px;
    }
    .btns .btn{
      width: 170px;
    }
  }
}
.user-gap{
  background: @bg;
  border-radius: 6px;
  margin-right: 10px;
  height: calc(100vh - 140px);
  overflow-y: auto;
}
.intro-wrap{
  display: flex;
  padding: 10px 0 40px;
  line-height: 1.1;
  flex-wrap: wrap;
  .intro-info{
    padding: 20px 30px;
    background: #32323e;
    border-radius: 2px;
    &.i1{
      width: 350px;
    }
    &.i2{
      width: 450px;
    }
    &.buy{
      border-left: 3px solid @green;
    }
    &.sell{
      border-left: 3px solid @red;
    }
    &+.intro-info{
      margin-left: 30px;
    }
    .n{
      padding-top: 26px;
      & + .n{
        margin-left: 40px;
      }
      color: #7b7a8c;
      p{
        padding-top: 10px;
        color: #ccc;
      }
    }
  }
  h3{
    font-size: 16px;
    font-weight: bold;
  }
  .big-size{
    padding: 16px 0 12px;
    font-size: 28px;
  }
}
.order-detail{
  .number{
    color: #999;
    font-size: 14px;
    margin-bottom: .3rem;
  }
  .money{
    font-size: .38rem;
    margin-bottom: .3rem;
    font-weight: bold;
  }
  .text{
    margin-bottom: .1rem;
  }
  .name{
    padding-top: 40px;
    margin-bottom: -10px;
  }
  .back-icon{
    width: 20px;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 4px;
  }
  .copy{
    padding: 4px 10px;
    font-size: 14px;
    cursor: pointer;
    height: auto;
    line-height: 1.5;
  }
  .pay-list{
    .item{
      margin-top: 22px;
      .vCenter;
      img{
        vertical-align: middle;
        margin: -3px 10px 0;
      }
    }
  }
  .section{
    // border-top: 1px solid @bc;
    padding: 30px 0;
  }
  .success-state{
    color: #09bb07;
    .vCenter;
    margin-bottom: 80px;
    img{
      margin-right: 10px;
    }
  }
  .cancel-state{
    padding-top: 20px;
    color: @warn;
    .vCenter;
    img{
      margin-right: 10px;
    }
  }
}
.btns{
  margin-top: 40px;
  display: flex;
  line-height: 1.5;
  .btn{
    margin-top: 0;
    margin-right: 20px;
    display: flex;
    align-items: center;
    line-height: 20px;
    justify-content: center;
    padding: 0 10px;
  }
}
.showTips{
  animation: changeColor 2s linear;
}
.text{
  margin-bottom: 24px;
}
.radio-text{
  font-size: 16px;
  margin-left: 10px;
}
@keyframes changeColor {
  0%,50%,100% {
    outline: 4px solid #3d2934;
  }
  25%,75% {
    outline: 4px solid red;
  }
}
.order-status{
  border: 1px dashed #41414f;
  border-radius: 6px;
  padding: 30px;
  padding-left: 70px;
  padding-bottom: 50px;
  margin: 50px 0  30px;
  position: relative;
  .order-icon{
    position: absolute;
    top: 28px;
    left: 30px;
  }
}
.bank-account{
  margin-bottom: 30px;
}


</style>
