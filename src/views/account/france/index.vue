<template>
  <div class="france-w">
    <div class="title-h">{{$t('setting.text18')}}</div>
    <div v-show="$store.state.user.isbusinessman === 1">
      <div class="username" v-if="$store.state.user.isbusinessman !== 2">Hi,{{$store.state.user.nickName}}, {{$t('setting.text19')}}<span class="blue-t" @click="$router.push('/advertising/unAuth')">{{$t('setting.text20')}}</span></div>
      <div class="username" v-else>Hi,{{$store.state.user.nickName}}</div>
      <div class="tips-t" v-show="$store.state.allUserInfo.isCertification !== 1">{{$t('setting.text21')}}</div>
    </div>
    <div v-show="$store.state.user.isbusinessman !== 1">
      <div class="username">Hi,{{$store.state.user.nickName}}</div>
    </div>
    <div class="table-a table-a-1">
      <div class="table-head">{{$t('setting.text22')}}</div>
      <div class="flex-between ctrl-flex" v-for="(item, index) in bankList" :key="index">
        <div class="label-t ">
          <span class="bank-text"  v-show="item.bankType === 1">{{$t('setting.text23')}}</span>
          <span class="zhifu-text" v-show="item.bankType === 2">{{$t('setting.text24')}}</span>
          <span class="zhifu-text" v-show="item.bankType === 3">{{$t('certification.text44')}}</span>
          <span  class="bank-number">{{item.bankNumber}}</span>
          <div v-show="(item.bankType === 2 || item.bankType === 3) && item.imgtwo">
            <img src="@img/menu/qrcode.png" alt="">
          </div>
        </div>
        <div class="right-ctrl">
          <div class="btn-item" @click="modifyBank(item)">{{$t('setting.text25')}}</div>
          <div class="btn-item" @click="deleteBank(item)">{{$t('setting.text26')}}</div>
        </div>
      </div>
      <div class="add-btn" @click="addAccount">+ {{$t('setting.text27')}}</div>
    </div>
    <div class="table-a">
      <div class="table-head">{{$t('setting.text28')}}</div>
      <div class="flex-between">
        <span class="label-t">
          <span>{{$t('setting.text29')}}</span>
        </span>

        <div class=" dropdown-wrap">
          <el-dropdown @command="commandChange">
                            <span class="el-dropdown-link">
                              {{noteTextFn($store.state.userCertification, 1)}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
            <el-dropdown-menu class="menu-drop-a menu-drop-min" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item,index) in  listArr" :key="index">{{item.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="flex-between">
        <span class="label-t">
          <span>{{$t('setting.text30')}}</span>
        </span>
        <div class=" dropdown-wrap">
          <el-dropdown @command="commandChange3">
            <span class="el-dropdown-link">
              {{noteTextFn($store.state.userCertification, 2)}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
<!--            <span class="el-dropdown-link" >-->
<!--              {{noteText}}<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>-->
<!--            </span>-->
            <el-dropdown-menu class="menu-drop-a menu-drop-min" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item,index) in  listArr" :key="index">{{item.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

    </div>
