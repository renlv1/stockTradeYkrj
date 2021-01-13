<template>
  <div class="topDeposit-w">
    <div class="title-a">{{$t('google.text26')}}</div>
    <div class="input-a-t">
      <div class="input-left">
        <div class="input-wrap">
          <input type="text" :placeholder="$t('google.text27')" v-model.trim="transactionId">
        </div>
        <div class="input-wrap dropdown-wrap">
          <el-select  v-model="typeText" @change="typeIdFn" :placeholder="$t('google.text28')">
            <el-option class="opt-item opt-item2" v-for="(item,index) in  typeOptions"  :key="index" :value="item" :label="item.text"></el-option>
          </el-select>
        </div>


        <div class="input-wrap dropdown-wrap">
          <el-select  v-model="currencyText" @change="moneyFn" :placeholder="$t('moneyText.text36')">
            <el-option v-for="(item, index) in [{currency: $t('exchangeOrder.text2')}, {currency: 'USDT'}].concat(currencyList)"  :key="index" :value="item.currency" :label="item.currency"></el-option>
          </el-select>
        </div>

        <div class="input-wrap dropdown-wrap">
          <el-select  v-model="statusText" @change="statusIdFn"  :placeholder="$t('google.text29')">
            <el-option class="opt-item" v-for="(item,index) in  statusOptions" :key="index" :value="item" :label="item.text"></el-option>
          </el-select>
        </div>

        <div class="input-wrap data-wrap">
          <el-date-picker
                  @change="pickerTimeFn"
                  v-model="datePicker"
                  type="daterange"
                  range-separator="-"
                  format="yyyy/MM/dd"
                  :start-placeholder="$t('moneyText.text26')"
                  :end-placeholder="$t('moneyText.text27')">
          </el-date-picker>
        </div>
      </div>
    </div>
    <load-more ref="loadMore" v-model="pageIndex" @change="getCurrencyList" :list="accountList" :total="total" :pageSize="pageSize">
      <table class="table-w">
        <thead>
        <tr>
          <td class="list-1">{{$t('google.text27')}}</td>
          <td class="list-2">{{$t('google.text31')}}</td>
          <td class="">{{$t('exchange.text12')}}</td>
          <td class="list-2">{{$t('google.text32')}}</td>
          <td class="list-long">{{$t('google.text33')}}</td>
          <td class="">{{$t('google.text34')}}</td>
          <td class="">{{$t('google.text35')}}</td>
          <td class="">{{$t('certification.text33')}}</td>
        </tr>
        </thead>
        <tbody>
        <tr  v-for="(item, index) in accountList" :key="index"  @click="addressFn(item)">
          <td class="list-1">{{item.id}}</td>
          <td class="list-2">{{paymentTypeFn(item.orderType)}}</td>
          <td class="" v-show="Number(item.amount) > -1"><span v-show="item.incomeType === 2">-</span>
            <span v-if="item.orderType === 3 || item.orderType === 4">{{feeFn(item.amount)}}</span>
            <span v-else>{{item.amount | f(item.numPlaces)}}</span>
            {{item.currency}}
          </td>
          <td class="list-2" :class="incomeCls(item.incomeType)">{{incomeTypeFn(item.incomeType)}}</td>
          <td class="list-long">
            <span v-if="item.coinentrustId">{{item.coinentrustId}}</span>
            <span v-else>{{item.orderId}}</span>
          </td>
          <td class="">{{statusFn(item.status)}}</td>
          <td class="">{{item.createtime | time}}</td>
          <td class="ctrl last-li">
            <span v-show="item.orderType === 1 || item.orderType === 2  || item.orderType === 5">{{$t('userA.text17')}}</span>
            <span v-show="item.orderType === 3 || item.orderType === 4">{{$t('google.text37')}}</span>
          </td>
        </tr>
        </tbody>
      </table>
    </load-more>

