<template>
  <div class="total-money-w">
    <ul class="uls-title">
      <li class="list-title" v-for="(item, index) in menuArr" :key="index"
          @click="clickOne(index)"
          :class="{'active-list': activeIndex === index}">{{item}}</li>
    </ul>
    <div class="c-content">
      <!--    资产-->
      <div v-show="activeIndex === 0">
        <div class="chicang-w">
          <div class="chicang-item nowrap">
            <div class="label">USDT{{$t('google.text9')}}</div>
            <div class="bold-usd">{{$store.state.usdBalance.balance | f(8)}} USDT
              <span class="b-a" @click="rechargeUsd">{{$t('orderSell.text12')}}</span>
              <span class="b-a" @click="depositUsd">{{$t('orderSell.text13')}}</span>
            </div>
          </div>
          <div class="chicang-item">
            <div class="label">{{$t('orderSell.text24')}}</div>
            <div><span class="bold-usd nowrap">{{assetsAmount.reckonAmountSum | f}} USDT</span> ≈ <span class="nowrap">{{cnyReckonAmountSum  | f}} CNY</span></div>
          </div>
          <div class="chicang-item">
            <div class="label win-w"><span>{{$t('userA.text1')}}</span> <div class="help el-icon-question" @click="helpFn"></div> </div>
            <div >
              <span class="bold-usd-a nowrap"  :class="rateCls(assetsAmount.profitLossSum)">{{rateH(assetsAmount.profitLossSum)}}{{assetsAmount.profitLossSum | f}}</span>
              <span class="nowrap"  :class="rateCls(assetsAmount.profitLossRateSum)">{{rateFn(assetsAmount.profitLossRateSum)}} </span></div>
          </div>
          <!--        <div class="chicang-item chicang-item2">-->
          <!--          <div class="label">{{$t('orderSell.text26')}}</div>-->
          <!--          <div  class="blue">{{assetsAmount.profitLossSum | f}}</div>-->
          <!--        </div>-->
          <!--        <div class="chicang-item chicang-item2">-->
          <!--          <div class="label">{{$t('orderSell.text27')}}</div>-->
          <!--          <div  :class="rateCls(assetsAmount.profitLossRateSum)">{{rateFn(assetsAmount.profitLossRateSum)}}</div>-->
          <!--        </div>-->
        </div>
        <div class="input-m">
          <!--        <div class="input-wrap dropdown-wrap">-->
          <!--          <el-select  v-model="currency" @change="currencyFn" placeholder="所有币种">-->
          <!--            <el-option v-for="(item,index) in  currencyData"  :key="index" :value="item.currency" :label="item.currency"></el-option>-->
          <!--          </el-select>-->
          <!--        </div>-->
          <div class="input-wrap">
            <el-select v-model="currency" :placeholder="$t('orderSell.text28')" @change="filterVal" filterable>
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
          </div>


          <div class="input-wrap dropdown-wrap select-a">
            <el-select  v-model="marketText" @change="marketFn"  :placeholder="$t('orderSell.text29')">
              <el-option v-for="(item,index) in  marketTypeArr"  :key="index" :value="item.text" :label="item.text"></el-option>
            </el-select>
          </div>
          <div class="input-item">
            <el-checkbox v-model="holdNum" border  :label="$t('orderSell.text30')" @change="changeHoldNum"></el-checkbox>
          </div>
        </div>
        <div class="table-w">
          <load-more ref="loadMore" v-model="pageNo" @change="getMoney" :list="newCurrencyList" :total="total" :pageSize="20">
            <table>
              <thead>
              <tr>
                <!--币种--><td class=" cursor" @click="orderbyTypeFn(1)">{{$t('exchange.text4')}}
                <span class="caret-wrapper">
                    <i class="sort-caret descending" :class="{'blue-a': orderbyType === 1}"></i>
                    <i class="sort-caret ascending" :class="{'blue-a': orderbyType === 2}"></i>
                  </span>
              </td>
                <!--	股票名称（代码）--><td >{{$t('orderSell.text31')}}</td>
                <!--	持仓数量--><td>{{$t('moneyText.text18')}}</td>
                <!--	现价（USDT）--><td>{{$t('orderSell.text33')}}（USDT）</td>
                <!--	持仓成本（USDT）--><td>{{$t('orderSell.text34')}}（USDT）</td>
                <!--	市值（USDT）--><td>{{$t('orderSell.text36')}}（USDT）</td>
                <!--		浮动盈亏--><td class="cursor" @click="orderbyTypeFn(3)">{{$t('orderSell.text37')}}
                <span class="caret-wrapper">
                    <i class="sort-caret descending" :class="{'blue-a': orderbyType === 3}"></i>
                    <i class="sort-caret ascending" :class="{'blue-a': orderbyType === 4}"></i>
                  </span>
              </td>
                <!--	盈亏率--><td>{{$t('orderSell.text38')}}</td>
                <!--	市场--><td class="currency-li">{{$t('orderSell.text32')}}</td>
                <!--	操作--><td class="last-li">{{$t('otcTrade.text15')}}</td>
              </tr>
              </thead>
              <tbody>
              <tr class="" v-for="(item, index) in newCurrencyList" :key="index" v-show="item.currency">
                <!--币种--><td class="currency-li">{{item.currency}}</td>
                <!--	股票名称（代码）-->
                <td class="name-td">
                <span v-if="item.share">
                  <span v-if="$i18n.locale === 'EN'">{{item.share.shareNameEn}}</span>
                  <span v-else>{{item.share.shareName}}</span>
                  ({{item.share.shareCode}})</span>
                <span v-else>-</span>
              </td>
                <!--	余额--><td>
                <span v-if="item.balance">{{item.balance  | f(8)}}</span>
                <span v-else>-</span>
              </td>
                <!--	现价（USDT）--><td>{{currentPriceFn(item.currentPrice, item.share.pricePlaces)}}</td>
                <!--	持仓成本（USDT）--><td>{{isEmpty(item.costOfCarry) | f(item.share.pricePlaces)}}</td>
                <!--	市值（USDT）--><td>{{currentPriceFn(item.marketValue, 8 )}}</td>
                <!--		浮动盈亏--><td>{{currentPriceFn(item.profitLoss, 8)}}</td>
                <!--	盈亏率--><td :class="rateCls(item.profitLossRate)">{{rateFn(item.profitLossRate)}}</td>
                <!--	市场--><td class="currency-li" >
                <span v-if="item.share">{{typeFn(item.share.type)}}</span>
                <span v-else>-</span>
              </td>
                <!--	操作--><td class="ctrl last-li">
                <template v-if="$route.path.includes('money')">
                  <span @click="franceFn(item)">{{$t('orderSell.text48')}}</span>
                  <span @click="rechargeFn(item)">{{$t('moneyText.text8')}}</span>
                  <span @click="depositFn(item)">{{$t('moneyText.text9')}}</span>
                </template>
                <span v-else @click="$emit('changeCurrency', item.currency)">{{$t('google.text37')}}</span>
              </td>
              </tr>
              </tbody>
            </table>
          </load-more>
        </div>
      </div>
      <!--    充提记录-->
      <div v-show="activeIndex === 1" class="record-w">
        <div class="flex-top">
          <div class="dropdown-wrap select-a">
            <el-select  v-model="recordTypeId" @change="recordFn2" :placeholder="$t('moneyText.text35')">
              <el-option v-for="(item, index) in drawTypeArr"  :key="index" :value="item.type" :label="item.text"></el-option>
            </el-select>
          </div>
          <div class="dropdown-wrap select-a">
            <el-select  v-model="currencyText" @change="moneyFn" :placeholder="$t('moneyText.text36')">
              <el-option v-for="(item, index) in [{currency: $t('exchangeOrder.text2')}, {currency: 'USDT'}].concat(currencyList)"  :key="index" :value="item.currency" :label="item.currency"></el-option>
            </el-select>
          </div>
          <div class="input-wrap data-wrap">
            <el-date-picker
                    @change="changePicker2"
                    v-model="datePicker2"
                    :picker-options="pickerOptionsA"
                    type="daterange"
                    range-separator="-"
                    format="yyyy/MM/dd"
                    :start-placeholder="$t('moneyText.text26')"
                    :end-placeholder="$t('moneyText.text27')">
            </el-date-picker>
          </div>
        </div>


        <div class="table-w">
          <load-more ref="loadMore2" v-model="pageNo2" @change="getRecord" :list="recordList" :total="total2" :pageSize="20">
            <table>
              <thead>
              <tr>
                <td>{{$t('google.text33')}}</td>
                <td>{{$t('moneyText.text29')}}</td>
                <td>{{$t('exchange.text12')}}</td>
                <td>{{$t('exchangeNew.text43')}}</td>
                <td>{{$t('exchangeNew.text56')}}</td>
                <td>{{$t('exchange.text37')}}</td>
                <td>{{$t('otcTrade.text15')}}</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in recordList" :key="index" class="tr-list"  @click="addressFn(item)">
                <td>{{item.id}}</td>
                <td>{{recordTypeFn(item.recordType)}}</td>
                <td><span v-show="item.incomeType === 2">-</span> {{feeFn(item.amount)}} {{item.currency}}</td>
                <td>{{item.currency}}</td>

                <td>{{depositDrawFn(item)}}</td>
                <td>{{item.createtime | time}}</td>
                <td class="ctrl">{{$t('google.text37')}}</td>
              </tr>
              </tbody>
            </table>
          </load-more>
        </div>
      </div>
      <!--统计-->
      <div v-show="activeIndex === 2">
        <div class="b-m">{{$t('orderSell.text39')}}</div>
        <div class="input-m-w">
          <div class="input-wrap dropdown-wrap select-a">
            <el-select  v-model="currency2" @change="currencyFn2" :placeholder="$t('moneyText.text36')">
              <el-option v-for="(item,index) in  currencyArr"  :key="index" :value="item.currency" :label="item.currency"></el-option>
            </el-select>
          </div>
          <div class="input-wrap dropdown-wrap">
            <el-select  v-model="dataType" @change="dataTypeFn" :placeholder="$t('orderSell.text40')">
              <el-option v-for="(item,index) in  dataTypeArr"  :key="index" :value="item.text" :label="item.text"></el-option>
            </el-select>
          </div>
          <div class="input-wrap data-wrap" v-show="dataTypeId === 4">
            <el-date-picker
                    @change="changePicker"
                    v-model="datePicker"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="-"
                    format="yyyy/MM/dd"
                    :start-placeholder="$t('moneyText.text26')"
                    :end-placeholder="$t('moneyText.text27')">
            </el-date-picker>
          </div>
          <div class="money-a">
            <span class="usdt"  :class="rateCls(profitLoss.profitLossSum)">{{profitLoss.profitLossSum | f}} USDT</span>
            <span> ≈ {{lossSumCny | f}} CNY</span>
          </div>
          <div class="percent" :class="rateCls(profitLoss.profitLossRateSum)" v-show="profitLoss.profitLossRateSum">{{rateFn(profitLoss.profitLossRateSum)}} </div>
        </div>
        <v-chart v-show="!emptyDate && xLine.length" style="width: 100%; padding-left: 22px;" :autoresize="true" :options="deepData"></v-chart>
        <div v-show="emptyDate" class="empty-w-a">
          <i class="el-icon-document"></i>
          <p class="no-da-1">{{$t('common.empty')}}</p>
          <p class="no-da-2">
            {{$t('userA.text23')}}<span @click="activeIndex = 0" class="buy">  {{$t('userA.text24')}} </span> {{$t('userA.text25')}}<span class="buy"  @click="toBuy">  {{$t('userA.text26')}} </span>
          </p>
        </div>
      </div>
    </div>