<!--    选择账号类型-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible2">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('accountUser.text43')}}</div>
            <i class="g-dialog-close" @click="visible2 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item down-input" >
            <div class="label">{{$t('bank.text1')}}</div>
            <div class=" dropdown-wrap">
              <el-dropdown @command="commandChange1" placement="bottom-start">
                            <span class="el-dropdown-link">
                              {{userType}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu-drop-a" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item,index) in  userTypeArr" :key="index">{{item.text}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="okback2">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
<!--    添加或修改-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('accountUser.text43')}}</div>
            <i class="g-dialog-close" @click="visible = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div >
            <div class="input-item down-input" >
              <div class="label">{{$t('bank.text1')}}</div>
              <div class=" dropdown-wrap">
                <el-dropdown @command="commandChange2" placement="bottom-start">
                            <span class="el-dropdown-link">
                              {{userType2}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                  <el-dropdown-menu class="menu-drop-a" slot="dropdown">
                    <el-dropdown-item :command="item" v-for="(item,index) in  userTypeArr" :key="index">{{item.text}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div v-show="bankType !== 1">
              <div class="input-item">
                <div class="label">{{$t('bank.text2')}}</div>
                <div class="input-a input-currency">{{currency}}</div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text3')}}</div>
                <div class="input-a">
                  <input type="text" :placeholder="$t('bank.text4')" v-model.trim="realName">
                </div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text5')}}</div>
                <div class="input-a">
                  <input type="text" :placeholder="$t('bank.text6')"  v-model.trim="bankNumber">
                </div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text7')}}</div>
                <div class="upload-a">
                  <div class="bg-a" v-show="imgtwo" :class="{'load-img': isLoad}">
                    <div class="img-a" :style="`background-image: url(${imgtwo});`">
                      <img :src="imgtwo" alt="" @load="loadFn">
                    </div>
                  </div>
                  <div v-show="!imgtwo" class="input-file-a">
                    <div class="">
                      <img src="@img/menu/addUpload.png" alt="">
                    </div>
                    <div class="text-m">{{$t('bank.text8')}}</div>
                  </div>
                  <input type="file" class="file-add" @change="changeFlag" ref="uploadFile">
                </div>
              </div>
            </div>
            <div v-show="bankType === 1">
              <div class="input-item">
                <div class="label">{{$t('bank.text2')}}</div>
                <div class=" input-check">
                  <div class="list-a" @click="checkBank(item)" v-for="(item, index) in bankArr" :key="index">
                    <div class="check-a" :class="{'checked': item.check === true}"></div>
                    <span>{{item.currency}}</span>
                  </div>
                </div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text3')}}</div>
                <div class="input-a">
                  <input type="text" :placeholder="$t('bank.text9')" v-model.trim="realName">
                </div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text10')}}</div>
                <div class="input-a">
                  <input type="text" :placeholder="$t('bank.text11')"  v-model.trim="bankNumber">
                </div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text12')}}</div>
                <div class="input-a">
                  <input type="text" :placeholder="$t('bank.text13')"  v-model.trim="bankName">
                </div>
              </div>
              <div class="input-item">
                <div class="label">{{$t('bank.text14')}}</div>
                <div class="input-a">
                  <input type="text" :placeholder="$t('bank.text15')" v-model.trim="subBankName">
                </div>
              </div>
            </div>
          </div>
          <div class="err-red">{{errMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="okCallback">{{$t('bank.text16')}}</button>
            <button class="g-dialog-btn g-dialog-cancel" @click="cancelCallback">{{$t('bank.text17')}}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Dialog from '@/components/dialog'
  import {compress, dataURItoBlob} from '@/assets/js/util'
	export default {
		data() {
			return {
				isLoad: true,
				queryType: 0,
				visibleOrder: false,
				editorId: '',
				bankList: [],
				errMsg: '',
				currencyArr: [],
				currency: '',//	String	币种 多币种,分割
				bankName: '',//	String	银行名称
				subBankName: '',//	String	支行名
				realName: '',//	String	银行卡户名
				bankNumber: '',//	String	卡号
				imgtwo: '',//	String	第三方二维码收款地址
        imgTwoName: '',
				userType: this.$t('setting.text23'),
				userType2: '',
				bankArr: [
					{currency: 'CNY', check: true},
					{currency: 'USD', check: false},
        ],
				userTypeArr: [
					{text: this.$t('setting.text23'), id: 1},
					{text: this.$t('setting.text24'), id: 2},
        ],
        bankType: 1,
				okText: this.$t('bank.text16'),
				visible2: false,
				visible: false,
				isTopDeposit: false,
				noteId: 1,
				emailId: 1,
				noteText: this.$t('bank.text18'),
				emailText: this.$t('bank.text18'),
				listArr: [
					{text: this.$t('bank.text18'), index: 1},
					{text: this.$t('bank.text19'), index: 2},
					{text: this.$t('bank.text20'), index: 3},
        ]
      }
		},
    created () {
			this.getBank()
    },
    methods: {
	    loadFn () {
        this.isLoad = false
      },
	    noteTextFn (flag, index) {
	    	if (flag) {
	    		if (index === 1) {
				    if (flag.mailNotice === 1) return this.$t('bank.text18')
				    if (flag.mailNotice === 2) return this.$t('bank.text19')
				    if (flag.mailNotice === 3) return this.$t('bank.text20')
          }else {
				    if (flag.smsNotice === 1) return this.$t('bank.text18')
				    if (flag.smsNotice === 2) return this.$t('bank.text19')
				    if (flag.smsNotice === 3) return this.$t('bank.text20')
          }
        }
		    return this.$t('bank.text18')
      },
	    modifyBank (item) {
	    	this.visible = true
		    this.visible2 = false
        if (item.bankType === 1) {
	        this.userType2 = this.$t('setting.text23')
        } else {
	        this.userType2 = this.$t('setting.text24')
        }
        this.bankType = item.bankType
		    this.currency = item.currency //	String	币种 多币种,分割
        let currencyNew = item.currency
        this.bankArr.forEach((list) => {
        	if (currencyNew.indexOf(list.currency) > -1) {
        		list.check = true
          } else {
		        list.check = false
          }
        })
        this.bankName = item.bankName //	String	银行名称
        this.subBankName = item.subBankName//	String	支行名
        this.realName = item.realName//	String	银行卡户名
        this.bankNumber = item.bankRealNumber//	String	卡号
        this.imgtwo = item.imgtwo//	String	第三方二维码收款地址
        this.editorId = item.id
      },
	    deleteBank (item) {
	    	Dialog({
          msg: this.$t('bank.text21'),
          okFn: () => {
          	this.$fetch.post('/bankinfo/delBankInfo', {
		          bankInfoId: item.id
            }).then(res => {
            	if (res.success) {
            		Dialog({
                  msg: this.$t('certification.text41'),
                  okFn: () => {
	                  this.getBank()
                  }
                })
              }
            })
          }
        })
      },
	    async changeFlag (e) {
		    // 上传图片
        let imgVal = this.$refs.uploadFile
        let imgObj = imgVal.files[0]
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!isType) {
	          this.$message.error(this.$t('bank.text23'))
            imgVal.value = ''
            return
          }
	        if (!isLt2M) {
		        this.$message.error(this.$t('certification.text45'))
		        imgVal.value = ''
		        return
	        }
        }
		    this.$store.commit('SET_LOADING', true)
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let formData = new FormData()
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              // let f = new File([this.result], imgObj.name)
              formData.append('myfile', self.$refs.uploadFile.files[0])
              formData.append('sourceType', 3)
              self.$fetch.postFormdata(`${self.$api}/upload/uploadimg`, formData).then((res) => {
	              self.$store.commit('SET_LOADING', false)
                if (res.success) {
	                self.imgtwo = result
                  self.imgTwoName = res.data[0].fileName
                }
                //  可上传重复的图片
                imgVal.value = ''
              }).catch((err) => {
                console.log(err)
                imgVal.value = ''
              })
            }
          }
        }

      },
	    checkBank (item) {
		    item.check = !item.check
      },
			getBank () {
				//
				this.$fetch.post('/bankinfo/queryBankInfoList', {
					pageIndex: 1, //	int	页码
					pageSize: 20 //	int	每页显示数
				}).then(res => {
					if (res.success) {
            this.bankList = res.data
          }else {

					}
				})
      },
      // 新增交易账户
	    addAccount () {
	    	// this.visible2 = true
		    this.clearInput()
		    this.visible = true
		    this.visible2 = false
		    this.userType = this.$t('setting.text23')
		    this.userType2 = this.$t('setting.text23')
		    this.bankType = 1
        this.userType2 = this.userType

		    this.currency = 'CNY'
      },
      // 法币订单通知设置
      setNoticeFn (type, index) {
	      // mailNotice	Integer	邮件通知 1 任何时候都接收 2 离线时接收 3 不接收
	      // smsNotice	Integer	短信通知 1 任何时候都接收 2 离线时接收 3 不接收
        let dataObj = {}
        if (type === 1) {
	        dataObj.mailNotice = index
        } else {
	        dataObj.smsNotice = index
        }
	      this.$store.commit('SET_LOADING', true)
	    	this.$fetch.post('/certification/setNotice', dataObj).then(res => {
			    this.$store.commit('SET_LOADING', false)
	    		if (res.success) {
				    this.$message.success(this.$t('bank.text24'))
				    this.$store.dispatch('getBalance')
          }
        })
      },
      commandChange (a) {
		    this.emailText = a.text
        this.setNoticeFn(1, a.index)
	    },
	    commandChange3 (a) {
        this.noteText = a.text
		    this.setNoticeFn(2, a.index)
      },
      // 选择账号类型
	    commandChange1 (a) {
	    	this.userType = a.text
        this.userType2 = a.text
		    this.bankType = a.id
      },
	    commandChange2 (a) {
		    this.userType2 = a.text
        this.bankType = a.id
      },
	    verifyFn () {
		    if (this.bankNumber === '') {
		    	if (this.bankType === 1) {
				    this.errMsg = this.$t('bank.text25')
          } else if (this.bankType === 2) {
				    this.errMsg = this.$t('bank.text26')
            this.currency = 'CNY'
          }
			    return false
		    }
		    let flag = 0
		    this.currencyArr = []
		    this.bankArr.forEach(item => {
			    if (item.check === false) {
				    flag++
			    }
			    if (item.check === true) {
				    this.currencyArr.push(item.currency)
          }
		    })

		    if (this.bankType === 1) {
			    if (this.realName === '') {
				    this.errMsg = this.$t('bank.text4')
				    return false
			    }
			    if (this.bankName === '') {
				    this.errMsg = this.$t('bank.text27')
				    return false
			    }
			    if (flag === this.bankArr.length) {
				    this.errMsg = this.$t('bank.text28')
				    return
			    }
        } else {
			    this.currency = 'CNY'
        }
		    this.currency = this.currencyArr.join(',')
        return  true
      },
	    okCallback () {
	    	if (this.verifyFn ()) {
			    this.$store.commit('SET_LOADING', true)
	    		if (this.editorId) {
	    			if (this.bankType === 2) {
					    this.currency = 'CNY'
            }
				    this.$fetch.post('/bankinfo/editBankInfo', {
				    	id: this.editorId,
					    bankType: this.bankType, //	Integer	1银行卡 2支付宝 3 微信
					    currency: this.currency, //		String	币种 多币种,分割
					    bankName: this.bankName, //		String	银行名称
					    subBankName: this.subBankName, //		String	支行名
					    realName: this.realName, //		String	银行卡户名
					    bankNumber: this.bankNumber, //		String	卡号
					    imgtwo: this.imgTwoName, //		String	第三方二维码收款地址
				    }).then(res => {
					    this.$store.commit('SET_LOADING', false)
					    if (res.success) {
                this.visible = false
                // 刷新用户银行卡
                this.$store.dispatch('getBankList')
						    Dialog({
							    msg:  this.$t('bank.text24'),
							    okFn: () => {
								    this.getBank()
							    }
						    })
					    }
				    })
          } else {
				    this.$fetch.post('/bankinfo/addBankInfo', {
					    bankType: this.bankType, //	Integer	1银行卡 2支付宝 3 微信
					    currency: this.currency, //		String	币种 多币种,分割
					    bankName: this.bankName, //		String	银行名称
					    subBankName: this.subBankName, //		String	支行名
					    realName: this.realName, //		String	银行卡户名
					    bankNumber: this.bankNumber, //		String	卡号
					    imgtwo: this.imgTwoName, //		String	第三方二维码收款地址
				    }).then(res => {
              this.$store.commit('SET_LOADING', false)
              // 刷新用户银行卡
              this.$store.dispatch('getBankList')
					    if (res.success) {
						    this.visible = false
						    Dialog({
							    msg: this.$t('bank.text29'),
							    okFn: () => {
								    this.getBank()
							    }
						    })
					    }
				    })
          }
        }
      },
       // 清空input框
      clearInput () {
	      this.bankName = '' //	String	银行名称
	      this.subBankName = '' //	String	支行名
	      this.realName = '' //	String	银行卡户名
	      this.bankNumber = '' //	String	卡号
	      this.imgtwo = '' //	String	第三方二维码收款地址
	      this.editorId = ''
	      this.isLoad = true
      },
	    cancelCallback () {
		    this.visible = false
        this.clearInput()
      },
	    okback2 () {
		    this.clearInput()
	    	this.visible = true
		    this.visible2 = false
        this.userType2 = this.userType
        this.currency = 'CNY'
      },
    }
	}
