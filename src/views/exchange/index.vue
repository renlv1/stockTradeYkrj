<template>
  <div class="c-page">
    <!-- <notice class="global-notice"></notice> -->
    <div class="exchange">
      <div class="currency-wrap view" v-loading="!currencyList.length">
        <div class="currency-wrap-head">
          <el-tabs class="custom-tab" :before-leave="currencyTabSwitch" v-model="activeName" >
            <el-tab-pane :label="$t('exchangeNew.text1')" name="2"></el-tab-pane>
            <el-tab-pane :label="$t('exchangeNew.text2')" name="1"></el-tab-pane>
          </el-tabs>
          <div class="input-wrap input-wrap-a">
            <el-input
              prefix-icon="el-icon-search"
              size="mini"
              clearable
              v-model="searchKey">
            </el-input>
          </div>
        </div>
        <div class="sub-tab">
          <div class="item" :class="{active: stockType === index}" @click="stockType = index" v-for="(item, index) in $t('exchangeNew.arr1')" :key="index">
            {{item}}
          </div>
        </div>
        <dl class="dl-table" style="height: calc(100% - 130px)">
          <dt>
            <span>{{$t('exchangeNew.text3')}}</span>
            <span>{{$t('exchange.text5')}}(USDT)</span>
            <span>{{$t('exchange.text6')}}</span>
          </dt>
          <div class="scroll-wrap">
            <dd @click="tradeCurrency = item.currency" :class="{active: item.currency === tradeCurrency}" v-for="(item, index) in calcCurrencyList" :key="index">
              <span class="overflow">
                <!-- <i class="el-icon-star-on cdark fz17" :class="{cblue: item.isMyChoose === 2}" @click.stop="setCollect(item)"></i> -->
                <span v-if="$i18n.locale === 'EN'">{{item.shareNameEn}}</span>
                <span v-else>{{item.shareName}}</span>
              </span>
              <span>{{item.reckonAmount | f(item.pricePlaces)}}</span>
              <span class="green" v-if="item.riseFallRate > 0">
                +{{item.riseFallRate | f(2)}}%
              </span>
              <span class="red" v-else-if="item.riseFallRate < 0">{{item.riseFallRate | f(2)}}%
              </span>
              <span v-else>0.00%</span>
            </dd>
            <div class="empty" v-if="currencyList.length && !calcCurrencyList.length">
              <i class="el-icon-document"></i>
              <p>{{$t('common.empty')}}</p>
            </div>
          </div>
        </dl>
      </div>
      <div class="trade-wrap">
        <chart class="chart view"
          :base-currency="baseCurrency"
          :trade-currency="tradeCurrency"
          :active-currency="activeCurrency"
          ref="chart"
          @setCollect="setCollect(activeCurrency)"
          >
        </chart>
        <div class="trade view">
          <div class="flex trade-tit">
            <span class="active">{{$t('exchangeNew.text4')}}</span>
            <span class="f1"></span>
            <span v-if="activeCurrency.isOpen === 1">{{$t('exchangeNew.text5')}}</span>
            <span class="c000" v-else>{{$t('exchangeNew.text6')}}</span> :
            <countDown
              class="c000"
              @finish="init"
              :time="activeCurrency.isOpen === 1 ? activeCurrency.subEndTime : activeCurrency.subOpenTime">
            </countDown>
          </div>
          <div class="form-wrap flex">
            <div class="buy f1">
              <p v-if="isLogin" class="mb10 c000 vCenter">
                USDT{{$t('exchangeNew.text7')}}：<i class="cblue f1">{{account.baseBalance | f(pricePlaces)}}</i>
                <span class="cblue pointer" @click="rechargeFn('USDT')">{{$t('exchangeNew.text8')}}</span>
              </p>
              <el-tooltip
                :value="(buyAmount && buyAmount < 10 || !checkLimit.buy) && isLogin"
                :manual="true"
                :content="`${$t('userA.text18')}${!checkLimit.buy ? $t('userA.text19') + account.baseBalance : $t('userA.text20')}`"
                effect="light"
                placement="top">
                <div class="input-wrap">
                  <input type="text" :placeholder="$t('exchangeNew.text11')"  @input="checkInput('buyAmount', numPlaces)" v-model="buyAmount">
                  <div class="unit">USDT</div>
                </div>
              </el-tooltip>
              <p class="c000">{{$t('exchangeNew.text12')}}</p>
              <p class="cgray">{{$t('exchangeNew.text13')}}：<span class="cblue">{{parseInt(activeCurrency.buyFeeRate * 100)}}%</span></p>
              <template v-if="activeCurrency.isOpen === 1">
                <button class="btn full" v-if="isLogin" :disabled="!checkLimit.buy || buyAmount < 10" @click="submitTrade(1)">{{$t('exchange.text11')}}</button>
                <button class="btn plain full" v-else>
                  <router-link to="/login">{{$t('exchange.text16')}} </router-link>
                  <router-link to="/register">/ {{$t('exchange.text17')}}</router-link>
                </button>
              </template>
              <button class="btn full" disabled v-else>{{$t('exchangeNew.text14')}}</button>
            </div>
            <div class="sell f1">
              <p v-if="isLogin" class="mb10 c000 vCenter">
                {{tradeCurrency}}{{$t('exchangeNew.text7')}}：<i class="cblue f1">{{account.tradeBalance | f(numPlaces)}}</i>
                <span class="cblue pointer" @click="rechargeFn(tradeCurrency)">{{$t('exchangeNew.text8')}}</span>
              </p>
              <el-tooltip
                :value="(sellAmount && sellAmount < checkLimit.sellMin || !checkLimit.sell) && isLogin"
                :manual="true"
                :content="`${$t('userA.text21')}${!checkLimit.sell ? $t('userA.text19') + checkLimit.sellMax :  $t('userA.text22') + checkLimit.sellMin}`"
                effect="light"
                placement="top">
              <div class="input-wrap">
                <input type="text" :placeholder="$t('exchangeNew.text17')"  @input="checkInput('sellAmount', numPlaces)" v-model="sellAmount">
                <div class="unit">{{tradeCurrency}}</div>
              </div>
              </el-tooltip>
              <p class="c000">{{$t('exchangeNew.text18')}}</p>
              <p class="cgray">{{$t('exchangeNew.text13')}}：<span class="cblue">{{parseInt(activeCurrency.sellFeeRate * 100)}}%</span></p>
              <template v-if="activeCurrency.isOpen === 1">
                <button class="btn full" v-if="isLogin" :disabled="!sellAmount || !checkLimit.sell" @click="submitTrade(2)">{{$t('exchange.text22')}}</button>
                <button class="btn plain full" v-else>
                  <router-link to="/login">{{$t('exchange.text16')}} </router-link>
                  <router-link to="/register">/ {{$t('exchange.text17')}}</router-link>
                </button>
              </template>
              <button class="btn full" disabled v-else>{{$t('exchangeNew.text14')}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="market-wrap">
        <div class="view">
          <el-tabs class="custom-tab" value="1">
            <el-tab-pane :label="$t('exchangeNew.text19')" name="1"></el-tab-pane>
          </el-tabs>
          <div class="intro">
            <div class="section">
              <p>
                <span>{{$t('exchangeNew.text20')}}</span>
                <span>{{activeCurrency.currency}}</span>
              </p>
              <p >
                <span class="name-label">{{$t('exchangeNew.text21')}}</span>
                <span v-if="$i18n.locale === 'EN'" class="en-name">{{activeCurrency.shareNameEn}}</span>
                <span v-else>{{activeCurrency.shareName}}</span>
              </p>
              <p>
                <span>{{$t('exchangeNew.text22')}}</span>
                <span>{{activeCurrency.shareCode}}</span>
              </p>
              <p>
                <span>{{$t('exchangeNew.text23')}}</span>
                <span>{{activeCurrency.beontime | time}}</span>
              </p>
              <p>
                <span>{{$t('exchangeNew.text24')}}</span>
                <span>{{activeCurrency.issueNum}}</span>
              </p>
              <p>
                <span>{{$t('exchangeNew.text25')}}</span>
                <span>{{activeCurrency.stockNum}}</span>
              </p>
            </div>
            <div class="section">
              <div class="label">{{$t('exchangeNew.text26')}}</div>
              <p class="c000">{{activeCurrency.content}}</p>
            </div>
            <div class="section" v-if="activeCurrency.alink">
              <div class="label">{{$t('exchangeNew.text27')}}</div>
              <a :href="item" target="_blank" v-for="(item, index) in activeCurrency.alink.split(',')" :key="index">{{item}}</a>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="order-list" v-if="isLogin">
      <div class="tab-wrap">
        <el-tabs v-model="viewOrderType">
          <el-tab-pane :label="$t('exchangeNew.text28')" name="1"></el-tab-pane>
          <el-tab-pane :label="$t('exchangeNew.text29')" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <record v-show="viewOrderType == 1" class="record-w" style="background: #fff; color: #000;" ref="record" :trade-currency="tradeCurrency" @cancel="getTradeList()"></record>
      <assets
        ref="assets"
        class="exchange-assets-wrap"
        :holdNumA="holdNumA"
        @changeCurrency="changeCurrency"
        :class="{show: viewOrderType != 1}" />
      <div class="link cblue">
        <router-link :to="viewOrderType == 1 ? '/exchangeOrder' : '/user/money'">{{$t('exchangeNew.text30')}} <i class="el-icon-arrow-right"></i></router-link>
      </div>
    </div>
    <pay-dialog :visible.sync="showPayDialog" @submit="payConfirm"></pay-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
	    holdNumA: 1,
      activeName: '2',
      searchKey: '',
      cnyRate: '',
      showBuyPanel: true,
      showSellPanel: true,
      priceType: '2', // 1 市价交易， 2 限价交易
      tradeType: 1, // 1 买， 2 卖
      baseCurrency: 'USDT', // 基础币种
      tradeCurrency: this.$route.query.currency,  // 交易币种
      buyList: [], // 买盘
      sellList: [], // 卖盘
      realTradeList: [], // 实时交易
      showPayDialog: false,
      buyPrice: '', // 买入价格
      sellPrice: '', // 卖出价格
      buyAmount: '', // 买入数量
      sellAmount: '', // 卖出数量
      orderList: [], // 委托订单
      canSetPrice: false, // 是否能填充价格到输入框
      timer: null,
      viewOrderType: '1', // 1 委托订单， 2 委托历史
      stockType: 0
    }
  },
  components: {
    chart: require('./chart').default,
    record: require('@/views/order/exchangeOrder').default,
    assets: require('@/views/money/money').default,
    countDown: require('@/components/countDown').default,
  },
  mounted () {
    this.createInterval()
    this.$store.commit('SET_LOADING', false)
  },
  computed: {
    account () {
      const account = this.$store.state.allUserInfo.userAccount
      if (account) {
        return {
          baseBalance: account[this.baseCurrency].balance,
          tradeBalance: account[this.tradeCurrency] ? account[this.tradeCurrency].balance : '',
        }
      } else {
        return {}
      }
    },
    isLogin () {
      return this.$store.getters.isLogin
    },
    calcCurrencyList () {
      const key = this.searchKey.toUpperCase()
      return this.currencyList.filter(item => {
        let str = item.shareName + item.shareCode + item.currency
        if (str.toUpperCase().includes(key)) {
          if (item.type === this.stockType || !this.stockType) {
            if (this.activeName == 2 || this.activeName == 1 && item.isMyChoose === 1) {
              return item
            }
          }
        }
      })
    },
    currencyList () {
      return this.$store.state.currencyList
    },
    activeCurrency () {
      return this.currencyList.find(item => item.currency === this.tradeCurrency) || {}
    },
    pricePlaces () {
      return this.activeCurrency.pricePlaces
    },
    numPlaces () {
      return this.activeCurrency.numPlaces
    },
    checkLimit () {
      let buy = true
      let sell = true
      let sellMin = 0
      let sellMax = this.account.tradeBalance
      if (this.isLogin) {
        if (this.buyAmount > this.account.baseBalance) {
          buy = false
        }
        if (this.sellAmount > this.account.tradeBalance) {
          sell = false
        }
        sellMin = (10 / this.activeCurrency.minOnePrice).toFixed(4)
      }
      return {
        buy,
        sell,
        sellMax,
        sellMin
      }
    }
  },
  watch: {
    tradeCurrency () {
      this.canSetPrice = true
      localStorage.setItem('tradeCurrency', this.tradeCurrency)
      this.createInterval()
      this.buyAmount = this.sellAmount = ''
    },
    viewOrderType (newVal) {
      if (newVal == 2) {
        this.$refs.assets.getMoney()
      }
    }

  },
  methods:{
    init () {
      this.$nextTick(() => {
        this.$store.dispatch('getCurrencyList')
        if (this.isLogin) {
          this.$refs.record && this.$refs.record.getData()
          this.$store.dispatch('getBalance')
        }
      })

    },
    createInterval () {
      clearInterval(this.timer)
      this.init()
      this.timer = setInterval(() => {
        this.init()
      }, 10000)
    },
    setCollect (item) {
      if (this.isLogin) {
        this.$fetch.post('/shareInfo/addMyChoose', {
          shareId: item.id
        })
        item.isMyChoose = item.isMyChoose === 2 ? 1 : 2
      } else {
        this.$router.push('/login')
      }
    },
    checkInput (key, place) {
      let reg = new RegExp(`^([1-9]\\d*|0{1})(\\.\\d{0,${place}})?`)
      let val = this[key]
      let res = val.match(reg)
      const MAX = 100000000 // 挂单金额和数量最多一亿
      if (res) {
        let matchVal = res[0]
        if (parseFloat(matchVal) > MAX) {
          val = matchVal.slice(0, -1)
        } else {
          val = matchVal
        }
      } else {
        val = ''
      }
      this[key] = val
    },
    submitTrade (type) {
      const state = this.$store.state
      if (!!state.allUserInfo.isCertification) {
        this.$alert(this.$t('exchange.text32'), this.$t('exchange.text33'), {
          type: 'warning',
          center: true,
          customClass: 'zx-dialog',
          confirmButtonText: this.$t('exchange.text34')
        }).then(() => {
          this.$router.push('/user/accountInfo')
        })
      } else {
        this.tradeType = type
        this.payConfirm('unlock', 'unlock')
      }
    },
    payConfirm (p1, p2) {
      let amount = ''
      let price = ''
      if (this.tradeType === 1) {
        price = this.buyAmount
      } else {
        amount = this.sellAmount

      }
      this.$fetch.post('/coinentrustRecord/createRecord', {
        amount,	// 数量(必填)
        price,	// 金额（限价时必填）
        type: this.tradeType, // 1:买2:卖(必填)
        tradePwd:	p1, // 交易密码(必填)
        code: p2, // 验证码(必填)
        currency: this.tradeCurrency, // 币种(必填)
        loading: true
      }).then(res => {
        this.$message.success(this.$t('common.success'))
        this.$store.dispatch('getBalance')
        this.showPayDialog = false
        this.buyAmount = this.sellAmount = ''
        this.createInterval()
      }).catch(err => {
        if (err.errorcode === 'need_code') {
          this.showPayDialog = true
        }
      })
    },
    currencyTabSwitch (activeName) {
      if (activeName == 1 && !this.isLogin) {
        this.$router.push('/login')
        return false
      }
    },
    changeCurrency (currency) {
      this.tradeCurrency = currency
      document.querySelector('.main-container').scrollIntoView({
        behavior: 'smooth'
      })
    },
    rechargeFn (currency) {
      const el = this.$refs.assets
      if (el) {
        if (currency === 'USDT') {
          el.rechargeUsd()
        } else {
          const item = el.newCurrencyList.find(item => item.currency === currency)
          if (item) {
            el.rechargeFn(item)
          }
        }
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
@red: #ff415d;
@green: #16dd9f;
.overflow{
  overflow: hidden;
  max-width: 100px;
  text-overflow: ellipsis;
}
.red{
  color: @red !important;
}
.green{
  color: @green !important;
}
.en-name{
  word-break: break-word;
  padding-left: 20px;
  text-align: right;
}
.name-label{
  white-space: nowrap;
}
.currency-wrap-head{
  /deep/ .el-tabs__nav-wrap{
    &::after{
      height: 0;
    }
    .el-tabs__active-bar{
      display: none;
    }
    .el-tabs__item{
      border: 1px solid #e6e6e6;
      color: #1c1c1c;
      padding: 0 16px !important;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      &:nth-child(2) {
        border-right: none;
      }
      &:nth-child(3) {
        border-left: none;
      }
      &.is-active{
        color: #fff;
        background-color: #2492f5;
      }
    }
  }
}
.c-page{
  background: #f5f5f7;

  min-width: 1200px;
}
.c-content{

}
.exchange{
  display: flex;
  height: calc(100vh - 80px);
  min-height: 800px;
  color: #7d7c8e;
  tbody {
    tr.active, tr:hover{
      background: rgb(59 59 72);
    }
    td{
      cursor: pointer;
    }
  }
  .currency-wrap{
    width: 320px;
    padding: 10px 22px;
    td{
      height: 32px;

    }
    &-head{
      position: relative;
      .input-wrap{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 40%;
        /deep/ input{
          border-radius: 20px;
          border-color: #ddd;
        }
      }
      .input-wrap-a{
        margin-bottom: 15px;
      }
    }
    .sub-tab{
      display: flex;
      color: #000;
      border-bottom: 1px solid #e6e6e6;
      margin: 10px -22px 10px -22px;
      cursor: pointer;
      padding-left: 22px;
      .item{
        margin-right: 15px;
        padding-bottom: 10px;
        margin-bottom: -1px;
        max-width: 80px;
        &.active,&:hover{
          color: @blue;
          border-bottom: 2px solid @blue;
        }
      }
    }
  }
  .trade-wrap{
    flex: 1;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    min-width: 660px;
    .form-wrap{
      padding-top: 4px;
    }
    .input{
      border: 1px solid @bc;
      // background: @bc;
      border-radius: 4px;
      padding: 7px 15px;
      height: 34px;
      line-height: 1.3;
      border-radius: 4px;
      flex: 1;
      color: #92909e;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: not-allowed;
    }
    .trade{
      height: 300px;
      margin-top: 10px;
      padding: 10px 26px;
      &-tit{
        border-bottom: 1px solid @bc;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: 30px;
        margin-bottom: 20px;
        .active{
          border-bottom: 2px solid  @blue;
          margin-bottom: -1px;
          font-size: 15px;
          padding: 0 5px;
          color: @blue;
        }
      }
      .sell{
        border-left: 1px solid @bc;
        margin-left: 30px;
        padding-left: 30px;
        .btn{
          background: @red;
        }
      }
      .btn{
        margin-top: 30px;
      }
      .buy{
        .btn{
          background: @green;
        }
      }
      p + p{
        padding-top: 3px;
      }
      .input-wrap{
        .vCenter;
        margin: 15px 0;
        .label{
          margin-bottom: 0;
          margin-right: 10px;
        }
        input{
          flex: 1;
          height: 34px;
          font-size: 15px;
          padding-right: 70px;
        }
        .unit{
          bottom: 10px;
          background: #fff;
        }
      }
      .calc{
        border-top: 1px solid @bc;
        padding-top: 20px;
        margin-top: 24px;
        p{
          padding-bottom: 6px;
        }
      }
    }
  }
  .market-wrap{
    display: flex;
    width: 320px;
    .view{
      width: 100%;
      padding: 20px 22px;
    }
    .t-btn{
      line-height: 30px;
      height: 30px;
      background: #41414f;
      cursor: pointer;
      color: #fff;
      padding: 0 6px;
      border-radius: 4px;
      margin-right: 10px;
      &.active{
        background: @red;
        &:first-child{
          background: @green;
        }
      }
    }
    .trade-real{
      margin-left: 10px;
    }
    dt{
      margin-top: 10px;
    }
    dd{
      font-size: 13px;
      line-height: 24px;
    }
    dt,dd{
      span:nth-child(2){
        padding-right: 5px;
      }
    }
    .dl-table{
      height: calc(100% - 55px);
    }
    .trade-panel{
      dd{
        background-repeat: no-repeat;
        background-position: 100%;
      }
      .buy dd{
        background-image:linear-gradient(#263537, #263537)
      }
      .sell dd{
        background-image:linear-gradient(#3d2934, #3d2934)
      }
    }
    .rate{
      line-height: 40px;
      padding: 0 22px;
      border-top: 2px solid @gapColor;
      border-bottom: 2px solid @gapColor;
      .big{
        font-size: 20px;
        margin-right: 6px;
        display: inline-block;
        vertical-align: -2px;
      }
    }
    @media screen and (max-width: 1600px) {
      flex-direction: column;
      .view{
        flex: 1;
        height: 50%;
      }
      .trade-real{
        margin: 10px 0 0 0;
        height: calc(50% - 10px);
      }
    }
  }
  .intro{
    line-height: 1.8;
    .label{
      color: #999;
      margin-bottom: 4px;
    }
    .section{
      margin-bottom: 30px;
      p{
        display: flex;
        justify-content: space-between;
      }
      span:last-child{
        color: #000;
      }
      a{
        display: block;
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-decoration: underline;
        color: @blue;
        &:hover{
          color: @blue;
        }
      }
    }
  }
  > div {
    height: 100%;
  }
  .view{
    border-radius: 6px;
    background: #fff;
  }
  td{
    &:not(:first-child){
      text-align: right;
    }
    &:last-child{
      width: 40%;
    }
  }

}
tbody{
  color: #ccc;
}
.empty{
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 150px;
  i{
    font-size: 40px;
    margin-bottom: 10px;
  }
}
.order-list{
  margin-top: 10px;
  background: #fff;
  padding: 20px 30px;
  .tit{
    color: #fff;
    font-size: 15px;
    padding-bottom: 8px;
  }
  .tab-wrap{
    position: relative;
  }
  .link{
    text-align: center;
    padding: 40px 0 20px;
  }
}
.error{
  color: @red;
  position: absolute;
}
.dl-table{
  margin: 0 -22px;
  line-height: 30px;

  dt,dd{
    display: flex;
    padding: 0 22px;
    span{
      flex: 1;
      &:not(:first-child) {
        text-align: right;
      }
    }
  }
  dt{
    font-size: 12px;
    align-items: center;
    height: 30px;
    .es &{
      line-height: 1.2;
    }
  }
  dd{
    color: #000;
    cursor: pointer;
    white-space: nowrap;
    &.active, &:hover{
      background: #f0f0f0;
    }
  }
  .trade-real & dd{
    background: none !important;
    cursor: auto;
  }
}
.scroll-wrap{
  overflow-y: auto;
  height: 100%;
}
.el-icon-star-on{
  padding: 5px;
  margin-left: -5px;
}
.global-notice + .exchange{
  height: calc(100vh - 130px);
}
</style>

<style lang="less">
.exchange{
  .el-input__inner{
    background: #fff;
    font-size: 14px !important;
  }
}
.ex-mini-select{
  width: 80px !important;
  .el-input__inner{
    line-height: 30px !important;
    height: 30px !important;
  }
}
.order-list{
  .exchange-assets-wrap{
    margin: 0;
    .uls-title,
    .input-m,
    .chicang-w,
    .table-w,
    .el-pagination-wrap,
    .chicang-item:nth-child(1),
    .chicang-item:nth-child(3){
      display: none;
    }
    &.show{
      .chicang-w {
        display: flex;
      }
      .table-w{
        display: block;
      }
    }
    /deep/ .table-w{
      min-height: 150px;
      .empty{
        margin: 100px 0 50px;
      }
    }
    .c-content{
      margin: 0;
    }
    .load-list-wrap{
      min-height: auto;
    }
    .chicang-w{
      margin: 0;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      justify-content: flex-start;
    }
    .chicang-item{
      flex: initial !important;
      display: flex;
      line-height: 31px;
      margin-right: 50px;
      .label{
        margin-bottom: 0 !important;
        margin-right: 10px;
      }
    }
    .table-w{
      margin-left: -20px;
    }
  }
}
</style>
