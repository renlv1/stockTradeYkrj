<template>
  <div class="topDeposit-w">
    <div class="title-a">{{$t('accountUser.text2')}}</div>
    <div class="input-a-t">
      <div class="input-wrap dropdown-wrap">
        <el-select  v-model="typeText" @change="selectFn">
          <el-option v-for="(item,index) in  typeArr" :key="index" :value="item.type" :label="item.text"></el-option>
        </el-select>
      </div>
      <div class="input-wrap dropdown-wrap">
        <el-select  v-model="currency" @change="currencyFn">
          <el-option v-for="(item,index) in  currencyData" :key="index" :value="item.baseCurrency" :label="item.baseCurrency"></el-option>
        </el-select>
      </div>
      <div class="input-wrap data-wrap">
        <el-date-picker
                v-model="datePicker"
                type="daterange"
                range-separator="-"
                format="yyyy/MM/dd"
                :start-placeholder="$t('moneyText.text26')"
                :end-placeholder="$t('moneyText.text27')">
        </el-date-picker>
      </div>
      <div class="search-btn" @click="searchFn">{{$t('moneyText.text28')}}</div>
    </div>
    <ul class="table table-head">
      <li>{{$t('exchange.text37')}}</li>
      <li>{{$t('moneyText.text29')}}</li>
      <li>{{$t('exchange.text4')}}</li>
      <li>{{$t('exchange.text13')}}</li>
      <li>{{$t('moneyText.text30')}}</li>
      <li>{{$t('otcTrade.text15')}}</li>
    </ul>
    <load-more ref="loadMore" v-model="pageIndex" @change="searchFn" :list="coinOrderList" :total="total">
      <div class="table table-body" v-for="(item, index) in coinOrderList" :key="index">
        <ul class="table-content">
          <li>{{item.createAt | time('/')}}</li>
          <li>{{typeFn(item.recordType)}}</li>
          <li>{{item.currency}}</li>
          <li>{{item.amount}}</li>
          <li>{{statusFn(item)}}</li>
          <li class="ctrl">
          <span @click="openOrClose(index)" class="btn-m">
            <span v-if="activeIndex === index">{{$t('moneyText.text31')}}</span>
            <span v-else>{{$t('moneyText.text32')}}</span>
            <span class="arrow-w-a">
                <span class="arrow-t" :class="{'arrow-a': activeIndex === index}"></span>
            </span>
          </span>
          </li>
        </ul>
        <div class="open-t" v-show="activeIndex === index" :class="{'active-open': activeIndex === index}">
          <div class="flex-a">
            <span>{{$t('moneyText.text33')}}：{{item.userReceiveAccount}}</span>
            <span>{{$t('certification.text30')}}：{{item.currencyNet}}</span>
          </div>
          <div class="flex-a" v-show="item.recordType === 1 || item.recordType === 3">
            <span>{{$t('moneyText.text34')}}：{{emptyFn(item.hash)}}</span>
          </div>
        </div>
      </div>
    </load-more>
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
		data() {
			return {
				total: 0,
				activeIndex: -1,
				coinOrderList: [],
				typeText: this.$t('moneyText.text35'),
				currency: this.$t('moneyText.text36'),
				statusText: this.$t('moneyText.text37'),
				datePicker: '',
				typeArr: [ // 1充币 2快速充币 3普通提币 4快速提币
					{text: this.$t('moneyText.text41'), type: 0},
					{text: this.$t('moneyText.text8'), type: 1},
					{text:  this.$t('moneyText.text38'), type: 2},
					{text:  this.$t('moneyText.text39'), type: 3},
					{text:  this.$t('moneyText.text40'), type: 4},
        ],
				currencyArr: [],
				currencyData: [],
				statusArr: [],
				pageIndex: 1,
				pageSize: 10
      }
		},
    created () {
			// this.orderList()
      this.getCurrency()
      // this.searchFn()
    },
    methods: {
			emptyFn (val) {
				if (val) return val
        return '-'
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
	    typeFn (type) {
	    //类型 1充币 2快速充币 3普通提币 4快速提币
		    if (type === 1) return this.$t('moneyText.text8')
		    if (type === 2) return  this.$t('moneyText.text38')
		    if (type === 3) return  this.$t('moneyText.text39')
		    if (type === 4) return  this.$t('moneyText.text40')
      },
	    statusFn (item) {
		    // "depositStatus":"1",//充值订单状态 0 ：待确认  1：确认成功  2：确认失败 3系统检查中 4非系统接收币种 5找不到用户 6确认成功待审核 7审核不通过
			  //   "drawStatus":"1",//提现订单状态 0待支付 1待转账处理 2处理中 3待确认 4：确认成功  5：确认失败 6系统检查中 7打款失败 8提现待审核 9不打款
        let depositStatus = item.depositStatus
        let drawStatus = item.drawStatus
	    	if (depositStatus > -1) {
			    if (depositStatus === 0) return this.$t('depositStatus.text0') //'待确认'
			    if (depositStatus === 1) return this.$t('depositStatus.text1') //'确认成功'
			    if (depositStatus === 2) return this.$t('depositStatus.text2') //'确认失败'
			    if (depositStatus === 3) return this.$t('depositStatus.text3') //'系统检查中'
			    if (depositStatus === 4) return this.$t('depositStatus.text4') //'非系统接收币种'
			    if (depositStatus === 5) return this.$t('depositStatus.text5') //'找不到用户'
			    if (depositStatus === 6) return this.$t('depositStatus.text6') //'确认成功待审核'
			    if (depositStatus === 7) return this.$t('depositStatus.text7') //'审核不通过'
        }
	    	if (drawStatus > -1) {
			    if (drawStatus === 0) return this.$t('drawStatus.text0') //'待支付'
			    if (drawStatus === 1) return this.$t('drawStatus.text1') //'待转账处理'
			    if (drawStatus === 2) return this.$t('drawStatus.text2') //'处理中'
			    if (drawStatus === 3) return this.$t('drawStatus.text3') //'待确认'
			    if (drawStatus === 4) return this.$t('drawStatus.text4') //'确认成功'
			    if (drawStatus === 5) return this.$t('drawStatus.text5') //'确认失败'
			    if (drawStatus === 6) return this.$t('drawStatus.text6') //'系统检查中'
			    if (drawStatus === 7) return this.$t('drawStatus.text7') //'打款失败'
			    if (drawStatus === 8) return this.$t('drawStatus.text8') //'提现待审核'
			    if (drawStatus === 9) return this.$t('drawStatus.text9') //'不打款'
        }
      },
	    searchFn () {
	    	let dataObj = {
			    pageIndex: this.pageIndex, //	int	页码
			    pageSize: this.pageSize, //	int	每页显示数
        }
        if (this.datePicker && this.datePicker[0]) {
	        dataObj.startDate = this.timeFn(+new Date(this.datePicker[0]), '-', 3)
        }
		    if (this.datePicker && this.datePicker[1]) {
			    dataObj.endDate = this.timeFn(+new Date(this.datePicker[1]), '-', 4)
		    }
		    if (this.typeText > 0) dataObj.recordType = this.typeText //	int	类型 1充币 2快速充币 3普通提币 4快速提币
		    if (this.currency.indexOf(this.$t('moneyText.text41')) === -1) dataObj.currency = this.currency //	string	币种
		    this.$store.commit('SET_LOADING', true)
	    	this.$fetch.post('/coinorder/queryCoinOrderList', dataObj).then(res => {
			    this.$store.commit('SET_LOADING', false)
        	if (res.success) {
        		this.coinOrderList = res.data.tokenCoinOrderList
            this.total = res.mapData.totalCount
          }
        })
      },
	    selectFn (v) {
        this.typeText = v
      },
	    currencyFn (v) {
	    	this.currency = v
      },
      // 获取币种
	    getCurrency () {
		    this.$fetch.post('/coinaccount/queryCoinCurrencyList').then(res => {
			    if (res.success) {
			    	let a = {baseCurrency: this.$t('moneyText.text41')}
				    this.currencyData.push(a)
				    this.currencyData.push(...res.data)
			    }
		    })
	    },
	    orderList () {
		    this.$fetch.post('/coinorder/queryCoinOrderList',{
			    // recordType: 1,
			    // currency: 'USDT'
        }).then(res => {
			    if (res.success) {
				    this.currencyArr = res.data.accountList
			    }
		    })
	    },
	    commandChange () {},
	    openOrClose (index) {
	    	if (index === this.activeIndex) {
			    this.activeIndex = -1
        } else {
			    this.activeIndex = index
        }
      }
    }
	}