</script>

<style scoped lang="less">
  @import "../../../assets/css/dialog";

  .link-b-c{
    width: 100%;
    height: 40px;
    border: 1px solid #000;
  }
  .pop-w{
    width: 520px;
    .list-item{
      width: 520px;
      text-align: left;
      height: 40px;
    }
  }
  .menu-drop-a{
    background-color: #32323e;
    border: none;
    width: 520px;
    &.menu-drop-min{
      width: 160px;
      padding: 10px;
      /deep/ .popper__arrow{
        left: auto !important;
        right: 20px;
      }
    }
    /deep/ .el-dropdown-menu__item{
      color: #fff;
      font-size: 14px;
      border-top: 1px solid #41414f;
      &:nth-child(1){
        border-top: none;
      }
      &:hover{
        background-color: #32323e;
        color: #639cff;
      }
    }
    /deep/ .popper__arrow{
      border-bottom-color: #32323e !important;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.95));
      left: 20px !important;
      &::after{
        display: none;
      }
    }
  }
  .err-red{
    color: #ff415d;
    margin-bottom: 10px;
  }
  .upload-a, .file-add{
    cursor: pointer;
  }
  .img-box{
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }
  .bg-a{
    width: 120px;
    height: 120px;
    &.load-img{
      background: url("../../../assets/img/loading.gif") no-repeat center;
      background-size: 30px;
    }
    .img-a{
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      img{
        width: 100%;
        opacity: 0;
      }
    }
  }
  .input-file-a{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .input-currency{
    background-color: #2d2d37;
    border: 1px solid #32323e;
    color: #5F5E6C;
    padding-left: 10px;
  }
  .input-check{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: none;
    .list-a{
      display: flex;
      align-items: center;
      margin-right: 50px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      .check-a{
        margin-right: 10px;
        border: 1px solid #41414f;
        border-radius: 4px;
        width: 20px;
        height: 20px;
        background-color: #2d2d37;
        &.checked{
          background: url("../../../assets/img/menu/checked.png") no-repeat center / cover;
          border: none;
        }
      }
    }
  }
  .france-w{
    padding: 40px 30px;
    font-size: 14px;
    color: #fff;
    .cursor{
      cursor: pointer;
    }
    .blue-t{
      color: #639cff;
      cursor: pointer;
      margin-left: 30px;
    }
    .username{
      font-weight: bold;
      margin: 30px 0 12px;
    }
    .tips-t{
      font-size: 12px;
      color: #ccc;
      margin-bottom: 40px;
    }
    .table-a-1{
      margin-top: 20px;
    }
    .table-a{
      .table-head{
        height: 40px;
        line-height: 40px;
        background-color: #32323e;
        padding-left: 30px;
        font-weight: bold;
        color: #5f5e6c;
      }
      .flex-between{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 30px;
        border-bottom: 1px solid #41414f;
        font-size: 12px;
        .label-t{
          color: #ccc;
          font-size: 12px;
          display: flex;
          align-items: center;
          .zhifu-text{
            background-color: #4d62ff;
            padding: 3px;
            color: #fff;
            border-radius: 2px;
          }
          .bank-number{
            margin: 0 20px 0 10px;
          }
          .bank-text{
            background-color: #5F5E6C;
            padding: 3px;
            color: #fff;
            border-radius: 2px;
          }
        }
        .right-ctrl{
          display: flex;
          align-items: center;
          .btn-item{
            height: 60px;
            line-height: 60px;
            font-size: 12px;
            padding: 0 15px;
            cursor: pointer;
            color: #639cff;
            &:nth-child(2){
              color: #ff415d;
            }
          }
        }
      }
      .ctrl-flex{
        padding-right: 15px;
      }
      .dropdown-wrap{
        cursor: pointer;
      }
      .add-btn{
        height: 60px;
        line-height: 60px;
        padding-left: 88px;
        color: #639cff;
        font-size: 14px;
        border-bottom: 1px solid #41414f;
        margin-bottom: 40px;
        cursor: pointer;
      }
    }
  }
</style>
