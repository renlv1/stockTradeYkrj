<template>
  <div class="c-page" :class="{diff: tradeCurrency}">
    <div class="order user-gap">
      <div class="order-tit">{{$t('exchangeNew.text53')}}</div>
      <div class="web-filter" style="padding: 10px 0 30px">
        <div class="vCenter">
          <el-select v-model="currency" :placeholder="$t('exchangeNew.text42')" @change="filterVal" filterable>
            <el-option
              v-for="(item, index) in [{currency: $t('exchangeOrder.text2')}].concat(currencyList)"
              :key="index"
              :value="itemFn(item)">
              <div class="allCenter">
                <span>{{item.currency}}</span>
                <span v-if="item.shareName" style="font-size: 12px; color: gray;margin-left: 30px;">
                  <span v-if="$i18n.locale === 'EN'">{{item.shareNameEn}}</span>
                  <span v-else>{{item.shareName}}</span> ({{item.shareCode}})</span>
              </div>
            </el-option>
          </el-select>
          <div class="input">
            <el-input v-model="orderId" :placeholder="$t('exchangeNew.text54')"></el-input>
          </div>
          <div class="input">
            <el-select  v-model="statusIndex" >
              <el-option v-for="(item, index) in $t('exchangeNew.arr3')" :key="index" :value="index" :label="item"></el-option>
            </el-select>
          </div>
          <div class="input">
            <el-select  v-model="queryType" @change="statusIndex = 0">
              <el-option v-for="(item, index) in markerList" :key="index" :value="index" :label="item"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <load-more ref="loadMore" v-model="pageIndex" @change="getData" :list="list" :total="total">
        <div class="web-list small-row" >
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('exchangeNew.arr2')" :key="index">
                  {{item}}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index">
                <td>{{item.id}}</td>
                <td>
                  {{item.buyCurrency}}
                </td>
                <td class="name">
                  <span v-if="$i18n.locale === 'EN'">{{item.shareNameEn}}</span>
                  <span v-else>{{item.shareName}}</span> ({{item.shareCode}})</td>
                <td>
                  <i class="cgreen2" v-if="item.etype === 1">{{$t('exchangeOrder.text16')}}</i>
                  <i class="cred2" v-else>{{$t('exchangeOrder.text17')}}</i>
                </td>
                <td>
                  <span v-if="item.etype === 1">- -</span>
                  <span v-else>{{item.amount | f(item.numPlaces)}}</span>
                </td>
                <td>
                  <span v-if="item.etype === 1">{{amountFn(item.cashAmount, item)}}</span>
                  <span v-else>- -</span>
                </td>
                <td>{{item.tradeAmount | f(item.numPlaces)}}</td>
                <td>{{item.averagePrice | f(item.pricePlaces)}}</td>
                <td>{{amountFn(item.fee, item)}}</td>
                <td>{{item.createtime | time}}</td>
                <td>
                  <span v-html="state2text(item.state)"></span>
                </td>
                <td class="cblue">
                  <span class="pointer" @click="getDetail(item)">{{$t('exchangeOrder.text20')}}</span>
                  <span class="pointer" v-if="item.state === 1" @click.stop="cancelOrder(item.id)" style="margin-left: 16px;">{{$t('exchangeOrder.text21')}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </load-more>

      <el-dialog class="intro-dialog" :visible="showDetail"  @close="showDetail = false; detail = {}">
          <div v-if="detail.order"  @click.stop>
            <!--  买入明细  -->
            <template v-if="detail.order.etype === 1">
              <div class="intro">
                <div class="tit allCenter">
                  {{$t('exchangeNew.text55')}} {{detail.order.buyCurrency}}
                  <i class="pointer el-icon-close" @click="showDetail = false; detail = {}"></i>
                </div>
                <div class="section">
                  <p>
                    <i>{{$t('exchangeNew.text11')}}</i>
                    <span>{{detail.order.cashAmount | f(detail.order.pricePlaces)}}USDT</span>
                  </p>
                  <p>
                    <i>{{$t('exchangeNew.text13')}}</i>
                    <span>{{amountFn(detail.order.fee, detail.order)}}USDT</span>
                  </p>
                  <p>
                    <i>{{$t('exchangeNew.text56')}}</i>
                    <span v-html="state2text(detail.order.state)"></span>
                  </p>
                  <p>
                    <i>{{$t('google.text33')}}</i>
                    <span>{{detail.order.id}}</span>
                  </p>
                  <template v-if="detail.order.state !== 2">
                    <p>
                      <i>{{$t('exchangeNew.text57')}}</i>
                      <span>{{detail.order.tradeCashAmount | f(detail.order.pricePlaces)}} USDT</span>
                    </p>
                    <p v-if="detail.list.length">
                      <i>{{$t('exchangeNew.text58')}}</i>
                      <span>{{detail.list[0].surplusNoTradeTotal | f(detail.order.pricePlaces)}} USDT</span>
                    </p>
                  </template>
                </div>
              </div>
              <div class="step-wrap">
                <div class="tit">{{$t('exchangeNew.text59')}}</div>
                <div class="step">
                  <div class="item item-t" v-if="detail.order.state === 4 || detail.order.state === 5">
                    <h4 class="a-m">{{$t('exchangeNew.text60')}}</h4>
                    <p v-if="detail.list.length">{{$t('google.text47')}} <span class="cblue">{{Number(detail.list[0].surplusNoTradeTotal) | f(detail.order.pricePlaces)}}USDT</span>，{{$t('exchangeNew.text61')}}</p>
                    <p v-else>{{$t('google.text47')}} <span class="cblue">{{detail.order.cashAmount | f(detail.order.pricePlaces)}}USDT</span>，{{$t('exchangeNew.text61')}}</p>
                    <span class="cgray fz12"  v-if="detail.list.length">{{detail.list[0].updatetime | time}}</span>
                    <span class="cgray fz12"  v-else>{{detail.order.updatetime | time}}</span>
                  </div>
                  <div class="item" v-for="(item, index) in detail.list" :key="index">
                    <h4>
                      <span v-if="detail.order.state === 2 && index === 0">{{$t('exchangeNew.text62')}}</span>
                      <span v-else>{{$t('exchangeNew.text63')}}</span>
                    </h4>
                    <div class="c-t">
                      <div>{{$t('exchangeNew.text64')}} <span class="cblue">{{item.realAmount | f(detail.order.numPlaces)}}{{item.buyCurrency}}</span>，{{$t('exchangeNew.text65')}} {{item.tradePrice | f(detail.order.pricePlaces)}}</div>
                      <div>{{$t('exchangeNew.text66')}} {{amountFn(item.tradeTotalPrice, detail.order)}}USDT</div>
                      <div>{{$t('exchangeNew.text13')}} {{amountFn(item.tradeFeeBuy, detail.order)}}USDT</div>
                    </div>
                    <span class="cgray fz12">{{item.createtime | time}}</span>
                  </div>
                  <div class="item">
                    <h4  class="a-m-1">{{$t('exchangeNew.text67')}}</h4>
                    <p>{{$t('exchangeNew.text68')}} {{detail.order.cashAmount | f(detail.order.pricePlaces)}}USDT</p>
                    <span  class="cgray fz12">{{detail.order.createtime | time}}</span>
                  </div>
                </div>
              </div>
            </template>
            <!--  卖出明细   -->
            <template v-else>
              <div class="intro">
                <div class="tit allCenter">
                  {{$t('exchangeNew.text69')}} {{detail.order.sellCurrency}}
                  <i class="pointer el-icon-close" @click="showDetail = false"></i>
                </div>
                <div class="section">
                  <p>
                    <i>{{$t('exchangeNew.text17')}}</i>
                    <span>{{detail.order.amount | f(detail.order.numPlaces)}}{{detail.order.sellCurrency}}</span>
                  </p>
                  <p>
                    <i>{{$t('exchangeNew.text13')}}</i>
                    <span>{{amountFn(detail.order.fee, detail.order)}}USDT</span>
                  </p>
                  <p>
                    <i>{{$t('exchangeNew.text56')}}</i>
                    <span v-html="state2text(detail.order.state)"></span>
                  </p>
                  <p>
                    <i>{{$t('google.text33')}}</i>
                    <span>{{detail.order.id}}</span>
                  </p>
                  <!-- <template v-if="detail.order.state !== 2">
                    <p>
                      <i>已成交</i>
                      <span>{{detail.order.tradeAmount | f(detail.order.numPlaces)}}</span>
                    </p>
                    <p>
                      <i>未成交</i>
                      <span>{{safeCalc(detail.order.amount, detail.order.tradeAmount) | f(detail.order.numPlaces)}} </span>
                    </p>
                  </template> -->
                </div>
              </div>
              <div class="step-wrap">
                <div class="tit">{{$t('exchangeNew.text59')}}</div>
                <div class="step">
                  <!-- <div class="item" v-if="detail.order.state === 4 || detail.order.state === 5">
                    <h4>退款</h4>
                    <p>未成交<span class="cblue">{{detail.order.amount - detail.order.tradeAmount}}{{detail.order.sellCurrency}}</span>，将退还到您的资产中</p>
                  </div> -->
                  <div class="item" v-for="(item, index) in detail.list" :key="index">
                    <h4>
                      <!-- <span v-if="detail.order.state === 2 && index === detail.list.length -1">完全成交</span>
                      <span v-else>部分成交</span> -->
                      <span>{{$t('exchangeNew.text62')}}</span>
                    </h4>
                    <div class="c-t">
                      <div>{{$t('exchangeNew.text70')}} <span class="cblue">{{item.tradeAmount | f(detail.order.numPlaces)}}{{item.buyCurrency}}</span>，{{$t('exchangeNew.text65')}} {{item.tradePrice | f(detail.order.pricePlaces)}}</div>
                      <div>{{$t('exchangeNew.text13')}} {{ amountFn(item.tradeFeeSell, detail.order)}}{{item.sellCurrency}}</div>
                      <div>{{$t('exchangeNew.text71')}} {{amountFn(item.realTotalPrice, detail.order)}}USDT</div>
                    </div>
                    <span class="cgray fz12">{{item.createtime | time}}</span>
                  </div>
                  <div class="item">
                    <h4 class="a-m-1">{{$t('exchangeNew.text67')}}</h4>
                    <p>{{$t('exchangeNew.text72')}} {{detail.order.amount | f(detail.order.numPlaces)}}{{detail.order.sellCurrency}}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <loading v-else></loading>
      </el-dialog>
      <pay-dialog :title="$t('exchangeOrder.text22')" :visible.sync="showPayDialog" @submit="payConfirm"></pay-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    tradeCurrency: String,
    viewType: String
  },
  data() {
    let defaultValue = ''
    let d = new Date()
    defaultValue = `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`
    return {
      list: [],
      currency: '',
      statusIndex: 0,
      queryType: 0,
      total: -1,
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      baseCurrency: 'USDT',
      time: '',
      pickerMinDate: '',
      defaultValue,
      showPayDialog: false,
      activeId: '',
      detail: {},
      showDetail: false,
      orderId: '',
      pickerOptions: {
        // onPick: ({ maxDate, minDate }) => {
        //   this.pickerMinDate = minDate.getTime()
        //   if (maxDate) {
        //     this.pickerMinDate = ''
        //   }
        // },
        // disabledDate: (time) => {
        //   if (this.pickerMinDate !== '') {
        //     const day60 = (60 - 1) * 24 * 3600 * 1000
        //     const day30 = (30 - 1) * 24 * 3600 * 1000
        //     let maxTime = this.pickerMinDate + (this.showExportDialog ? day30 : day60)
        //     if (maxTime > new Date()) {
        //       maxTime = new Date()
        //     }
        //     return time.getTime() > maxTime
        //   }
        //   return time.getTime() > Date.now();
        // }
      },
    };
  },
  computed: {
    currencyList () {
      return this.$store.state.currencyList
    },
    markerList () {
      let arr = [...this.$t('exchangeNew.arr1')]
      if (this.$i18n.locale === 'CN') {
        arr[0] = '所有市场'
      }
      return arr
    },
    watchKey () {
      return {
        tradeCurrency: this.tradeCurrency,
        viewType: this.viewType,
        currency: this.currency,
        searchType: this.searchType,
        statusIndex: this.statusIndex,
        time: this.time,
        orderId: this.orderId
      }
    },
    searchType () {
      let priceType = '' // 1市价 2限价
      let etype = '' // 1买 2卖
      switch (this.queryType) {
        case 1:
          priceType = 1
          etype = 1
          break
        case 2:
          priceType = 1
          etype = 2
          break
        case 3:
          priceType = 2
          etype = 1
          break
        case 4:
          priceType = 2
          etype = 2
          break
      }
      return {
        priceType,
        etype
      }
    }
  },
  watch: {
    watchKey () {
      clearTimeout(this.watchTimer)
      this.watchTimer = setTimeout(() => {
        this.getData()
      }, 300)
    },
	  showDetail (newval) {
		  if (newval === false) {
			  document.body.style.overflow = ''
		  } else {
			  document.body.style.overflow = 'hidden'
		  }
	  }
  },
  methods: {
	  itemFn (item) {
	  	if (this.$i18n.locale === 'EN') return `${item.currency} ${item.shareCode}${item.shareNameEn}`
      return `${item.currency} ${item.shareCode}${item.shareName}`
    },
	  amountFn (money, item) {
	  	let num = Number(item.pricePlaces) * Number(item.numPlaces)
	  	if (num >= 8) {
        return this.$options.filters.f(money, 8)
      } else {
	  		return  this.$options.filters.f(money, num)
      }
    },
    safeCalc (n1, n2) {
      const BASE = 1000000000
      return ((n1 * BASE - n2 * BASE) / BASE)
    },
    async getData (pageNo = 1) {
      let params = {}
      // 交易所页面显示的订单列表
      if (this.tradeCurrency) {
        params = {
          pageSize: 10,
          status: '',
          currency: this.tradeCurrency
        }
      } else {
        // 没有币种对先请求接口
        if (!this.currencyList.length) {
          await this.$store.dispatch('getCurrencyList')
        }

        params = {
          pageNo,
          pageSize: this.pageSize,
          status: this.statusIndex || '',
          martType: this.queryType || '',
          currency: this.currency === this.$t('exchangeOrder.text2').split(' ')[0] ? '' : this.currency,
          trustid: this.orderId
          // startTime: this.time ? this.time[0] : '',
          // endTime: this.time ? this.time[1] : '',

        }
      }
      this.$fetch.post('/coinentrustRecord/getMyCoinTrustList', params).then(res => {
        let list = res.data || []
        list.forEach(item => {
          if (item.etype === 2) {
            const _buy = item.buyCurrency
            item.buyCurrency = item.sellCurrency
            item.sellCurrency = _buy
          }
        })
        this.list = list
        this.total = res.mapData.totalRecord
      })
    },
    cancelOrder (id) {
      this.activeId = id
      this.payConfirm('unlock', 'unlock')
    },
    payConfirm (tradePwd, code) {
      this.$fetch.post('/coinentrustRecord/cancelRecord', {
        id: this.activeId,
        tradePwd,
        code,
        loading: true
      }).then(res => {
        this.$message.success(this.$t('exchangeOrder.text23'))
        this.$store.dispatch('getBalance')
        this.showPayDialog = false
        this.getData(this.pageIndex)
        this.$emit('cancel')
      }).catch(err => {
        if (err.errorcode === 'need_code') {
          this.showPayDialog = true
        }
      })
    },
    state2text (state) {
	    const map = {
		    0: this.$t('depositStatus.text0'),
		    1: this.$t('orderSell.text17'),
		    2: this.$t('google.text48'),
		    3: this.$t('google.text49'),
		    4: this.$t('google.text49') + '，<span class="red">'+this.$t('orderSell.text18')+'</span>',
		    5: this.$t('orderSell.text19'),
		    7: this.$t('orderSell.text20'),
	    }
      return map[state]
    },
    getDetail (itemOrder) {
      this.showDetail = true
      this.$fetch.post('/coinentrustRecord/entrustDetail', {
        id: itemOrder.id,
        pageSize: 10000,
        type: itemOrder.etype
      }).then(res => {
        let order = res.mapData.entrustOrder
        let list = res.data.results
        // order.fee = itemOrder.fee
        order.pricePlaces = itemOrder.pricePlaces
        order.numPlaces = itemOrder.numPlaces
        this.detail = {
          order,
          list
        }
      })
    },
    filterVal (v) {
      this.currency = v.split(' ')[0]
    }
  }
};
</script>