<!--充值、提现-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap" :class="{'deposit-w': !isTopDeposit}" @click="addressSHow = false; emptySHow = false">
          <div class="top-a">
            <div class="g-dialog-title">{{title}}</div>
            <i class="g-dialog-close" @click="visible = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <!--          充值-->
          <div v-show="!isTopDeposit">
            <div class="input-item" v-show="currencyNetArr.length > 0">
              <div class="label">{{$t('certification.text30')}}</div>
              <ul class="ul-str">
                <li class="list-str" @click="checkOne(index, item, curtCurrency)"
                    :class="{'active-a': curtIndex === index}"
                    v-for="(item, index) in currencyNetArr" :key="index" >{{item}}</li>
              </ul>
            </div>
            <div class="input-item">
              <div class="address-flex">
                <div class="label label-a">{{$t('moneyText.text10')}}</div>
                <div class="copy" v-clipboard:copy="accountObj.coinAddress" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</div>
              </div>
              <div class="address-a">{{accountObj.coinAddress}}</div>
            </div>
            <div class="qrcode-w">
              <div class="label">{{$t('moneyText.text10')}}</div>
              <div class="qrcode-a" id="qrcode" title=""></div>
              <p class="tips">{{$t('orderSell.text41')}}<span class="a-l">{{accountObj.minDepositAmount}} {{curtCurrency}}</span>，{{$t('orderSell.text42')}} <span @click="gotoDetails" class="a-l">{{$t('userA.text5')}}</span> {{$t('orderSell.text44')}}</p>
            </div>
          </div>
          <!--          提现-->
          <div v-show="isTopDeposit">
            <div class="input-item" v-show="currencyNetArr.length > 0">
              <div class="label">{{$t('certification.text30')}}</div>
              <ul class="ul-str">
                <li class="list-str" @click="checkOne(index, item, 2)"
                    :class="{'active-a': curtIndex === index}"
                    v-for="(item, index) in currencyNetArr" :key="index">{{item}}</li>
              </ul>
            </div>

            <div class="input-item down-input">
              <div class="label">{{$t('moneyText.text13')}}</div>
              <div class="opt-w">
                <div class="a-m" >
                  <input type="text" :placeholder="$t('orderSell.text45')" v-model="addressF" >
                  <div class="open-a" @click.stop="showAddress">{{$t('orderSell.text49')}}</div>
                </div>
                <div @click.stop>
                  <div class="address-w" v-show="addressSHow">
                    <div class="d-m">
                      <span>{{$t('moneyText.text13')}}</span>
                      <span class="blue" @click="$router.push('/user/depositAddress')">{{$t('orderSell.text50')}}</span>
                    </div>
                    <ul class="address-uls" v-show="!emptySHow">
                      <li class="address-list" v-for="(item, index) in drawCoinList" :key="index" @click.stop="clickOneFn(item)">
                        <div class="h-title">{{item.accountRemark}}</div>
                        <div class="address">{{item.coinAddress}}</div>
                      </li>
                    </ul>
                  </div>
                  <div class="no-data-w"  v-show="emptySHow">
                    <div class="no-img">
                      <img src="@img/menu/nodata.svg" alt="">
                    </div>
                    <div class="no-text">{{$t('orderSell.text46')}}，<router-link to="/user/depositAddress" class="blue">{{$t('orderSell.text47')}}</router-link></div>
                  </div>
                </div>

              </div>

            </div>

            <div class="input-item" v-show="tipFlag">
              <div class="label">{{$t('moneyText.text14')}}</div>
              <div class="input-a">
                <div class="input-c"><input type="text" :placeholder="$t('moneyText.text15')" v-model="coinTip"></div>
              </div>
            </div>
            <div class="input-item">
              <div class="label">{{$t('exchange.text13')}}</div>
              <div class="input-a">
                <div class="input-c"><input type="text" :placeholder="$t('moneyText.text16') + amountBalance" @input="checkInput('drawAmount')"
                                            v-model="drawAmount"></div>
                <div class="copy-t">{{currencyItem.currency}}</div>
              </div>
            </div>
            <div class="red-t" v-show="redT">{{redT}}</div>
            <div class="flex-between">
              <span class="label label-a">{{$t('moneyText.text20')}}</span>
              <span>{{drawFee}} {{currencyItem.currency}}</span>
            </div>
            <div class="flex-between">
              <span class="label label-a">{{$t('userCenter.text1')}}</span>
              <span class="blue">{{amount}} {{currencyItem.currency}}</span>
            </div>
            <div class="g-dialog-btn-wrap">
              <button class="g-dialog-btn g-dialog-ok" @click="okCallbackDraw">{{$t('moneyText.text22')}}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--    充提记录-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible2">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap rd-w">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('google.text38')}}</div>
            <i class="g-dialog-close" @click="visible2 = false; tradeObj = {}">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="a-item">
            <div class="label label-a">{{recordTypeFn(tradeObj.recordType)}}</div>
            <div class="input-c-l">{{tradeObj.amount}} {{tradeObj.currency}}</div>
          </div>
          <div style="border-bottom: 1px solid #e6e6e6; margin-bottom: 10px;">
            <div class="flex-between">
              <div class="label-y" v-show="tradeObj.recordType === 1 || tradeObj.recordType === 2">{{$t('moneyText.text10')}}</div>
              <div class="label-y" v-show="tradeObj.recordType === 3 || tradeObj.recordType === 4">{{$t('moneyText.text13')}}</div>
              <div class="copy" v-clipboard:copy="tradeObj.userReceiveAccount" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</div>
            </div>
            <div class="text-n">{{tradeObj.userReceiveAccount}}</div>
            <div class="" v-show="tradeObj.recordType === 3 || tradeObj.recordType === 4">
              <div class="label-y">{{$t('moneyText.text19')}}</div>
              <div class="" style="padding: 10px 0;">{{tradeObj.drawFee}} USDT</div>
            </div>
          </div>
          <div class="flex-between">
            <div class="label-y">{{$t('certification.text30')}}</div>
            <div class="">{{tradeObj.currencyNet}}</div>
          </div>

          <div class="flex-between">
            <div class="label-y">{{$t('exchange.text37')}}</div>
            <div>{{tradeObj.createtime | time}}</div>
          </div>
          <div class="flex-between">
            <div class="label-y">{{$t('google.text34')}}</div>
            <div >{{depositDrawFn(tradeObj)}}</div>
          </div>
          <div class="flex-between">
            <div class="label-y">{{$t('google.text33')}}</div>
            <div >{{tradeObj.id}}</div>
          </div>
          <div class="flex-between long-flex" v-show="tradeObj.recordType === 1 || tradeObj.recordType === 3">
            <div class="label-y">{{$t('userA.text15')}}</div>
            <div class="text-r">{{isEmpty(tradeObj.hash)}}</div>
          </div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok"  @click="visible2 = false; tradeObj = {}">{{$t('moneyText.text12')}}</button>
          </div>
        </div>
      </div>
    </transition>
    <pay-dialog ref="payDialog" @submit="payConfirm" :visible.sync="isShow" />
  </div>