<!--    充提记录-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('google.text38')}}</div>
            <i class="g-dialog-close" @click="visible = false; tradeObj = {}">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="a-item">
            <div class="label label-a" v-show="tradeObj.orderType === 3">{{$t('moneyText.text8')}}</div>
            <div class="label label-a" v-show="tradeObj.orderType === 4">{{$t('moneyText.text9')}}</div>
            <div class="input-c">{{feeFn(tradeObj.amount)}} {{tradeObj.currency}}</div>
          </div>
          <div v-show="tradeObj.sendSysCode">
            <div class="flex-between">
              <div class="label-y">{{$t('google.text39')}}</div>
              <div class="copy" v-clipboard:copy="tradeObj.sendSysCode" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</div>
            </div>
            <div class="text-n">{{tradeObj.sendSysCode}}</div>
          </div>
          <div v-show="tradeObj.receiveSysCode">
            <div class="flex-between">
              <div class="label-y">{{$t('google.text40')}}</div>
              <div class="copy"  v-clipboard:copy="tradeObj.receiveSysCode" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</div>
            </div>
            <div class="text-n">{{tradeObj.receiveSysCode}}</div>
          </div>
          <div v-show="tradeObj.hashCode">
            <div class="flex-between">
              <div class="label-y">HASH</div>
              <div class="copy"  v-clipboard:copy="tradeObj.hashCode" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</div>
            </div>
            <div class="text-n">{{tradeObj.hashCode}}</div>
          </div>
          <div v-show="tradeObj.orderType === 4">
            <div class="label-y">{{$t('moneyText.text20')}}</div>
            <div class="" style="margin-top: 10px;">{{feeFn(tradeObj.feeAmount)}} {{tradeObj.currency}}</div>
          </div>

          <div class="flex-between b-a">
            <div class="label-y">{{$t('google.text21')}}</div>
            <div>{{tradeObj.createtime | time}}</div>
          </div>
          <div class="flex-between">
            <div class="label-y">{{$t('exchange.text27')}}</div>
            <div>{{tradeObj.updatetime | time}}</div>
          </div>
          <div class="flex-between">
            <div class="label-y">{{$t('google.text34')}}</div>
            <div >{{statusFn(tradeObj.status)}}</div>
          </div>
          <div class="flex-between long-flex">
            <div class="label-y">{{$t('google.text27')}}</div>
            <div class="text-r">{{tradeObj.orderId}}</div>
          </div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok"  @click="visible = false; tradeObj = {}">{{$t('moneyText.text12')}}</button>
          </div>
        </div>
      </div>
    </transition>

<!--    交易明细-->
    <el-dialog class="intro-dialog" :visible="showDetail" @close="showDetail = false; detail = {}">
      <div v-if="detail.order" @click.stop>
        <!--  买入明细  -->
        <template v-if="detail.order.etype === 1">
          <div class="intro">
            <div class="tit allCenter">
              {{$t('otcTrade.text28')}}{{detail.order.buyCurrency}}
              <i class="pointer el-icon-close" @click="showDetail = false; detail = {}"></i>
            </div>
            <div class="section">
              <p>
                <i>{{$t('google.text41')}}</i>
                <span>{{detail.order.cashAmount | f(detail.order.pricePlaces)}} USDT</span>
              </p>
              <p  v-if="detail.list.length">
                <i>{{$t('google.text30') }}</i>