<style lang="less" scoped>
.diff{
  .order-tit, .web-filter, /deep/ .el-pagination-wrap{
    display: none;
  }
  .user-gap{
    padding: 0;
  }
  @media screen and (min-width: 1400px) {
    table{
      table-layout: fixed;
    }
  }
  /deep/ .load-list-wrap{
    min-height: auto;
    .empty{
      padding-top: 30px;
      position: relative;
    }
  }
}
.order-tit{
  font-size: 22px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}
.intro{
  background: #fff;
  padding: 20px;
  p{
    display: flex;
    line-height: 1.6;
    margin-bottom: 6px;
    &:last-child{
      margin-bottom: 0;
    }
    i{
      color: gray;
      min-width: 80px;
    }
  }
}
.small-row{
  tbody{
    .pointer{
      cursor: pointer;
    }
  }
}
.c-t{
  div{
    margin: 5px 0;
  }
}
.step-wrap{
  padding: 20px;
  max-height: 500px;
  overflow: auto;
  h4{
    font-size: 15px;
    font-weight: bold;
    position: relative;

  }
  .item{
    position: relative;
    padding-left: 20px;
    padding-bottom: 30px;
    &.item-t{
      padding-bottom: 50px;
    }
    &::before,&::after{
      content: '';
      position: absolute;
      background: #ccc;
    }
    &:before{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      left: 0px;
      top: 6px;
    }
    &:not(:last-child):after{
      left: 3px;
      bottom: -10px;
      width: 2px;
      top: 14px;
    }
    &:nth-child(1)::before{
      background-color: #238bff;
    }
    p{
      padding: 6px 0 4px;
    }
  }
}
</style>
<style lang="less">
.intro-dialog{
  .tit{
    font-size: 15px;
    margin-bottom: 14px;
  }
  .el-dialog{
    width: 400px;
    border-radius: 4px;
    overflow: hidden;
    min-height: 400px;
    background: #f7f7f7;
    /deep/ .el-dialog__body{
      max-height: 90vh;
      overflow: auto;
    }
  }
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    padding: 0;
    color: #000;
  }
}
</style>