</template>

<script type="text/ecmascript-6">
import QRCode from 'qrcodejs2'  // 引入qrcode
import Dialog from '@/components/dialog'
import ECharts from 'vue-echarts'
/*eslint-disable*/
export default {
  data() {
    return {
	    tTime: '',
    	activeCurrency: '',
	    datePicker2: '',
	    pickerOptionsA: {
		    onPick: ({ maxDate, minDate }) => {
		    },
		    disabledDate: (time) => {
			    return time.getTime() > Date.now()
		    }
	    },
	    startTime2: '',
	    endTime2: '',
	    recordTypeId: '',
	    drawTypeArr: [ // 1充币 2快速充币 3普通提币 4快速提币
		    {text: this.$t('moneyText.text35'), type: ''},
		    {text: this.$t('userA.text16'), type: 1},
		    {text: this.$t('moneyText.text38') , type: 2},
		    {text: this.$t('moneyText.text39'), type: 3},
		    {text:  this.$t('moneyText.text40'), type: 4},
	    ],
	    emptyDate: false,
	    numPlacesR: '',
	    visible2: false,
	    tradeObj: '',
	    currencyText: '',
	    currentRecord: 0,
	    pageNo2: 1,
	    total2: 0,
	    recordList: [{}],
	    recordArr: [this.$t('userA.text3'), this.$t('userA.text4')],
    	curtCurrency: '',
	    allCurrency: [],
	    total: 0,
	    holdNum: false,
	    orderbyType: '',
	    addressF: '',
	    redT: '',
	    minAmount: '',
	    maxAmount: '',
      startTime: '',
      endTime: '',
	    lossSumCny: '',
	    profitLoss: '',
	    dataType: this.$t('orderSell.text40'),
	    dataTypeId: 1,
	    drawCoinList: [],
    	checkItem: '',
	    amountBalance: '',
	    cnyReckonAmountSum: '',
	    cnyCostOfCarrySum: '',
	    cnyRate: '',
	    currencyData: [],
	    pageNo: 1,
	    shareCode: '',
	    marketType: '',
	    marketText: '',
	    assetsAmount: '',
	    marketTypeArr: [// marketType	int	1:沪深 2：港股 3：美股
		    {id: 0, text: this.$t('moneyText.text41')},
		    {id: 1, text: this.$t('userCenter.text2')},
		    {id: 2, text: this.$t('userCenter.text3')},
		    {id: 3, text: this.$t('userCenter.text4')},
      ],
	    dataTypeArr: [ // 1:最近7天 2：最近30天 3:最近90天 4:自定义
		    {id: 1, text: this.$t('orderSell.text40')},
		    {id: 2, text: this.$t('userCenter.text5')},
		    {id: 3, text: this.$t('userCenter.text6')},
		    {id: 4, text: this.$t('userCenter.text7')},
      ],
	    deepData: {},
	    datePicker: '',
	    addressSHow: false,
	    emptySHow: false,
	    curtIndex: 0,
	    activeIndex: 0,
	    menuArr: [this.$t('userCenter.text8'),this.$t('userA.text5') , this.$t('userCenter.text9')],
      isShow: false,
      tipFlag: false,
      currencyB: '',
      drawFee: 0,
      blockFee: 0,
      amount: 0,
      drawCoinAccountId: '',
      balance: '',
      coinTip: '',
      addressArr: [],
      currencyNetArr: [],
	    currencyNet2: '',
      currencyNetA: '',
      currencyItem: '',
      drawAmount: '',
      coinAddress: '',
      currencyArr: [],
	    currency: '',
	    currency2: '',
      isTopDeposit: false,
      okText: this.$t('moneyText.text22'),
      btnCancel: false,
      visible: false,
      title: '',
      accountObj: {},
      newCurrencyList: [{share: ''}],
      showOrHide: true,
      sumMoney: '',
      flagA: 0,
	    xLine: [],
	    yLine1: [],
	    yLine2: [],
	    pickerOptions: {
		    onPick: ({ maxDate, minDate }) => {
			    this.startTime = minDate.getTime()
			    if (maxDate) {
				    this.startTime = ''
			    }
		    },

		    disabledDate: (time) => {
			    if (this.startTime !== '') {
				    const day30 = 90 * 24 * 3600 * 1000
				    let maxTime = this.startTime + day30

				    let minTime = this.startTime - day30
				    return time.getTime() > maxTime || time.getTime() < minTime
			    }

			    // return time.getTime() > Date.now()
		    }
	    }
    }
  },
  created() {
    // this.getMoney()
  },
  props: {
	  holdNumA: Number
  },
	computed: {
		currencyList () {
      if (!this.$store.state.currencyList.length) {
      	let arr = []
      	this.allCurrency.forEach((item) => {
      		let a = item
          if (item.share && item.share.shareCode) {
	          a.shareCode = item.share.shareCode
          }
		      if (item.share && item.share.shareName) {
			      a.shareName = item.share.shareName
		      }
		      arr.push(a)
        })
        return arr
      }
			return this.$store.state.currencyList
		},
  },
  beforeDestroy () {
	  this.tTime = ''
	  clearInterval(this.timer)
  },
	mounted () {
  	if (this.activeIndex === 0) {
  		this.timer = setInterval(() => {
			  this.tTime = 1
  			this.getMoney()
      }, 10000)
    } else {
		  this.tTime = ''
		  clearInterval(this.timer)
    }
		// this.$watch('shareCode', this.$debounce((newQuery) => {
		// 	// newQuery为输入的值
		// 	this.pageNo = 1
		// 	this.getMoney()
		// }, 1500))
	},
  methods: {
	  itemFn (item) {
		  if (this.$i18n.locale === 'EN') return `${item.currency} ${item.shareCode}${item.shareNameEn}`
		  return `${item.currency} ${item.shareCode}${item.shareName}`
	  },
	  gotoDetails () {
	  	this.visible = false
		  this.activeIndex = 1
      this.pageIndex = 1
      this.getRecord()
    },
	  changePicker2 () {
		  this.startTime2 = ''
		  this.endTime2 = ''
		  if (this.datePicker2 && this.datePicker2[0]) {
			  this.startTime2 = this.timeFn(+new Date(this.datePicker2[0]), '-', 3)
		  }
		  if (this.datePicker2 && this.datePicker2[1]) {
			  this.endTime2 = this.timeFn(+new Date(this.datePicker2[1]), '-', 4)
		  }
		  this.pageIndex = 1
		  this.getRecord()
    },
	  recordTypeFn (type) {
		  //类型 1普通充币 2快速充币 3普通提币 4快速提币
		  if (type === 1) return this.$t('userA.text16')
		  if (type === 2) return this.$t('moneyText.text38')
		  if (type === 3) return this.$t('moneyText.text39')
		  if (type === 4) return this.$t('moneyText.text40')
    },
	  depositDrawFn (item) {
		  // "depositStatus":"1",//充值订单状态 0 ：待确认  1：确认成功  2：确认失败 3系统检查中 4非系统接收币种 5找不到用户 6确认成功待审核 7审核不通过
      if (item.recordType === 1 || item.recordType === 2) {
	      if (item.depositStatus === 0) return this.$t('depositStatus.text0')
	      if (item.depositStatus === 1) return this.$t('depositStatus.text1')
	      if (item.depositStatus === 2) return this.$t('depositStatus.text2')
	      if (item.depositStatus === 3) return this.$t('depositStatus.text3')
	      if (item.depositStatus === 4) return this.$t('depositStatus.text4')
	      if (item.depositStatus === 5) return this.$t('depositStatus.text5')
	      if (item.depositStatus === 6) return this.$t('depositStatus.text6')
	      if (item.depositStatus === 7) return this.$t('depositStatus.text7')
      } else if (item.recordType === 3 || item.recordType === 4) {
	      //   "drawStatus":"1",//提现订单状态 0待支付 1待转账处理 2处理中 3待确认 4：确认成功  5：确认失败 6系统检查中 7打款失败 8提现待审核 9不打款
	      if (item.drawStatus === 0) return this.$t('drawStatus.text0')
	      if (item.drawStatus === 1) return this.$t('drawStatus.text1')
	      if (item.drawStatus === 2) return this.$t('drawStatus.text2')
	      if (item.drawStatus === 3) return this.$t('drawStatus.text3')
	      if (item.drawStatus === 4) return this.$t('drawStatus.text4')
	      if (item.drawStatus === 5) return this.$t('drawStatus.text5')
	      if (item.drawStatus === 6) return this.$t('drawStatus.text6')
	      if (item.drawStatus === 7) return this.$t('drawStatus.text7')
	      if (item.drawStatus === 8) return this.$t('drawStatus.text8')
	      if (item.drawStatus === 9) return this.$t('drawStatus.text9')
      }
    },
	  feeFn (num) {
	  	let n = 8
		  let value = parseFloat(num)
		  let str = ''
		  if (value) {
			  const index = String(value).indexOf('.')
			  if (index > 0) {
				  const arr = String(value).split('.')
				  if (arr[1].length >= n) {
					  str = `${arr[0]}.${arr[1].slice(0, n)}`
				  } else {
					  str = value
				  }
			  } else {
				  str = value
			  }
			  return str
		  } else {
			  return 0
		  }
    },
	  toBuy () {
	  	if (this.currency2) {
	  		this.$router.push({
          path: '/exchange',
          query: {
	          currency: this.currency2}
	  		})
      } else {
			  this.$router.push('/quote')
      }
    },
  	// 盈亏弹窗
	  helpFn () {
	  	Dialog({
			  title: this.$t('userA.text6'),
        msg: '<div class="text-left">'+ this.$t('userA.text7') +'<br/>'+this.$t('userA.text8')+'</div>',
        okText: this.$t('userA.text9')
      })
    },
  	addressFn (item) {
		  this.visible2 = true
		  this.$store.commit('SET_LOADING', true)
		  this.$fetch.post('/coinorder/queryCoinOrderDetail', {
			  orderId: item.id
		  }).then(res => {
			  // this.numPlacesR = item.numPlaces
			  if (res.success) {
				  this.$store.commit('SET_LOADING', false)
				  this.tradeObj = res.data.tokenCoinOrder
			  }
		  })
    },
	  //1：买入订单 2：卖出订单  3：充币 4：提币 5：退款
	  paymentTypeFn (type) {
		  if (type === 3) return this.$t('orderSell.text12')
		  if (type === 4) return this.$t('orderSell.text13')
	  },
	  // -1:删除 0:创建订单 1:处理中 2:处理成功 3:处理失败 4:撤单 5:无效 6:待确认
	  statusFn (status) {
		  if (status === -1) return this.$t('setting.text26')
		  if (status === 0) return this.$t('orderSell.text4')
		  if (status === 1) return this.$t('drawStatus.text2')
		  if (status === 2) return this.$t('orderSell.text21')
		  if (status === 3) return this.$t('orderSell.text22')
		  if (status === 4) return this.$t('orderSell.text19')
		  if (status === 5) return this.$t('orderSell.text23')
		  if (status === 6) return this.$t('depositStatus.text0')
	  },
	  // 收支class
	  incomeCls (type) {
		  if (type === 1) return 'green'
		  if (type === 2) return 'red'
	  },
	  //   1：收入 2：支出
	  incomeTypeFn (type) {
		  if (type === 1) return this.$t('orderSell.text15')
		  if (type === 2) return this.$t('orderSell.text16')
	  },
	  recordFn (index) {
	  	this.currentRecord = index
		  this.pageIndex = 1
      this.getRecord()
    },
	  getRecord () {
	  	//
      if (this.activeIndex === 1) {
	      this.$store.commit('SET_LOADING', true)
	      this.$fetch.post3('/coinorder/queryCoinOrderList', {
		      recordType: this.recordTypeId, //	int	类型 1充币 2快速充币 3普通提币 4快速提币
		      currency: this.currencyText, //	string	币种
		      startDate: this.startTime2, //	string	开始时间
		      endDate: this.endTime2, //	string	结束时间
		      pageIndex:  this.pageIndex, //	int	页码
		      pageSize: 20, //	int	每页显示数
	      }).then(res => {
		      if (res.success) {
			      this.$store.commit('SET_LOADING', false)
			      this.recordList = res.data.tokenCoinOrderList
			      this.total2 = res.mapData.totalCount
		      }
	      }).catch(err => {})
      }
    },
	  recordFn2 (v) {
      this.recordTypeId = v
		  this.pageIndex = 1
		  this.getRecord()
    },
	  moneyFn (v) {
		  if (v === this.$t('exchangeOrder.text2')) {
			  this.currencyText = ''
		  } else {
			  this.currencyText = v
		  }
      this.pageIndex = 1
      this.getRecord()
    },
  	// 充币 查询链名称
  	getA (currency) {
		  this.$fetch.post('/tokencoincreate/queryCurrencyNet', {
			  currency: currency, //	string	币种
		  }).then(res => {
			  if (res.status === 'success') {
			  	this.currencyNetArr = res.data
				  // this.addressArr = res.data.drawCoinAccountInfoList
			  }
		  }).catch(err => {
			  if (err.status === 'success') {
			  	let currencyNet = ''
				  if (err.data && err.data.length > 0) {
					  this.currencyNetArr = err.data
					  currencyNet = err.data[0]
				  } else {
					  this.currencyNetArr = []
					  currencyNet = ''
          }
				  this.createAddress(currency, currencyNet)
			  }
		  })
    },
	  createAddress (currency, currencyNet) {
		  this.$store.commit('SET_LOADING', true)
		  this.$fetch.post3(`/tokencoincreate/createCoinAddress`, {
			  currency: currency,
			  currencyNet: currencyNet
		  }).then(res => {
			  this.$store.commit('SET_LOADING', false)
			  if (res.success) {
				  if (res.data.tokenCoinAccount) {
					  this.accountObj = res.data.tokenCoinAccount
				  } else {
					  this.accountObj = res.data
				  }
				  this.qrcodeFn(this.accountObj.coinAddress)
			  }
		  }).catch(err => {})
    },
	  filterVal (v) {
		  this.tTime = ''
		  this.shareCode = ''
      if (v.split(' ')[0] === this.$t('exchangeOrder.text2').split(' ')[0]) {
	      this.currency = ''
      } else {
	      this.currency = v.split(' ')[0]
      }
		  this.pageNo = 1
		  this.getMoney()
	  },
	  changeHoldNum () {
		  this.tTime = ''
		  this.pageNo = 1
      this.getMoney()
    },
	  orderbyTypeFn (type) {
		  //1:币种升序 2:币种降序 3:盈亏升序 4:盈亏降序
	  	if (type === 1) {
	  		if (!this.orderbyType || this.orderbyType > 2) {
				  this.orderbyType = 1
        } else {
				  this.orderbyType = 2
        }
      } else {
			  if (!this.orderbyType || this.orderbyType < 3) {
				  this.orderbyType = 3
			  } else {
				  this.orderbyType = 4
			  }
      }
		  this.getMoney()
    },
	  currentPriceFn (price, n) {
	  	if (price) {
	  		return this.f4(price, n)
      } else {
	  		return  '-'
      }
    },
    f4(value, n = 4)  {
      value = parseFloat(value)
      let str = ''
      if (value) {
        const index = String(value).indexOf('.')
        if (index > 0) {
          const arr = String(value).split('.')
          if (arr[1].length >= n) {
            str = `${arr[0]}.${arr[1].slice(0, n)}`
          } else {
            str = value.toFixed(n)
          }
        } else {
          str = value.toFixed(n)
        }
        return str
      } else {
        return (0).toFixed(n)
      }
    },
	  rechargeUsd () {
		  this.curtCurrency = 'USDT'
	  	this.rechargeFn({
        currency: 'USDT',
			  share: {
        	currencyNet: 'USDT'
			  }
      })
    },
	  depositUsd () {
	  	this.activeCurrency = 'USDT'
	  	this.depositFn({
			  currency: 'USDT',
			  balance: this.$store.state.usdBalance.balance,
			  share: {
				  currencyNet: 'USDT'
			  }
      })
    },
	  clickOneFn (item) {
	  	this.addressF = item.coinAddress
      this.addressSHow = false
		  this.drawCoinAccountId = item.id
    },
	  currencyFn2 (v) {
      if (v === this.$t('moneyText.text41')) {
      	this.currency2 = ''
      } else {
	      this.currency2 = v
      }
		  this.getKline()
    },
	  changePicker () {
		  this.startTime = ''
		  this.endTime = ''
		  if (this.datePicker && this.datePicker[0]) {
			  this.startTime = this.timeFn(+new Date(this.datePicker[0]), '-', 3)
		  }
		  if (this.datePicker && this.datePicker[1]) {
			  this.endTime = this.timeFn(+new Date(this.datePicker[1]), '-', 4)
		  }
		  this.getKline()
    },
	  dataTypeFn (v) {
		  this.dataType = v
      this.dataTypeArr.forEach(a => {
      	if (a.text === v) {
      		this.dataTypeId = a.id
          this.getKline()
        }
      })
	  },
  	getKline () {
  		// /shareInfo/profitLossStatistics
		  this.emptyDate = false
      if (this.dataTypeId === 4 && !this.startTime) {
      	return
      }
		  this.$store.commit('SET_LOADING', true)
		  this.$fetch.post3('/shareInfo/profitLossStatistics', {
			  currency: this.currency2, //	string	币种
			  type: this.dataTypeId, //		int	1:最近7天 2：最近30天 3:最近90天 4:自定义
        startTime: this.startTime, //		string	开始时间yyyy-mm-dd
        endTime: this.endTime, //		string	结束时间yyyy-mm-dd
		  }).then(res => {
			  this.$store.commit('SET_LOADING', false)
			  if (res.success) {
          let ret = res.data
				  this.profitLoss = ret
				  this.lossSumCny = (this.profitLoss.profitLossSum * 1000 / 1000) * (ret.cnyRate * 1000 / 1000)
				  let arr = res.data.list
				  let xarr = []
				  let yarr = []
				  let yarr2 = []
				  arr.forEach(a => {
					  xarr.push(a.time)
					  yarr.push(a.lossMoneyRate)
					  yarr2.push(a.lossMoney)
				  })
				  this.xLine = xarr
				  this.yLine1 = yarr
				  this.yLine2 = yarr2
				  this.drawDeep()
          if (!res.data ||  res.data.list.length === 0) {
	          this.emptyDate = true
          }
			  }
		  }).catch(err => {
			  this.emptyDate = true
      })
    },
	  rateCls (rate) {
		  if (rate > 0) return 'green'
		  if (rate < 0) return 'red'
    },
	  rateH (rate) {
		  if (rate > 0) return '+'
		  if (rate < 0) return ''
		  return ''
    },
	  rateFn (rate) {
		  if (rate > 0) return '+' + this.f4(rate * 10000000000000 / 100000000000)   + '%'
		  if (rate < 0) return '' + this.f4(rate * 10000000000000 / 100000000000) + '%'
      return '-'
    },
  	//  1:沪深 2：港股 3：美股
  	typeFn (type) {
		  if (type === 1) return this.$t('userCenter.text2')
		  if (type === 2) return this.$t('userCenter.text3')
		  if (type === 3) return this.$t('userCenter.text4')
      return '-'
    },
	  drawDeep () {
		  const that = this
		  this.deepData = {
			  grid: {
				  left: 0,
				  right: 0,
				  top: '4%',
				  bottom: '1%',
				  containLabel: true
			  },
			  legend: {
				  data: [this.$t('userCenter.text10'), this.$t('orderSell.text38')]
			  },
			  tooltip: {
				  trigger: 'axis'
			  },
			  toolbox: {
				  feature: {
					  saveAsImage: {}
				  }
			  },
			  xAxis: {
				  type: 'category',
				  data: this.xLine
			  },
			  yAxis: {
				  type: 'value'
			  },
			  textStyle: {
				  color: '#545361'
			  },
			  dataZoom: [
				  {
					  id: 'dataZoomX',
					  type: 'inside',
					  xAxisIndex: [0],
					  filterMode: 'none',
					  start: 0,
					  end: 50
				  }
			  ],
			  series: [
				  {
					  name: this.$t('userCenter.text10'),
					  type: 'line',
					  stack: this.$t('userCenter.text11'),
					  itemStyle: {
						  color: '#2492f5'
					  },
					  data: this.yLine2
				  },
				  {
					  name: this.$t('orderSell.text38'),
					  type: 'line',
					  stack: this.$t('userCenter.text11'),
					  itemStyle: {
						  color: '#afd9ff'
					  },
					  data: this.yLine1
				  },
				]
		  }
	  },
	  showAddress () {
	  	this.addressSHow = !this.addressSHow
		  this.drawCoinList = []
      if (this.addressSHow === true) {
	      this.emptySHow = false
	      this.$store.commit('SET_LOADING', true)
	      this.$fetch.post('/drawcoinaccount/queryDrawCoinAccountInfoList', {
		      currency: this.checkItem.currency, //	string	币种
		      currencyNet: this.currencyNet2, //币种网络(链名称),如ERC20
		      pageIndex: 1,
		      pageSize: 20
	      }).then(res => {
		      this.$store.commit('SET_LOADING', false)
		      if (res.success) {
		      	let ret = res.data.drawCoinAccountInfoList
			      this.drawCoinList = ret
		      	if (ret.length === 0) {
		      		this.emptySHow = true
              this.drawCoinList = []
            }
		      }
	      })
      }
    },
	  checkOne (index, item, currency) {
	  	this.curtIndex = index
      this.currencyNet2 = item
		  this.currencyNetA = item
      if (currency === 2) {
      	this.addressF = ''
        this.drawCoinList = []
	      this.getAddress({currency: this.activeCurrency}, item)
      } else {
	      this.createAddress(currency, item)
      }
    },
	  currencyFn (v) {
	  	if (v === this.$t('moneyText.text41')) {
			  this.currency = ''
      } else {
			  this.currency = v
      }
		  this.pageNo = 1
		  this.getMoney()
    },
	  marketFn (v) {
		  this.tTime = ''
	  	this.marketText = v
      let marketType = ''
		  this.marketTypeArr.forEach(a => {
		  	if (a.text === v) {
				  marketType = a.id
        }
      })
      if (marketType === 0) {
	      this.marketType = ''
      } else {
	      this.marketType = marketType
      }
		  this.pageNo = 1
		  this.getMoney()
    },
	  clickOne (index) {
	  	this.activeIndex = index
      if (index === 1) {
	      this.pageIndex = 1
      	this.getRecord()
      } else if (index === 2) {
	      this.currency2 = ''
	      this.dataTypeId = 1
	      this.getKline()
      }
      if (index !== 0) {
      	clearInterval(this.timer)
        this.tTime = ''
      } else {
	      this.tTime = 1
	      this.timer = setInterval(() => {
		      this.getMoney()
	      }, 10000)
      }
    },
    payConfirm(tradePwd, code) {
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post3('/coinorder/drawCoin', {
	      drawCoinAccountAddress: this.addressF, // 提币地址
        currency: this.currencyItem.currency, //	string	币种
        currencyNet: this.currencyNetA, //	string	链名称
        drawCoinAccountId: this.drawCoinAccountId, //	long	提币地址记录Id
        drawAmount: this.drawAmount, //	string	提币数
        tradePwd, //	string	支付密码
        code  //	string	谷歌码
      }).then(res => {
        this.$store.commit('SET_LOADING', false)
        if (res.success) {
          this.visible = false
          this.isShow = false
	        this.$store.dispatch('getBalance')
          Dialog({
            msg: this.$t('common.success')
          })
        }
      })
    },
    checkInput(key) {
	    this.redT = ''
      let reg = /^([1-9]\d*|0{1})(\.\d{0,6})?/ // 最多六位小数
      let val = this[key]
      let res = val.match(reg)
      const MAX = Number(this.maxAmount) // 挂单金额和数量最多一亿
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
	    if (val > this.amountBalance) {
		    this.redT = this.$t('exchange.text15_1')
	    }
      if (val < this.minAmount) {
      	this.redT = this.$t('userCenter.text12') + this.minAmount + this.currencyItem.currency
      }
      this[key] = val
      let drawFee = this.drawFee ? this.drawFee : 0
      this.amount = this.$options.filters.f((this.drawAmount * 1000000 - drawFee * 1000000) / 1000000, 6)
      if (this.amount <= 0) {
	      this.amount = ''
      }
    },
    hideFn(money) {
      if (this.showOrHide === false) {
        return '********'
      }
      return money
    },
    commandChange2(v) {
      this.coinAddress = v.coinAddress
      this.coinTip = v.coinTip
      this.drawCoinAccountId = v.id
    },
    commandChange1(v) {
      this.currencyNetA = v
    },
    getDrawCoinAccountInfoList(currency, currencyNet) {
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post('/drawcoinaccount/queryDrawCoinAccountInfoList', {
        currency: currency, //	string	币种
      }).then(res => {
        this.$store.commit('SET_LOADING', false)
        if (res.success) {
          this.addressArr = res.data.drawCoinAccountInfoList
        }
      })
    },
    verifyDraw() {
      if (this.drawCoinAccountId === '' && this.addressF === '') {
        this.$message.error(this.$t('orderSell.text45'))
        return false
      }
      if (this.drawAmount === '') {
        this.$message.error(this.$t('moneyText.text24'))
        return false
      }
      if (this.redT !== '') {
      	return  false
      }
      return true
    },
    // 提现确认
    okCallbackDraw() {
      if (this.verifyDraw()) {
        this.isShow = true
      }
    },
    cancelCallbackDraw() {
      this.visible = false
    },
    onCopy() {
      this.$message.success(this.$t('accountUser.text23'))
    },
    qrcodeFn(text) {
	    let qrcode = null
	    document.getElementById("qrcode").innerHTML = "";
      qrcode = new QRCode('qrcode', {
        width: 140,
        height: 140,
        text: text, // 二维码地址
        colorDark: "#000",
        colorLight: "#fff",
      })
    },
    // 列表
    getMoney() {
	  	if (this.tTime !== 1) {
			  this.$store.commit('SET_LOADING', true)
      }
      this.flagA++
      let holdA = 2
      if (this.holdNum === true || this.holdNumA) {
      	holdA = 1
      } else {
	      holdA = 2
      }
      this.$fetch.post3('/shareInfo/getMyAssets', {
	      holdNum: holdA, //	int	1：持仓数量不为0 2：全部
	      orderbyType: this.orderbyType, //1:币种升序 2:币种降序 3:盈亏升序 4:盈亏降序
	      pageNo: this.pageNo, //	int	页数
	      pageSize: 20, //	int	页码
	      currency: this.currency, //	string	币种
	      shareCode: this.shareCode, //	string	股票代码
	      marketType: this.marketType, //	int	1:沪深 2：港股 3：美股
      }).then(res => {
        if (res.success) {
          this.newCurrencyList = res.data
	        let mapData = res.mapData
          if (mapData) {
	          this.total = mapData.totalRecord
	          this.assetsAmount = mapData
	          this.cnyRate = mapData.cnyRate
	          this.cnyReckonAmountSum = mapData.reckonAmountSum * mapData.cnyRate
	          this.cnyCostOfCarrySum = mapData.costOfCarrySum * mapData.cnyRate
          }
          if (this.flagA === 1) {
          	this.allCurrency = this.newCurrencyList
	          this.currencyData = {currency: this.$t('moneyText.text41')}
          	this.currencyData = [this.currencyData, ...res.data]
          }
	        this.currencyArr =  [ {currency: this.$t('moneyText.text41')}, ...res.data]
        }
        if (res) {
	        setTimeout(() => {
		        this.$store.commit('SET_LOADING', false)
	        }, 1000)
        }
      }).catch(err => {
      	let a = err
      })
    },
    // 充值
    rechargeFn(item) {
  		this.currencyNetArr = []
	    this.curtIndex = 0
  		this.getA(item.currency)
      this.isTopDeposit = false
      this.title = this.$t('moneyText.text8') + item.currency
      this.curtCurrency = item.currency
      this.okText = this.$t('moneyText.text12')
      this.btnCancel = true
      this.visible = true
      this.currencyB = item.currency
      if (this.currencyArr.length > 0) {

        this.tipFlag = false
        this.currencyArr.forEach(b => {
          if (b.baseCurrency === item.currency) {
            if (b.tipFlag === 1) {
              this.tipFlag = true
            }
          }
        })
      }
    },
    //  提现
    depositFn(item) {
	  	this.redT = ''
      this.drawAmount = ''
      this.addressF = ''
      this.coinTip = ''
      this.coinAddress = ''
      this.currencyNetA = ''
      this.curtIndex = 0
      this.currencyNetArr = []
      this.balance = item.balance
      this.isTopDeposit = true
      this.title = this.$t('moneyText.text9') + item.currency
      this.okText = this.$t('moneyText.text22')
      this.visible = true
      this.currencyItem = item
	    this.activeCurrency = item.currency
	    this.$fetch.post('/tokencoincreate/queryCurrencyNet', {
		    currency: item.currency, //	string	币种
	    }).then(res => {
	    }).catch(err => {
        if (err.status === 'success') {
        	let currencyNet = ''
          if (err.data && err.data.length > 0) {
	          this.currencyNetArr = err.data
	          currencyNet = err.data[0]
          } else {
	          this.currencyNetArr = []
	          currencyNet = ''
          }
          this.currencyNet2 = currencyNet
	        this.currencyNetA =  currencyNet
	        this.getAddress(item, currencyNet)
        }
	    })

      this.tipFlag = false
      this.currencyArr.forEach(b => {
        if (b.baseCurrency === item.currency) {
          if (b.tipFlag === 1) {
            this.tipFlag = true
          }
        }
      })
      this.checkItem = item
	    // this.currencyNetArr = [item.share.currencyNet]
      this.amountBalance = item.balance || 0
      // this.getDrawCoinAccountInfoList(item.currency, this.currencyNetA)


    },
    getAddress(item, currencyNet) {
	    this.$fetch.post('/coinaccount/queryUserAccountByCurrency', {
		    currency: item.currency, //	String	币种
		    currencyNet: currencyNet, //	String	币链名称(当在提现页面时传) item.share.currencyNet
	    }).then(res => {
		    if (res.success) {
			    let ret = res.data
			    this.drawFee = ret.drawFee
			    this.minAmount = ret.drawMinAmount
			    this.maxAmount = ret.drawMaxAmount
			    this.amount = 0
		    }
	    })
    },
    franceFn(item) {
      if (item.currency === 'USDT') {
        this.$router.push('/otcTrade')
      } else {
        this.$router.push({
          path: '/exchange',
          query: {currency: item.currency}
        })
      }
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    okCallback() {
      this.visible = false
    },
    cancelCallback() {
      this.visible = false
    },
	  timeFn  (time, separator = '.', showType = 1) {
		  if (time) {
			  if (typeof time === 'string' && time.includes('-')) {
				  time = time.replace(/-/g, '/')
			  }
			  let d = new Date(parseInt(time))
			  let day = d.getDate()
			  let month = d.getMonth() + 1
			  let year = d.getFullYear()
			  let hours = d.getHours()
			  let min = d.getMinutes()
			  let sec = d.getSeconds()
			  let str = year + separator + this.toDouble(month) + separator + this.toDouble(day)
			  if (showType === 1) {
				  str += ' ' + this.toDouble(hours) + ':' + this.toDouble(min)
			  } else if (showType === 2) {
				  str += ' ' + `${this.toDouble(hours)}:${this.toDouble(min)}:${this.toDouble(sec)}`
			  } else if (showType === 3) {
				  str += ' ' + `00:00:00`
			  } else if (showType === 4) {
				  str += ' ' + `23:59:59`
			  }
			  return str
		  } else {
			  return '- -'
		  }
	  },
	  toDouble(value) {
		  if (value < 10) {
			  return '0' + value
		  }
		  return value
	  },
  },
	components: {
		'v-chart': ECharts
	},
}
</script>

<style scoped lang="less">
  .empty-w-a{
    text-align: center;
    font-size: 13px;
    color: #7d7c8e;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 60px;
    i{
      font-size: 60px;
      margin-bottom: 10px;
      opacity: .5;
    }
    .no-da-1{
      font-size: 16px;
      margin-bottom: 20px;
    }
    .no-da-2{
      font-size: 14px;
      /deep/ .buy{
        color: #2492f5;
        cursor: pointer;
      }
    }
    img{
      width: 100px;
      margin: 20px 0;
    }
  }
  input, div /deep/ .el-input__inner {
    &::-webkit-input-placeholder {
      color: #ccc !important;
    }
    &::-moz-placeholder {
      color: #ccc!important;
    }
    &:-moz-placeholder {
      color: #ccc!important;
    }
    &:-ms-input-placeholder {
      color: #ccc!important;
    }
  }
  .select-a{
    /deep/ .el-input__inner {
      &::-webkit-input-placeholder {
        color: #1c1c1c !important;
      }
      &::-moz-placeholder {
        color: #1c1c1c!important;
      }
      &:-moz-placeholder {
        color: #1c1c1c!important;
      }
      &:-ms-input-placeholder {
        color: #1c1c1c!important;
      }
    }
  }
  .blue{
    color: #2492f5;
  }
  .red-t{
    color: #ff2e2d;
    margin-bottom: 10px;
    margin-top: -20px;
  }
  .nowrap{
    white-space: nowrap;
  }
  .green{
    color: #13c897;
  }
  .red{
    color: #ff2e2d;
  }
  .menu-drop-a {
    background-color: #32323e;
    border: none;
    width: 520px;
    &.menu-drop-min {
      width: 160px;
      padding: 10px;
      /deep/ .popper__arrow {
        left: auto !important;
        right: 20px;
      }
    }
    /deep/ .el-dropdown-menu__item {
      color: #fff;
      font-size: 14px;
      border-top: 1px solid #41414f;
      &:nth-child(1) {
        border-top: none;
      }
      &:hover {
        background-color: #32323e;
        color: #639cff;
      }
    }
    /deep/ .popper__arrow {
      border-bottom-color: #32323e !important;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.95));
      left: 20px !important;
      &::after {
        display: none;
      }
    }
  }

  .total-money-w {
    /*margin-left: 40px;*/
    /deep/ .el-select .el-input__inner{
      border: 1px solid #e6e6e6 !important;
    }
    .c-content{
      margin: 0 3.5%;
    }
    .uls-title{
      display: flex;
      align-items: center;
      height: 92px;
      border-bottom: 1px solid #e6e6e6;
      background-color: #17233b;
      padding: 0 3.5%;
      .list-title{
        margin-right:  60px;
        font-size: 18px;
        color: #8696b5;
        line-height: 60px;
        cursor: pointer;
        height: 60px;
        margin-top: 30px;
        &.active-list{
          color: #fff;
          border-bottom: 3px solid #2492f5;
        }
      }
    }
    .chicang-w{
      display: flex;
      justify-content: space-between;
      margin: 40px 0 18px;
      .chicang-item{
        flex: 1;
        font-size: 14px;
        color: #cccccc;
        &.chicang-item2{
          flex: 0.6;
        }
        &:last-child{
          margin-right: 0;
        }
        .win-w{
          display: flex;
          align-items: center;
          .help{
            margin-left: 5px;
            cursor: pointer;
            font-size: 16px;
          }
        }
        .b-a{
          cursor: pointer;
          padding: 0 5px;
          color: #2492f5;
          font-weight: normal;
          &:first-child{
            margin-left: 20px;
          }
        }
        .label{
          font-size: 14px;
          color: #b3b3b3;
          margin-bottom: 10px;
        }
        .blue{
          color: #13c897;
        }
        .red{
          color: #ff2e2d;
        }
        .bold-usd{
          font-size: 16px;
          color: #1c1c1c;
          font-weight: bold;
        }
        .bold-usd-a{
          font-size: 16px;
          font-weight: bold;
          margin-right: 10px;
        }
      }
    }
    .input-m{
      display: flex;
      align-items: center;
      padding-top: 30px;
      border-top: 1px solid #e6e6e6;
      .input-wrap{
        width: 160px;
        height: 40px;
        margin-right: 20px;
      }
      .input-item{
        margin-bottom: 20px;
        /deep/ .el-checkbox{
          border: 1px solid #e6e6e6 !important;
        }
      }
    }
    .input-wrap input{
      border: 1px solid #e6e6e6;
    }
    .title-a {
      padding-left: 30px;
    }
    .cursor{
      cursor: pointer;
    }
    .money-a{
      margin: 0 30px 20px 20px;
      .usdt{
        /*color: #13c897;*/
        font-weight: bold;
        font-size: 16px;
      }
    }
    .percent{
      /*color: #13c897;*/
      margin-bottom: 20px;
    }
    .money-w {
      display: flex;
      align-items: center;
      padding-left: 30px;
      font-size: 18px;
      margin: 16px 0 32px;
      .usd-money {
        color: #5f5e6c;
        margin-left: 2px;
      }
    }
    .show-or-hide {
      margin-left: 20px;
      min-width: 60px;
      height: 30px;
      border: 1px solid #41414f;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 12px;
      color: #5f5e6c;
      cursor: pointer;
      .img {
        margin-right: 4px;
      }
    }
    .table-w{
      tr{
        height: 40px;
        border-bottom: 1px solid #f4f4f4;
        td{
          &:first-child{
            padding-left: 20px;
          }
          &:nth-child(10){
            padding-right: 20px;
          }
          &.cursor{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-right: 10px;
          }
        }
        .name-td{
          max-width: 200px;
        }
      }
      .tr-list{
        cursor: pointer;
      }
      .ctrl{
        color: #2492f5;
      }
      thead{
        color: #767588;
        background-color: #fafafa;
      }
      tbody{
        .last-li{
          color: #2492f5;
          span{
            padding: 10px 20px 10px 0;
            cursor: pointer;
          }
        }
        tr{
          &:hover{
            background: #eee;
            transition: 0.2s;
          }
        }
      }
    }
    .table {
      display: flex;
      align-items: center;
      height: 40px;
      li {
        flex: 1;
        padding: 0 5px;
      }

      .last-li {
        flex: 1.3;
      }
      .currency-li {
        flex: 0.3;
      }
      .green{
        color: #13c897;
      }
      .red{
        color: #ff2e2d;
      }
    }
    .caret-wrapper{
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 34px;
      width: 20px;
      vertical-align: middle;
      cursor: pointer;
      overflow: initial;
      position: relative;
      margin-left: -5px;
      .sort-caret {
        width: 0;
        height: 0;
        border: 4px solid transparent;
        position: absolute;
        left: 7px;
        &:nth-child(1) {
          border-bottom-color: #c0c4cc;
          top:8px;
          &.blue-a{
            border-bottom-color: #2492f5;
          }
        }
        &:nth-child(2) {
          border-top-color: #c0c4cc;
          bottom: 8px;
          &.blue-a{
            border-top-color: #2492f5;
          }
        }
      }
    }
    .table-head {
      font-weight: bold;
      padding-left: 20px;
      color: #b3b3b3;
      li{
        white-space: nowrap;
      }
    }
    .table-body {
      margin-left: 20px;
      border-bottom: 1px solid #f7f7f7;
      &:hover{
        background-color: #eee;
      }
      li {
        color: #1c1c1c;
      }
      .ctrl {
        display: flex;
        align-items: center;
        span {
          color: #639cff;
          margin-right: 30px;
          white-space: nowrap;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .full () {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    @btnColor: #1c1c1c;
    @btnCancel: #32323e;
    .g-dialog {
      .full();
      position: fixed;
      color: #1c1c1c;
      z-index: 999;
      .drop-w {
        width: 100%;
        /deep/ .el-dropdown-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          border: 1px solid #41414f;
          padding: 0 20px 0 10px;
          color: #fff;
        }
      }
      .content-wrap {
        padding: 20px;
        border-radius: 6px;
        width: 500px;
        &.deposit-w{
          width: 400px;
        }
        @media screen and (max-width: 1200px) {
          padding: 20px !important;
        }
        .g-dialog-content {
          color: #000;
          margin-bottom: 60px;
        }
      }
      .g-dialog-title {
        font-size: 16px;
        font-weight: bold;
        line-height: 18px;
        .el-icon {
          display: inline-block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-size: contain;
          vertical-align: top;
          margin-right: 6px;
        }
      }
      &-mask {
        .full();
        position: absolute;
        background: rgba(0, 0, 0, .6)
      }
      &-wrap {
        position: absolute;
        width: 340px;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        background: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        @media screen and (max-width: 1200px) {
          width: 80%;
        }
      }
      &-close {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 34px;
        cursor: pointer;
      }
      &-title {
        font-size: 24px;
        line-height: 1;
        padding-bottom: 30px;
      }
      &-btn-wrap {
        text-align: center;
        display: flex;
        justify-content: flex-end;
        margin-top: 30px;
      }
      &-btn {
        display: inline-block;
        height: 34px;
        cursor: pointer;
        font-size: 14px;
        color: #fff;
        border-radius: 4px;
        background-color: #fff;
      }
      &-ok {
        width: 100%;
        background: @btnColor;
        transition: .4s;
        &:hover {
          background: darken(@btnColor, 10%);
        }
      }
      &-cancel {
        width: 100px;
        background-color: @btnCancel;
        border: none;
        color: #fff;
        & + button {
          width: 100px;
        }
      }
    }

    .dialog-enter, .dialog-leave-to {
      opacity: 0;
      .g-dialog-wrap {
        transform: translate(-50%, -55%)
      }
    }

    .dialog-enter-active {
      transition: .3s;
      .g-dialog-wrap {
        transition: .3s
      }
    }

    .dialog-leave-active {
      transition: .1s;
      .g-dialog-wrap {
        transition: .1s
      }
    }
    .label {
      font-size: 14px;
      margin-bottom: 12px;
      color: #b3b3b3;
    }
    .input-item {
      margin-bottom: 30px;
      .label-a{
        margin-bottom: 0;
      }
      .input-a {
        height: 40px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        padding: 0 20px 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .input-c {
          flex: 1;
          height: 100%;
          input {
            height: 100%;
            width: 100%;
          }
        }
        img {
          display: block;
        }
        .copy-t {
          display: flex;
          align-items: center;
          cursor: pointer;
          img {
            margin-right: 4px;
          }
        }
      }
    }
    .down-input {
      /*cursor: pointer;*/
    }
    .opt-w{
      position: relative;
      border: 1px solid #e6e6e6;
      padding: 0 10px;
      border-radius: 4px;
      .a-m{
        display: flex;
        align-items: center;
        height: 40px;
        input{
          flex: 1;
        }
        .open-a{
          font-size: 14px;
          color: #2492f5;
          cursor: pointer;
        }
      }
      .address-w{
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #fff;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        margin-top: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,.3);
        .d-m{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          padding: 0 10px;
          border-bottom: 1px solid #e6e6e6;
        }
        .address-uls{
          padding-bottom: 10px;
          .address-list{
            padding: 0 10px;
            border-bottom: 1px solid #e6e6e6;
            height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            &:last-child{
              border: none;
            }
            .h-title{
              font-size: 14px;
              color: #1c1c1c;
            }
            .address{
              margin-top: 2px;
              color: #b3b3b3;
              font-size: 11px;
            }
          }
        }
      }
      .no-data-w{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: #fff;
        position: absolute;
        margin-top: 10px;
        top: 100%;
        left: 0;
        width: 100%;
        height: 120px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        .no-img{
          width: 60px;
          img{
            width: 100%;
            display: block;
          }
        }
        .no-text{
          font-size: 14px;
          color: #b3b3b3;
        }
      }
    }
    .address-a{
      word-break: break-word;
      font-size: 12px;
      color: #1c1c1c;
    }
    .address-flex{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .copy{
        color: #2492f5;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .ul-str{
      display: flex;
      align-items: center;
      .list-str{
        padding: 6px;
        border: 1px solid #d6d6d6;
        color: #1c1c1c;
        border-radius: 4px;
        margin-right: 16px;
        cursor: pointer;
        &.active-a{
          color: #2492f5;
          border-color: #2492f5;
        }
      }
    }
    .qrcode-w {
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
      .qrcode-a {
        width: 140px;
        height: 140px;
        background-color: #fff;
        margin-bottom: 20px;
        display: flex;
      }
      .tips {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
        padding: 10px;
        background-color: #ffe2e2;
        .a-l{
          color: #1c1c1c;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
    .balance {
      font-size: 14px;
      margin: 12px 0 0 10px;
      .num-t {
        color: #2492f5;
      }
    }
    .flex-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
      &.long-flex{
        align-items: flex-start;
        .label-y{
          white-space: nowrap;
        }
        .text-r{
          word-break: break-word;
          padding-left: 50px;
          text-align: right;
        }
      }
      .label {
        color: #ccc;
      }
      .label-a{
        margin-bottom: 0;
      }
    }
    .b-a-l{
      padding-top: 20px;
      border-top: 1px solid #e6e6e6;
      margin-bottom: 10px;
      margin-top: 20px;
    }
    .input-c-l{
      color: #2492f5;
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0 20px;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 20px;
    }
    .rd-w{
      .flex-between{
        margin-bottom: 10px;
      }
    }
    .label-y{
      color: #b3b3b3;
      font-size: 14px;
    }
    .text-n{
      margin-bottom: 20px;
    }
    .copy{
      color: #2492f5;
      cursor: pointer;
    }
    input {
      color: #1c1c1c;
    }
  }
  .b-m{
    width: 120px;
    height: 40px;
    background-color: #e8f4ff;
    border-radius: 4px;
    display: flex;
    color: #2492f5;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
  }
  .input-m-w{
    display: flex;
    align-items: center;
    .input-wrap{
      width: 160px;
      margin-right: 20px;
      &.data-wrap{
        width: auto;
      }
    }
  }
  .record-w{
    .flex-top{
      display: flex;
      align-items: center;
      margin: 30px 0;
      .select-a{
        margin-right: 20px;
      }
      .data-wrap{
        margin-bottom: 0;
      }
      .ul-t{
        display: flex;
        align-items: center;
        margin-right: 40px;
        .li-t{
          width: 100px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e6e6e6;
          cursor: pointer;
          &.active-li{
            border-color: #2492f5;
            background-color: #2492f5;
            color: #fff;
          }
          &:nth-child(1) {
            border-right: none;
            border-radius: 4px 0 0 4px;
          }
          &:nth-child(2) {
            border-left: none;
            border-radius: 0 4px 4px 0;
          }
        }
      }
    }
  }
</style>