</script>

<style scoped lang="less">
  .topDeposit-w{
    padding-top: 40px;
    font-size: 12px;
    /deep/ .load-list-wrap{
      margin-left: 20px;
    }
    .title-a{
      padding-left: 30px;
    }
    .input-a-t{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 20px 0 40px 30px;
      .input-wrap{
        width: 160px;
        height: 40px;
        border: 1px solid #41414f;
        border-radius: 4px;
        margin-right: 20px;
        color: #fff;
        margin-bottom: 0;
        /deep/ .el-dropdown{
          width: 100%;
          height: 100%;
          padding: 0 10px;
          display: flex;
          align-items: center;
          .el-dropdown-link{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
        /deep/ input{
          border: none;
        }
        /deep/ .el-date-editor{
          width: 100%;
          background-color: #32323e;
          border:1px solid #41414f;
          .el-input__icon{
            color: #639cff;
          }
          input,.el-range-separator{
            color: #ccc;
          }
        }
      }
      .data-wrap{
        border: none;
        width: 240px;
        /deep/ input{
          cursor: pointer;
          width: 80px !important;
        }
      }
      .search-btn{
        width: 100px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #4d62ff;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .table{
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      li{
        flex: 1;
        color: #5f5e6c;

      }
    }
    .table-head{
      font-weight: bold;
      padding-left: 20px;
      background-color: #32323e;
    }
    .table-body{
      border-bottom: 1px solid #41414f;
      display: block;
      height: auto;
      &:hover{
        background-color: #32323e;
      }
      li{
        color: #ccc;
      }
      .ctrl{
        display: flex;
        align-items: center;
        .btn-m{
          display: flex;
          align-items: center;
        }
        .arrow-w-a{
          margin-left: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .arrow-t{
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-bottom-color: #639cff ;
          transform: rotateZ(180deg);
          transition: all .3s linear;
          margin-top: 10px;
          &.arrow-a{
            margin-top: 0;
            transform: rotateZ(0deg);
          }
        }
        span{
          color: #639cff;
          white-space: nowrap;
          cursor: pointer;
        }
      }
    }
    .table-content{
      display: flex;
      align-items: center;
      height: 40px;
    }
    .open-t{
      padding: 10px 0;
      height: 0;
      overflow: hidden;

      &.active-open{
        border-top: 1px solid #41414f;
        height: auto;
        .flex-a{
          height: 24px;
        }
      }
      .flex-a{
        transition: height .3s linear;
        height: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 2;
        color: #ccc;
        font-size: 14px;
        span{
          flex: 1;
          text-align: left;
        }
      }
    }
  }
</style>
