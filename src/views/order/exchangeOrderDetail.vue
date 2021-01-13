<template>
  <div class="c-page">
    <div class="user-gap">
      <div class="back cblue" @click="$router.back()"><i class="el-icon-back"></i>{{$t('common.back')}}</div>
      <p class="tit">{{$t('exchangeOrder.text24')}}</p>
      <div class="web-list small-row">
        <table>
          <thead>
            <tr>
              <td>{{$t('exchangeOrder.text5')}}</td>
              <td>{{$t('exchangeOrder.text6')}}</td>
              <td>{{$t('exchangeOrder.text7')}}</td>
              <td>{{$t('exchangeOrder.text8')}}</td>
              <td>{{$t('exchangeOrder.text9')}}({{item.sellCurrency}})</td>
              <td>{{$t('exchangeOrder.text9_1')}}({{item.buyCurrency}})</td>
              <td>{{$t('exchangeOrder.text10')}}({{$baseCurrency}})</td>
              <td>{{$t('exchangeOrder.text11')}}</td>
              <td>{{$t('exchangeOrder.text12')}}</td>
              <td>{{$t('exchangeOrder.text13')}}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{item.id}}</td>
              <td>
                {{item.buyCurrency}}/{{item.sellCurrency}}
              </td>
              <td :class="item.etype === 1 ? 'cgreen2' : 'cred2'">{{item.priceType === 1 ? $t('exchangeOrder.text14') : $t('exchangeOrder.text15')}}{{item.etype === 1 ? $t('exchangeOrder.text16') : $t('exchangeOrder.text17')}}</td>
              <td>{{item.createAt | time}}</td>
              <td :class="item.etype === 1 ? 'cgreen2' : 'cred2'">{{item.price | f(item.coinCurrencyPair.pricePlaces)}}</td>
              <td>{{item.amount | f(item.coinCurrencyPair.numPlaces)}}</td>
              <td>{{item.cashAmount | f(item.coinCurrencyPair.pricePlaces)}}</td>
              <template v-if="item.priceType === 1">
                <td>{{item.tradeCashAmount | f(item.coinCurrencyPair.pricePlaces)}}{{baseCurrency}}</td>
                <td>
                  <span v-if="item.state === 2">{{$t('exchangeOrder.text18')}}</span>
                  <span v-else>
                    {{item.cashAmount - item.tradeCashAmount | f(item.coinCurrencyPair.pricePlaces)}}{{baseCurrency}}
                    <template v-if="item.state === 4 || item.state === 5">({{$t('exchangeOrder.text19')}})</template>
                  </span>
                </td>
              </template>
              <template v-else>
                <td>{{item.tradeAmount | f(item.coinCurrencyPair.numPlaces)}}{{item.buyCurrency}}</td>
                <td>
                  <span v-if="item.state === 2">{{$t('exchangeOrder.text18')}}</span>
                  <span v-else>
                    {{item.amount - item.tradeAmount | f(item.coinCurrencyPair.numPlaces)}}{{item.buyCurrency}}
                    <template v-if="item.state === 4 || item.state === 5">({{$t('exchangeOrder.text19')}})</template>
                  </span>
                </td>
              </template>
              <td class="cblue">
                <span class="pointer" v-if="item.state === 1" @click.stop="cancelOrder(item.id)">{{$t('exchangeOrder.text21')}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="tit" style="padding-top: 40px;">{{$t('exchangeOrder.text25')}}</p>
      <div class="web-list fixed small-row">
        <table>
          <thead>
            <tr>
              <td>{{$t('exchangeOrder.text26')}}</td>
              <td>{{$t('exchangeOrder.text27')}}({{item.buyCurrency}})</td>
              <td>{{$t('exchangeOrder.text28')}}({{item.sellCurrency}})</td>
              <td>
                <span v-if="item.priceType === 1">{{$t('exchangeOrder.text29')}}({{item.sellCurrency}})</span>
                <span v-else>{{$t('exchangeOrder.text30')}}({{item.buyCurrency}})</span>
              </td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, index) in list" :key="index">
              <td>{{it.createAt | time}}</td>
              <td>{{it.tradeAmount | f(item.coinCurrencyPair.numPlaces)}}</td>
              <td>{{(it.tradeAmount * it.tradePrice) | f(item.coinCurrencyPair.pricePlaces)}}</td>
              <td>
                <span v-if="item.priceType === 1">{{it.surplusNoTradeTotal | f(item.coinCurrencyPair.pricePlaces)}}</span>
                <span v-else>{{it.surplusNoTradeAmount | f(item.coinCurrencyPair.numPlaces)}}</span>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <pay-dialog :title="$t('exchangeOrder.text22')" :visible.sync="showPayDialog" @submit="payConfirm"></pay-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      id: this.$route.query.id,
      type: this.$route.query.type,
      item: this.$route.query.data ? JSON.parse(this.$route.query.data) : {
        coinCurrencyPair: {}
      },
      showPayDialog: false,
      list: []
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData () {
      this.$fetch.post('/coinentrustRecord/entrustDetail', {
        id: this.id,
        type: this.type,
        pageSize: 10000,
      }).then(res => {
        const item = res.mapData.entrustOrder
        if (item.etype === 2) {
          const _buy = item.buyCurrency
          item.buyCurrency = item.sellCurrency
          item.sellCurrency = _buy
        }
        this.item = item
        this.list = res.data.results
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
        this.$router.back()
      }).catch(err => {
        if (err.errorcode === 'need_code') {
          this.showPayDialog = true
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
.tit{
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>