<!--                {{detail.list[0].tradeFeeBuy | f(detail.order.pricePlaces)}}USDT -->
                <span> {{amountFn2(detail.order.fee, detail.order)}} USDT</span>
              </p>
              <p>
                <i>{{$t('google.text42')}}</i>
                <span v-html="state2text(detail.order.state)"></span>
              </p>
              <p>
                <i>{{$t('google.text33')}}</i>
                <span>{{detail.order.id}}</span>
              </p>
              <template v-if="detail.order.state !== 2">
                <p>
                  <i>{{$t('google.text43')}}</i>
                  <span>{{amountFn(detail.order.tradeCashAmount, detail.order)}} USDT</span>
                </p>
                <p  v-if="detail.list.length">
                  <i>{{$t('google.text44')}}</i>
                  <span>{{amountFn(detail.list[0].surplusNoTradeTotal, detail.order)}} USDT</span>
                </p>
              </template>
            </div>
          </div>
          <div class="step-wrap">
            <div class="tit">{{$t('google.text45')}}</div>
            <div class="step">
              <div class="item item-t" v-if="detail.order.state === 4 || detail.order.state === 5">
                <h4 class="a-m">{{$t('orderSell.text14')}}</h4>
                <p v-if="detail.list.length">{{$t('google.text47')}} <span class="cblue">{{Number(detail.list[0].surplusNoTradeTotal) | f(detail.order.pricePlaces)}}USDT</span>，{{$t('exchangeNew.text61')}}</p>
                <p v-else>{{$t('google.text47')}} <span class="cblue">{{detail.order.cashAmount | f(detail.order.pricePlaces)}}USDT</span>，{{$t('exchangeNew.text61')}}</p>
                <span class="cgray fz12"  v-if="detail.list.length">{{detail.list[0].updatetime | time}}</span>
                <span class="cgray fz12"  v-else>{{detail.order.updatetime | time}}</span>
              </div>
              <div class="item" v-for="(item, index) in detail.list" :key="index">
                <h4 class="a-m-a">
                  <span v-if="detail.order.state === 2 && index === 0">{{$t('google.text48')}}</span>
                  <span v-else>{{$t('google.text49')}}</span>
                </h4>
                <div  class="c-t">
                  <div>  {{$t('orderSell.text1')}} <span class="cblue">{{item.realAmount | f(detail.order.numPlaces)}} {{item.buyCurrency}}</span>，{{$t('orderSell.text2')}} {{item.tradePrice | f(detail.order.pricePlaces)}}</div>
                  <div>{{$t('exchangeOrder.text28')}} {{amountFn(item.tradeTotalPrice, detail.order)}}USDT</div>
                  <div >{{$t('google.text30') }} {{amountFn(item.tradeFeeBuy, detail.order)}}USDT</div>
                </div>
                <span class="cgray fz12">{{item.createtime | time}}</span>
              </div>
              <div class="item">
                <h4 class="a-m-1">{{$t('orderSell.text4')}}</h4>
                <p >{{$t('orderSell.text5')}} {{detail.order.cashAmount | f(detail.order.pricePlaces)}}USDT</p>
                <span  class="cgray fz12">{{detail.order.createtime | time}}</span>
              </div>
            </div>
          </div>
        </template>
        <!--  卖出明细   -->
        <template v-else>
          <div class="intro">
            <div class="tit allCenter">
              {{$t('common.sell')}}{{detail.order.sellCurrency}}
              <i class="pointer el-icon-close" @click="showDetail = false; detail = {}"></i>
            </div>
            <div class="section">
              <p>
                <i>{{$t('orderSell.text6')}}</i>
                <span>{{detail.order.amount | f(detail.order.numPlaces)}} {{detail.order.sellCurrency}}</span>
              </p>
              <p v-if="detail.list.length">
                <i>{{$t('google.text30')}}</i>
                <span >{{amountFn2(detail.order.fee, detail.order, 2)}}  USDT</span>
              </p>
              <p>
                <i>{{$t('google.text42')}}</i>
                <span v-html="state2text(detail.order.state)"></span>
              </p>
              <p>
                <i>{{$t('google.text33')}}</i>
                <span>{{detail.order.id}}</span>
              </p>
              <template v-if="detail.order.state !== 2">
                <p>
                  <i>{{$t('google.text43')}}</i>
                  <span>{{amountFn(detail.order.tradeAmount, detail.order)}} USDT</span>
                </p>
                <p v-if="detail.list.length">
                  <i>{{$t('google.text44')}}</i>
                  <span>{{amountFn(detail.list[0].surplusNoTradeAmount, detail.order)}} USDT</span>
                </p>
              </template>
            </div>
          </div>
          <div class="step-wrap">
            <div class="tit">{{$t('google.text45')}}</div>
            <div class="step">
              <div class="item  item-t"  v-if="detail.order.state === 4 || detail.order.state === 5">
                <h4 class="a-m">{{$t('google.text46')}}</h4>
                <p v-if="detail.list.length">{{$t('google.text47')}}<span class="cblue">{{Number(detail.list[0].surplusNoTradeAmount) | f(detail.order.pricePlaces)}}    {{detail.order.sellCurrency}}</span>，{{$t('google.text50')}}</p>
                <p v-else>{{$t('google.text47')}}<span class="cblue">{{Number(detail.order.tradeAmount) | f(detail.order.pricePlaces)}}    {{detail.order.sellCurrency}}</span>，{{$t('google.text50')}}</p>
              </div>
              <div class="item" v-for="(item, index) in detail.list" :key="index">
                <h4 class="">
                  <span v-if="detail.order.state === 2 && index === detail.list.length -1">{{$t('google.text48')}}</span>
                  <span v-else>{{$t('google.text49')}}</span>
                </h4>
                <div class="c-t">
                  <div>{{$t('orderSell.text7')}}<span class="cblue"> {{item.realAmount | f(detail.order.numPlaces)}}{{item.buyCurrency}}</span>，{{$t('orderSell.text2')}} {{item.tradePrice | f(detail.order.pricePlaces)}}</div>
                  <div>{{$t('exchangeOrder.text28')}} {{amountFn(item.tradeTotalPrice, detail.order)}}USDT</div>
                  <div >{{$t('google.text30')}} {{amountFn(item.tradeFeeSell, detail.order)}}USDT</div>
                  <div>{{$t('userCenter.text75')}} {{amountFn(item.realTotalPrice, detail.order)}}USDT</div>
                </div>
                <span class="cgray fz12">{{item.createtime | time}}</span>
              </div>
              <div class="item">
                <h4 class="a-m-1">{{$t('orderSell.text4')}}</h4>
                <p  >{{$t('orderSell.text8')}} {{detail.order.amount | f(detail.order.numPlaces)}} {{detail.order.sellCurrency}}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
      <loading v-else></loading>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
	import Dialog from '@/components/dialog'
	export default {
		data() {
			return {
				numPlacesR: '',
				currencyText: '',
				detail: '',
				showDetail: false,
				startTime: '',
				endTime: '',
				transactionId: '',
				typeId: '',
				statusId: '',
				// 1：买入订单 2：卖出订单  3：充币 4：提币 5：退款
				typeOptions: [
					{id: '', text: this.$t('orderSell.text9')},
					{id: 1, text: this.$t('orderSell.text10')},
					{id: 2, text: this.$t('orderSell.text11')},
					{id: 3, text: this.$t('orderSell.text12')},
					{id: 4, text: this.$t('orderSell.text13')},
					{id: 5, text: this.$t('orderSell.text14')},
        ],
        // 1:收入 2：支出
				statusOptions: [
					{id: 0, text: this.$t('google.text29')},
					{id: 1, text: this.$t('orderSell.text15')},
					{id: 2, text: this.$t('orderSell.text16')},
        ],
				tradeObj: '',
				hashCode: '',
				currencyNetA: '',
				currencyNetArr: '',
				visible: false,
				total: 0,
				pageIndex: 1,
				accountList: [{}],
				isSHow: false,
				strArr: [],
				coinAddress: '',
				currencyNet: '',
				coinTip: '',
				accountRemark: '',
				typeText: '',
				currency: '',
				statusText: '',
				datePicker: '',
				typeArr: [],
				currencyArr: [],
				statusArr: [],
				pageSize: 20
			}
		},
		created () {
		},
		computed: {
			currencyList () {
				if (!this.$store.state.currencyList.length) {
					this.$store.dispatch('getCurrencyList')
				}
				return this.$store.state.currencyList
			},
		},
		mounted () {
			this.$watch('transactionId', this.debounce((newQuery) => {
				// newQuery为输入的值
				this.accountList = []
				this.pageIndex = 1
        this.$refs.loadMore.currentPageFn(1)
				this.getCurrencyList()
			}, 1500))
		},
		methods: {
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
			amountFn (money, item) {
				let num = Number(item.pricePlaces) * Number(item.numPlaces)
				if (num >= 8) {
					return this.$options.filters.f(money, 8)
				} else {
					return  this.$options.filters.f(money, num)
				}
			},
			amountFn2 (money, item) {
				let num = Number(item.pricePlaces) * Number(item.numPlaces)
				if (num >= 8) {
					return this.$options.filters.f(money, 8)
				} else {
					return  this.$options.filters.f(money, num)
				}
      },
			moneyFn (v) {
        if (v === this.$t('exchangeOrder.text2')) {
        	this.currencyText = ''
        } else {
	        this.currencyText = v
        }
				this.pageIndex = 1
				this.$refs.loadMore.currentPageFn(1)
				this.getCurrencyList()
      },
			safeCalc (n1, n2) {
				const BASE = 1000000000
				return ((this.$options.filters.f(n1) * BASE - this.$options.filters.f(n2) * BASE) / BASE)
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
			pickerTimeFn (v) {
				this.startTime = ''
				this.endTime = ''
				if (this.datePicker && this.datePicker[0]) {
					this.startTime = this.timeFn(+new Date(this.datePicker[0]), '-', 3)
				}
				if (this.datePicker && this.datePicker[1]) {
					this.endTime = this.timeFn(+new Date(this.datePicker[1]), '-', 4)
				}
				this.pageIndex = 1
				this.$refs.loadMore.currentPageFn(1)
				this.getCurrencyList()
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
      //   1：收入 2：支出
			incomeTypeFn (type) {
				if (type === 1) return this.$t('orderSell.text15')
				if (type === 2) return this.$t('orderSell.text16')
      },
      // 收支class
			incomeCls (type) {
				if (type === 1) return 'green'
				if (type === 2) return 'red'
      },
      //1：买入订单 2：卖出订单  3：充币 4：提币 5：退款
			paymentTypeFn (type) {
				if (type === 1) return this.$t('orderSell.text10')
				if (type === 2) return this.$t('orderSell.text11')
				if (type === 3) return this.$t('orderSell.text12')
				if (type === 4) return this.$t('orderSell.text13')
				if (type === 5) return this.$t('orderSell.text14')
      },
			commandChange1 () {},
			okCallback () {},
			addShowDialog () {
				this.visible = true
			},
			onCopy() {
				this.$message.success(this.$t('accountUser.text23'))
			},
			addFn () {

				let currencyNet = ''
				if (this.currency.indexOf('USD') > -1) {
					if (this.currencyNet === '') {
						this.$message.error(this.$t('certification.text37'))
						return
					}
					currencyNet = this.currencyNet
				} else {
					currencyNet = this.currency
				}
				if (this.coinAddress === '') {
					this.$message.error(this.$t('certification.text38'))
					return
				}
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post3('/drawcoinaccount/addDrawCoinAccount', {
					currency: this.currency, //	String	币种如USDT
					currencyNet: currencyNet, //		String	币种网络(链名称),如ERC20
					coinAddress: this.coinAddress, //		String	提币地址
					accountRemark: this.accountRemark, //		String	备注
					coinTip: this.coinTip, //		String	地址标签
				}).then(res => {
					if (res.success) {
						Dialog({
							msg: this.$t('certification.text39'),
							okFn: () => {
								this.coinTip = ''
								this.coinAddress = ''
								this.accountRemark = ''
								this.pageIndex = 1
								this.$refs.loadMore.currentPageFn(1)
								this.getCurrencyList()
							}
						})
					}
					this.$store.commit('SET_LOADING', false)
				})
			},
			statusIdFn (v) {
				this.statusText = v.text
        if (v.id) {
        	this.statusId = v.id
        } else {
	        this.statusId = ''
        }
				this.pageIndex = 1
				this.$refs.loadMore.currentPageFn(1)
				this.getCurrencyList()
			},
			typeIdFn (v) {
				this.typeText = v.text
				if (v.id) {
					this.typeId = v.id
        } else {
					this.typeId = ''
        }
				this.pageIndex = 1
				this.$refs.loadMore.currentPageFn(1)
        this.getCurrencyList()
			},
			getCurrencyList () {
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post3('/transaction/getMyTradeList', {
					currency: this.currencyText,
					transactionId: this.transactionId, //	long	交易记录ID
					type: this.typeId, //1：买入订单 2：卖出订单  3：充币 4：提币 5：退款
          status: this.statusId, //		int	1:收入 2：支出
          startTime: this.startTime, //		string	开始时间（yyyy-mm-dd）
          endTime: this.endTime, //		string	结束时间（yyyy-mm-dd
          pageNo: this.pageIndex, //		int	页码
          pageSize: this.pageSize, //		int	大小
        }).then(res => {
					if (res.success) {
						this.accountList = res.data
						this.total = res.mapData.totalRecord
						setTimeout(() => {
							this.$store.commit('SET_LOADING', false)
						}, 1000)
					}
				}).catch(err => {
					this.accountList = []
        })
			},
			//
			editorFn () {},
			deleteFn (item, index) {
				Dialog({
					msg: this.$t('certification.text40'),
					okFn: () => {
						this.$store.commit('SET_LOADING', true)
						this.$fetch.post('/drawcoinaccount/delDrawCoinAccount', {
							drawCoinAccountInfoId: item.id
						}).then(res => {
							this.$store.commit('SET_LOADING', false)
							if (res.success) {
								Dialog({
									msg: this.$t('certification.text41'),
									okFn: () => {
										this.accountList.splice(index, 1)
									}
								})
							}
						})
					}
				})
			},
			addressFn (item) {
				let typeF = item.orderType
				if (typeF === 1 || typeF === 2  || typeF === 5) {
					this.showDetail = true
          let type = item.orderType
          if (item.orderType === 5) {
	          type = 1
          }
					this.$fetch.post('/coinentrustRecord/entrustDetail', {
						id: item.coinentrustId,
						pageSize: 10000,
            type: type
						// type: item.incomeType
					}).then(res => {
						let order = res.mapData.entrustOrder
						let list = res.data.results
						// order.pricePlaces = item.pricePlaces
						// order.numPlaces = item.numPlaces
            order.incomeType = item.incomeType
						this.detail = {
							order,
							list
						}
					})
        } else {
					this.visible = true
					this.$store.commit('SET_LOADING', true)
					this.$fetch.post('/transaction/getMyTradeDetail', {
						transactionId: item.id
					}).then(res => {
						this.numPlacesR = item.numPlaces
						if (res.success) {
							this.$store.commit('SET_LOADING', false)
							this.tradeObj = res.data
						}
					})
        }

			},
			debounce(func, delay) {
				let timer
				return (...args) => {
					if (timer) {
						clearTimeout(timer)
					}
					timer = setTimeout(() => {
						func.apply(this, args)
					}, delay)
				}
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
    watch: {
	    showDetail (newval) {
        if (newval === false) {
	        document.body.style.overflow = ''
        } else {
	        document.body.style.overflow = 'hidden'
        }
      }
    }
	}
</script>

<style scoped lang="less">
  input {
    transition: all .3s linear;
  }
  div /deep/ input, div /deep/ .el-input__inner {
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
  div /deep/ .el-select input{
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
  .red{
    color: #ff415d;
  }
  .c-t{
    margin: 10px 0;
    div{
      margin: 5px 0;
    }
  }
  .topDeposit-w{
    padding-top: 40px;
    font-size: 14px;
    margin: 0 3.5%;
    margin-left: 40px;
    /deep/ .el-date-editor.el-input__inner{
      border: 1px solid #e6e6e6 !important;
    }
    /deep/ .el-range-input{
      color: #1c1c1c !important;
    }
    /deep/.el-input__icon{
      color: #1c1c1c;
    }
    .title-a{
      font-size: 24px;
      font-weight: bold;
      color: #1c1c1c;
    }
    .input-a-t{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 40px 0;
      .input-left{
        display: flex;
        align-items: center;
      }
      .dropdown-wrap{
        /deep/ .el-dropdown{
          width: 100%;
          height: 100%;
          .el-dropdown-link{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px 0 10px;
          }
        }
        /deep/ .el-input__inner{
          color: #1c1c1c;
          border-color: #e6e6e6 !important;
        }
      }
      .input-wrap{
        width: 160px;
        height: 40px;
        border-radius: 4px;
        margin-right: 20px;
        color: #fff;
        margin-bottom: 0;
        margin-top: 30px;
        &.address-w{
          width: 300px;
        }
        input{
          border: 1px solid #e6e6e6;
          width: 100%;
          height: 100%;
          font-size: 14px;
          color: #1c1c1c;
        }
      }
      .data-wrap{
        border: none;
        width: 240px;
      }
      .search-btn{
        width: 100px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        color: #2492f5;
        font-size: 14px;
        cursor: pointer;
        margin-top: 30px;
        border: 1px solid #2492f5;
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
        }
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
          cursor: pointer;
          &:hover{
            background: #eee;
            transition: 0.2s;
          }
        }
        .green{
          color: #13c897;
        }
        .red{
          color: #ff2e2d;
        }
      }
    }
    .table{
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #f7f7f7;
      .list-1{
        width: 70px;
        flex: none;
      }
      .list-2{
        width: 70px;
        flex: none;
      }
      li{
        flex: 1;
        padding-right: 10px;
      }
      .currency-list{
        flex: 0.4;
      }
      .list-long{
        flex: 2.6;
      }
      .list-a{
        flex: 0.6;
      }
    }
    .table-head{
      font-weight: bold;
      padding-left: 20px;
      font-size: 14px;
      color: #767588;
      background-color: #fafafa;
    }
    .table-body{
      cursor: pointer;
      &:hover{
        background: #eee;
        transition: 0.2s;
      }
      li{
        color: #1c1c1c;
        font-size: 14px;
        word-break: break-word;
        &:first-child{
          padding-left: 20px;
        }
      }
      .green{
        color: #13c897;
      }
      .red{
        color: #ff2e2d;
      }
      .ctrl{
        display: flex;
        align-items: center;
        span{
          color: #2492f5;
          margin-right: 30px;
          white-space: nowrap;
          cursor: pointer;
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
  }
  @btnColor: #4d62ff;
  @btnCancel: #32323e;
  .full () {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
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
        border: 1px solid #e6e6e6;
        padding: 0 20px 0 10px;
        color: #fff;
        .el-icon-caret-bottom {
          color: #b3b3b3;
        }
      }
    }
    .content-wrap {
      border-radius: 6px;
      width: 500px;
      @media screen and (max-width: 1200px) {
        padding: 20px !important;
      }
      .g-dialog-content {
        color: #000;
        margin-bottom: 60px;
      }
      .label{
        font-size: 14px;
        color: #b3b3b3;
        margin: 30px 0 10px;
      }
      .label-a{
        margin-top: 0;
      }
    }
    .g-dialog-title {
      font-size: 16px;
      font-weight: bold;
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
      padding: 20px;
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
    &-btn {

    }
    &-ok {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background-color: #1c1c1c;
      transition: .4s;
      margin-top: 30px;
      &:hover {
        background: darken(#1c1c1c, 10%);
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
    .a-item{
      .label-a{
        font-size: 14px;
        color: #1c1c1c;
      }
    }
    .label-y{
      color: #b3b3b3;
      font-size: 14px;
    }
    .text-n{
      margin-bottom: 20px;
    }
    .border-line{
      padding-bottom: 20px;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 20px;
      margin-top: 6px;
    }
    .b-a{
      padding-top: 20px;
      border-top: 1px solid #e6e6e6;
      margin-bottom: 20px;
      margin-top: 20px;
    }
    .input-c{
      color: #2492f5;
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0 20px;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 20px;
    }
    .flex-between{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      &.long-flex{
        align-items: flex-start;
      }
      .copy{
        color: #2492f5;
        cursor: pointer;
      }
      .text-r{
        flex: 1;
        margin-left: 20px;
        word-break: break-word;
        text-align: right;
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

  .intro-dialog{
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
    /deep/ .red{
      color: #ff415d;
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
  }
</style>
