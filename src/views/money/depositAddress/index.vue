<template>
  <div class="topDeposit-w">
    <div class="title-a">{{$t('google.text13')}}</div>
    <div class="input-a-t">
      <div class="input-left">
<!--        <div class="input-wrap">-->
<!--          <input type="text" placeholder="区块链地址" v-model.trim="coinTipAddress">-->
<!--        </div>-->
        <div class="input-wrap dropdown-wrap">
          <el-select  v-model="currency" @change="currencyFn" :placeholder="$t('moneyText.text36')">
            <el-option v-for="(item, index) in [{currency: $t('exchangeOrder.text2')}, {currency: 'USDT'}].concat(currencyList)"  :key="index" :value="item.currency" :label="item.currency"></el-option>
          </el-select>
        </div>
        <div class="input-wrap dropdown-wrap" v-show="currencyArr.length > 0">
          <el-select  v-model="currencyNet" @change="currencyFn2"  :placeholder="$t('certification.text30')">
            <el-option v-for="(item,index) in  currencyArr" :key="index" :value="item" :label="item"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search-btn" @click="addShowDialog">+{{$t('google.text18')}}</div>
    </div>
    <load-more ref="loadMore" class="" v-model="pageIndex" @change="getMoney" :list="accountList" :total="total">
    <table class="table-w">
      <thead>
        <tr>
          <td >{{$t('google.text19')}}</td>
          <td >{{$t('certification.text35')}}</td>
          <td >{{$t('certification.text30')}}</td>
          <td class="list-long">{{$t('google.text20')}}</td>
          <td>{{$t('google.text21')}}</td>
          <td>{{$t('certification.text33')}}</td>
        </tr>
      </thead>

        <tbody>
          <tr  v-for="(item, index) in accountList" :key="index">
            <td>{{item.accountRemark}}</td>
            <td>{{item.currency}}</td>
            <td>{{item.currencyNet}}</td>
            <td class="list-long">{{item.coinAddress}}</td>
            <td>{{item.createtime | time}}</td>
            <td class="ctrl last-li">
              <span @click="addressFn(item)" >{{$t('myAdvertising.text20')}}</span>
              <span @click="deleteFn(item, index)">{{$t('setting.text26')}}</span>
            </td>
          </tr>
        </tbody>
    </table>
    </load-more>

    <transition name="dialog">
      <div class="g-dialog" v-if="visible">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('moneyText.text13')}}</div>
            <i class="g-dialog-close" @click="visible = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label label-a">{{$t('google.text19')}}</div>
            <div class="input-c">
              <input type="text" :placeholder="$t('google.text19')" v-model="accountRemark">
            </div>
          </div>
          <div class="input-item down-input">
            <div class="label">{{$t('certification.text35')}}</div>
            <el-dropdown @command="commandChange1" class="drop-w"  placement="bottom-start">
              <div class="el-dropdown-link" >
                <span v-if="currencyNetA === ''" class="select-a">{{$t('google.text22')}}</span>
                <span v-else> {{currencyNetA}}  </span>
                <div class="img-t el-icon-caret-bottom"></div>
              </div>
              <el-dropdown-menu class="menu-drop-c " slot="dropdown"  placement="bottom-start">
                <el-dropdown-item :command="item" v-for="(item,index) in  [{currency: 'USDT'}].concat(currencyList)" :key="index">{{item.currency}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="input-item down-input"  v-show="currencyNetArr.length > 0">
            <div class="label">{{$t('certification.text30')}}</div>
            <el-dropdown @command="commandChange2" class="drop-w" placement="bottom-start">
              <div class="el-dropdown-link">
                <span> {{currencyNetB}}  </span>
                <div class="img-t el-icon-caret-bottom">
                </div>
              </div>
              <el-dropdown-menu class="menu-drop-c " slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item,index) in  currencyNetArr" :key="index">{{item}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="input-item">
            <div class="label">{{$t('google.text20')}}</div>
            <div class="input-c"><input type="text" :placeholder="$t('google.text20')" v-model="coinAddress"></div>
          </div>

          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="addFn">{{$t('moneyText.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
	import Dialog from '@/components/dialog'
	export default {
		data() {
			return {
				editorId: '',
				currencyNetA: '',
				currencyNetB: '',
				currencyNetArr: '',
				visible: false,
				total: 0,
				pageIndex: 1,
				accountList: [],
				isShow: false,
				strArr: [],
				coinAddress: '',
				currencyNet: '',
				accountRemark: '',
				typeText: this.$t('certification.text35'),
				currency: '',
				statusText: this.$t('certification.text36'),
				datePicker: '',
				typeArr: [],
				currencyArr: [],
				statusArr: []
			}
		},
    created () {
      // this.getCurrencyList()
    },
    mounted () {
      // setTimeout(() => {
	    //   if (this.currencyList.length === 0) {
		  //     this.$store.dispatch('getCurrencyList')
	    //   }
      // }, 3000)
    },
		computed: {
			currencyList () {
				if (!this.$store.state.currencyList.length) {
					this.$store.dispatch('getCurrencyList')
				}
				return this.$store.state.currencyList
			},
		},
		methods: {
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
			commandChange1 (v) {
				this.currencyNetA = v.currency
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post('/tokencoincreate/queryCurrencyNet', {
					currency: v.currency, //	string	币种
				}).then(res => {
					this.$store.commit('SET_LOADING', false)
					if (res.status === 'success') {
					}
				}).catch(err => {
					this.$store.commit('SET_LOADING', false)
					if (err.status === 'success') {
						let currencyNet = ''
						if (err.data && err.data.length > 0) {
							this.currencyNetArr = err.data
							this.currencyNetB = err.data[0]
						} else {
							this.currencyNetArr = []
							this.currencyNetB = ''
						}
					}
				})
      },
			commandChange2 (v) {
				this.currencyNetB = v
			},
			addShowDialog () {
				this.accountRemark = ''
				this.coinAddress = ''
				this.visible = true
        this.editorId = ''
      },
			addFn () {
        let currencyNet = ''
        if (this.accountRemark === '') {
	        this.$message.error(this.$t('google.text23'))
	        return
        }
        if (this.coinAddress === '') {
	        this.$message.error(this.$t('certification.text38'))
	        return
        }
        if (this.currencyNetB === '') {
	        this.$message.error(this.$t('google.text24'))
        }
        let url = ''
        if (this.editorId) {
          url = '/drawcoinaccount/updateDrawCoinAccount'
        } else {
	        url = '/drawcoinaccount/addDrawCoinAccount'
        }
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post3(url, {
					id: this.editorId,
					currency: this.currencyNetA, //	String	币种如USDT
					currencyNet: this.currencyNetB, //		String	币种网络(链名称),如ERC20
					coinAddress: this.coinAddress, //		String	提币地址
					accountRemark: this.accountRemark, //		String	备注
					// coinTip: this.coinTip, //		String	地址标签
        }).then(res => {
        	if (res.success) {
        		let msg = ''
            if (this.editorId) {
            	msg = this.$t('google.text25')
            } else {
	            msg = this.$t('certification.text39')
            }
		        Dialog({
			        msg: msg,
			        okFn: () => {
				        this.coinAddress = ''
                this.accountRemark = ''
			        	this.pageIndex = 1
                this.visible = false
                this.$refs.loadMore.currentPageFn(1)
				        this.getMoney()
			        }
		        })
          }
					this.$store.commit('SET_LOADING', false)
        })
      },
      // 查询链名称
			getA (currency) {
				this.currencyArr = []
				this.$fetch.post('/tokencoincreate/queryCurrencyNet', {
					currency: currency, //	string	币种
				}).then(res => {
				}).catch(err => {
          if (err.status === 'success') {
          	if (err.data && err.data.length > 0) {
		          this.currencyArr =  [this.$t('userCenter.text76')].concat(err.data)
            }
          }
        })
			},
			currencyFn2 (v) {
				let currencyNet = v
				if (v === this.$t('userCenter.text76')) {
					currencyNet = ''
        } else {
					currencyNet = v
        }
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post3('/drawcoinaccount/queryDrawCoinAccountInfoList', {
					currency: this.currency,
					currencyNet: currencyNet,
					pageIndex: 1,
					pageSize: 20
				}).then(res => {
					if (res.success) {
						this.accountList = res.data.drawCoinAccountInfoList
						this.total = res.mapData.totalCount
						this.$store.commit('SET_LOADING', false)
					}
				})

      },
			currencyFn (v) {

				this.currencyNet = ''
        if (v === this.$t('exchangeOrder.text2')) {
	        this.currency = ''
        } else {
	        this.currency = v
        }
        if (v) {
	        this.getA(v)
        }

        // /drawcoinaccount/queryDrawCoinAccountInfoList
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post3('/drawcoinaccount/queryDrawCoinAccountInfoList', {
					currency: this.currency,
					currencyNet: this.currencyNet,
					pageIndex: 1,
					pageSize: 20
        }).then(res => {
					if (res.success) {
						this.accountList = res.data.drawCoinAccountInfoList
						this.total = res.mapData.totalCount
						this.$store.commit('SET_LOADING', false)
					}
				})
			},
			getCurrencyList () {
				// this.$fetch.post('/shareInfo/getMyAssets').then(res => {
				// 	if (res.success) {
				// 		this.currencyArr = [{currency: this.$t('exchangeOrder.text2')}].concat(res.data)
        //     console.log(this.currencyArr)
        //     this.currencyNetA = this.currencyArr[0].currency
				// 	}
				// })
			},
			//
			getMoney () {
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post('/drawcoinaccount/queryDrawCoinAccountInfoList', {
					pageIndex: this.pageIndex, //	int	页码
					pageSize: 10 //		int	每页显示数
        }).then(res => {
					if (res.success) {
						this.accountList = res.data.drawCoinAccountInfoList
						this.total = res.mapData.totalCount
					}
					this.$store.commit('SET_LOADING', false)
				})
			},
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
				this.editorId = item.id
				this.visible = true
        this.currencyNetA = item.currency
        this.coinAddress = item.coinAddress
        this.accountRemark = item.accountRemark
      },
		}
	}
</script>

<style scoped lang="less">
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
  input {
    transition: all .3s linear;
  }
  .topDeposit-w{
    padding-top: 40px;
    margin: 0 3.5%;
    margin-left: 40px;
    font-size: 14px;
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
            padding: 0 20px;
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
          &:hover{
            background: #eee;
            transition: 0.2s;
          }
        }
      }
    }
    .table{
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #b3b3b3;
      li{
        flex: 1;
        padding-right: 10px;
      }
      .currency-list{
        flex: 0.2;
      }
      .list-long{
        flex: 1.5;
      }
      .list-a{
        flex: 0.6;
      }
    }
    .t-ta{
      padding-left: 20px;
      border-bottom: 1px solid #b3b3b3;
    }
    .table-head{
      font-weight: bold;

      color: #b3b3b3;
      font-size: 14px;
      border: none;
    }
    .table-body{
      margin-left: 20px;
      li{
        color: #1c1c1c;
        font-size: 14px;
        word-break: break-word;
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
        .el-icon-caret-bottom {
          color: #b3b3b3;
        }
        .select-a{
          color: #ccc;
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
    .input-c{
      width: 100%;
      input{
        width: 100%;
        height: 40px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        padding-left: 10px;
        color: #1c1c1c;
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
</style>
