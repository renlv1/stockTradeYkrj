<template>
  <div class="id-card-verify-w">
    <div class="title-h">{{$t('accountUser.text8')}}</div>
    <div class="username" v-if="allUserInfo && allUserInfo.user">Hi,{{allUserInfo.user.nickName}}</div>
<!--    未认证    -->
    <div   v-show="allUserInfo.isCertification !== 1">
      <div class="tips-t">{{$t('setting.text21')}}</div>
      <div class="input-a input-item-c">
        <div class="label">{{$t('certification.text1')}}</div>
        <input type="text" :placeholder="$t('certification.text2')" v-model.trim="realName">
      </div>
      <div class="input-a input-item-c">
        <div class="label">{{$t('certification.text3')}}</div>
        <input type="text" :placeholder="$t('certification.text4')" v-model.trim="idCarNumber">
      </div>
      <div class="form-wrap">
        <label>{{$t('certification.text5')}}</label>
        <!-- 上传身份证正面照 -->
        <div class="upload-wrap">
          <el-upload
                  class="upload-positive-img"
                  drag
                  :show-file-list="false"
                  :on-success="handlePositiveSuccess"
                  :on-progress="handlerPositiveProgress"
                  :before-upload="beforeUpload"
                  :http-request="uploadA"
                  :action="uploadHttp"
          >
            <div class="upload-img" v-if="imagePositionUrl" :style="`background-image: url(${imagePositionUrl});`"></div>
            <div v-else>
              <img class="icon-upload" src="@/views/advertising/images/positive-img.png" />
              <div class="el-upload__text">{{$t('certification.text6')}}</div>
            </div>
          </el-upload>
          <el-progress v-show="uploadProgressPositiveShow" :percentage="uploadPositiveProgress"></el-progress>
        </div>
        <!-- 上传身份证反面照 -->
        <div class="upload-wrap">
          <el-upload
                  class="upload-reverse-img"
                  drag
                  :show-file-list="false"
                  :on-success="handleReverseSuccess"
                  :on-progress="handlerReverseProgress"
                  :before-upload="beforeUpload"
                  :http-request="uploadB"
                  :action="uploadHttp"
          >
            <div class="upload-img" v-if="imageReverseUrl" :style="`background-image: url(${imageReverseUrl});`"></div>
            <div v-else>
              <img class="icon-upload" src="@/views/advertising/images/reverse-img.png" />
              <div class="el-upload__text">{{$t('certification.text7')}}</div>
            </div>
          </el-upload>
          <el-progress v-show="uploadProgressReverseShow" :percentage="uploadReverseProgress"></el-progress>
        </div>
      </div>
      <div class="label-c">
        <div class="label-m">{{$t('certification.text8')}}</div>
        <div class="tips-label">{{$t('certification.text9')}}<span class="blue-c">{{randomCode}}</span></div>
      </div>
      <div class="form-wrap cursor-form">
        <!-- 上传手持身份证照片 -->
        <div class="upload-wrap">
          <el-upload
                  class="upload-hold-img"
                  drag
                  :show-file-list="false"
                  :on-success="handleHoldSuccess"
                  :on-progress="handlerHoldProgress"
                  :before-upload="beforeUpload"
                  :action="uploadHttp"
                  :http-request="uploadC"
                  multiple>
            <div class="upload-img" v-if="imageHoldUrl" :style="`background-image: url(${imageHoldUrl});`"></div>
            <div v-else>
              <img class="icon-upload" src="@/views/advertising/images/hold-img.png" />
              <div class="el-upload__text">{{$t('certification.text10')}}</div>
            </div>
          </el-upload>
          <el-progress v-show="uploadProgressHoldShow" :percentage="uploadHoldProgress"></el-progress>
        </div>
        <!-- 手持身份证照片实例图 -->
        <img class="example-img" src="@img/menu/idCardAndHand.png" />
      </div>
      <div class="input-a">
        <div class="label">{{$t('certification.text11')}}</div>
        <div class="input-b-a">
          <div class="input-b">
            <input type="text" :placeholder="$t('certification.text12')" v-model.trim="nickName" @blur="nickNameBlur">
            <div class="icon" :class="blurCls"></div>
          </div>
          <div class="error-a-nick">{{errorNickName}}</div>
        </div>
      </div>
      <div class="tips-b">*{{$t('certification.text13')}}</div>
      <div class="input-a">
        <div class="label">{{$t('certification.text14')}}</div>
        <div class="input-flex">
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="commandChange" placement="top">
                            <span class="el-dropdown-link">
                              {{areaCode}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
              <el-dropdown-menu class="popover-a-s" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item,index) in  areaCodeArr" :key="index" class="code-item">{{item.code}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <input type="text" :placeholder="$t('certification.text15')" class="phone-number" v-model.trim="mobile">
        </div>
      </div>
      <div class="input-item input-send">
        <div class="label">{{$t('certification.text16')}}</div>
        <captcha v-model="verifyCode" :placeholder="placeholder" :email="email" :mobile="mobile" sendType="1" class="input-s-a" sendWay="1" ></captcha>
<!--        <div class="send-m">-->
<!--          <input type="text" placeholder="请输入短信验证码" v-model.trim="verifyCode">-->
<!--          <div class="send-a">获取</div>-->
<!--        </div>-->
      </div>
      <div class="error-a">{{errorTips}}</div>
      <div class="btn-ok" @click="submitFn">{{$t('certification.text17')}}</div>
    </div>
<!--     已认证-->
    <div class="table-a" v-if="$store.state.userCertification">
      <div class="table-head">{{$t('certification.text46')}}</div>
      <div class="flex-between">
        <span class="label-t">{{$t('certification.text47')}}</span>
        <span class="" v-if="allUserInfo && allUserInfo.user">{{allUserInfo.user.nickName}}</span>
      </div>
      <div class="flex-between">
        <span class="label-t">{{$t('accountUser.text30')}}</span>
        <span>+{{$store.state.userCertification.phoneCode}} {{$store.state.userCertification.mobile}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	import {mapState} from 'vuex'
	import Dialog from "@/components/dialog";
  const telcode = require('@/assets/js/telcode.json')
	import {compress, dataURItoBlob} from '@/assets/js/util'
	export default {
		data() {
			return {
				placeholder: this.$t('certification.text19'),
				errorNickName: '',
				blurCls: '',
				randomCode: '',
				email: this.$store.state.user.email,
				errorTips: '',
				idCarNumber: '',
				realName: '',
				nickName: '',
				verifyCode: '',
				mobile: '',
				uploadHttp: process.env.VUE_APP_BASE_PATH + '/upload/uploadimg',
				//上传身份证正面
				imagePositionUrl: '',
				imagePositionName: '',
				uploadPositiveProgress: 0,
				uploadProgressPositiveShow: false,

				//上传身份证反面
				imageReverseUrl: '',
				imageReverseName: '',
				uploadReverseProgress: 0,
				uploadProgressReverseShow: false,

				//手持身份证
				imageHoldUrl: '',
				imageHoldName: '',
				uploadHoldProgress: 0,
				uploadProgressHoldShow: false,

				verifyShow: true,
				areaCodeArr: telcode,
				areaCode: '86',
				visibleLang: false,
      }
		},
		computed: {
			...mapState([
				'allUserInfo'
			])
		},
    created () {
			this.getRandom()
    },
    methods: {
	    nickNameBlur () {
        this.errorNickName = ''
        if (this.nickName === '') return
        this.blurCls = 'el-icon-loading'
        this.$fetch.post('/certification/checkNickname', {
	        nickName: this.nickName
        }).then(res => {
        	if (res.success === true) {
		        this.errorNickName = this.$t('certification.text18')
		        this.blurCls = 'el-icon-circle-close'
          } else {
		        this.blurCls = 'el-icon-circle-check'
          }
        }).catch(err => {
	        this.blurCls = 'el-icon-circle-check'
        })
      },
			// 获取验证码
			getRandom () {
				// /certification/getVideoCode
        this.$fetch.post('/certification/getVideoCode').then(res => {
        	if (res.success) {
        		this.randomCode = res.data.creationCode
          }
        })
      },
			verifyFn () {
				if (this.realName === ''){
					this.errorTips = this.$t('certification.text2')
          return false
				}
				if (this.nickName === ''){
					this.errorTips = this.$t('certification.text12')
          return false
				}
				if (this.verifyCode === ''){
					this.errorTips = this.$t('certification.text19')
          return false
				}
				if (this.mobile === ''){
					this.errorTips = this.$t('certification.text15')
          return false
				}
				if (this.imagePositionUrl === '') {
					this.errorTips = this.$t('certification.text20')
					return false
				}
				if (this.imageReverseUrl === '') {
					this.errorTips = this.$t('certification.text21')
					return false
				}
				if (this.imageHoldUrl === '') {
					this.errorTips = this.$t('certification.text22')
					return false
				}
				if (this.idCarNumber === '') {
					this.errorTips = this.$t('certification.text23')
					return false
        }
				return true
      },
	    submitFn () {
        if (this.verifyFn()) {
	        this.$store.commit('SET_LOADING', true)
        	this.$fetch.post('/certification/applyUserCertification', {
		        mobile: this.mobile, //	string	手机号
		        phoneCode: this.areaCode, //		string	手机区号
		        verifyCode: this.verifyCode, //		string	短信验证码
		        nickName: this.nickName, //		string	昵称
		        realName: this.realName, //		string	真实姓名
		        idCarNumber: this.idCarNumber, //		string	身份证号码
		        idCarImageFront: this.imagePositionName, //		string	身份证正面照
		        idCarImageBack: this.imageReverseName, //		string	身份证背面照
		        idCarHandImage: this.imageHoldName, //		string	手持身份证照
          }).then(res => {
          	if (res.success) {
		          this.$store.commit('SET_LOADING', false)
              Dialog({
                msg: this.$t('certification.text24'),
                okFn: () => {
	                this.$store.dispatch('getBalance')
                	this.$router.push('/user/accountInfo')
                }
              })
            }
          })
        }
      },
	    uploadA (fileObj) {
		    let reader = new FileReader()
		    let self = this
		    reader.readAsDataURL(fileObj.file)
		    reader.onloadend = function () {
			    let result = this.result
			    let img = new Image()
			    img.src = result
			    img.onload = function () {
				    let data = compress(img)
				    let blob = dataURItoBlob(data)
				    let reader2 = new FileReader()
				    reader2.readAsArrayBuffer(blob)
				    reader2.onloadend = function () {
					    let formData = new FormData()
					    formData.append('myfile', fileObj.file)
					    formData.append('sourceType', '3')
					    self.$store.commit('SET_LOADING', true)
					    self.$fetch.postFormdata(`/upload/uploadimg`, formData).then((res) => {
						    if (res.success) {
							    self.imagePositionUrl = result
							    self.imagePositionName = res.data[0].fileName
						    } else {

						    }
						    self.$store.commit('SET_LOADING', false)
					    }).catch(err => {
					    })
            }
			    }
		    }
	    },
	    uploadB (fileObj) {
		    let reader = new FileReader()
		    let self = this
		    reader.readAsDataURL(fileObj.file)
		    reader.onloadend = function () {
			    let result = this.result
			    let img = new Image()
			    img.src = result
			    img.onload = function () {
				    let data = compress(img)
				    let blob = dataURItoBlob(data)
				    let reader2 = new FileReader()
				    reader2.readAsArrayBuffer(blob)
				    reader2.onloadend = function () {
					    let formData = new FormData()
					    formData.append('myfile', fileObj.file)
					    formData.append('sourceType', '3')
					    self.$store.commit('SET_LOADING', true)
					    self.$fetch.postFormdata(`/upload/uploadimg`, formData).then((res) => {
						    if (res.success) {
							    self.imageReverseUrl = result
							    self.imageReverseName = res.data[0].fileName
						    } else {

						    }
						    self.$store.commit('SET_LOADING', false)
					    }).catch(err => {
					    })
				    }
			    }
		    }
	    },
	    uploadC (fileObj) {
		    let reader = new FileReader()
		    let self = this
		    reader.readAsDataURL(fileObj.file)
		    reader.onloadend = function () {
			    let result = this.result
			    let img = new Image()
			    img.src = result
			    img.onload = function () {
				    let data = compress(img)
				    let blob = dataURItoBlob(data)
				    let reader2 = new FileReader()
				    reader2.readAsArrayBuffer(blob)
				    reader2.onloadend = function () {
					    let formData = new FormData()
					    formData.append('myfile', fileObj.file)
					    formData.append('sourceType', '3')
					    self.$store.commit('SET_LOADING', true)
					    self.$fetch.postFormdata(`/upload/uploadimg`, formData).then((res) => {
						    if (res.success) {
							    self.imageHoldUrl = result
							    self.imageHoldName = res.data[0].fileName
						    } else {

						    }
						    self.$store.commit('SET_LOADING', false)
					    }).catch(err => {
					    })
            }
			    }
		    }
	    },
	    //上传成功后(身份证正面)
	    handlePositiveSuccess(res, file) {
		    this.uploadProgressPositiveShow = false;
		    this.imagePositionUrl = URL.createObjectURL(file.raw);
	    },
	    //上传进度(身份证正面)
	    handlerPositiveProgress(event) {
		    this.uploadProgressPositiveShow = true;
		    this.uploadPositiveProgress = parseInt(event.percent);
	    },

	    //上传成功后(身份证反面)
	    handleReverseSuccess(res, file) {
		    this.uploadProgressReverseShow = false;
		    this.imageReverseUrl = URL.createObjectURL(file.raw);
	    },
	    //上传进度(身份证反面)
	    handlerReverseProgress(event) {
		    this.uploadProgressReverseShow = true;
		    this.uploadReverseProgress = parseInt(event.percent);
	    },

	    //上传成功后(手持身份证)
	    handleHoldSuccess(res, file) {
		    this.uploadProgressHoldShow = false;
		    this.imageHoldUrl = URL.createObjectURL(file.raw);
	    },
	    //上传进度(手持身份证)
	    handlerHoldProgress(event) {
		    this.uploadProgressHoldShow = true;
		    this.uploadHoldProgress = parseInt(event.percent);
	    },
	    //验证上传类型
	    beforeUpload(file) {
		    const isImage = file.type.includes('image');
		    if (!isImage) {
			    this.$message.error(this.$t('certification.text25'));
		    }
		    return isImage;
	    },

	    commandChange (item) {
        this.areaCode = item.code
      }
    }
	}
</script>

<style scoped lang="less">
.popover-a-s{
  height: 200px;
  overflow: auto;
  background-color: #32323e;
  border: 1px solid #32323e;
  overflow-x: hidden;
  /deep/ .popper__arrow{
    display: none;
  }
  .code-item{
    cursor: pointer;
    width: 100px;
    padding: 0 0 0 20px;
    line-height: 28px;
    font-size: 12px;
    &:hover{
      background-color: #32323e;
      color: #fff;
    }
  }
}
.link-b{
  width: 100%;
  line-height: 40px;
  text-align: center;
}
.id-card-verify-w{
  padding: 40px 30px 80px 30px;
  font-size: 14px;
  color: #fff;
  height: calc(100vh - 160px);
  overflow: auto;
  .cursor{
    cursor: pointer;
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
  input{
    width: 100%;
    height: 100%;
    border: 1px solid #323243;
    padding-left: 10px;
    color: #fff;
  }
  .input-b-a{
    display: flex;
    align-items: center;
    .error-a-nick{
      color: #ff415d;
      margin-left: 10px;
      font-size: 12px;
    }
    .icon{
      position: absolute;
      right: 10px;
      top: 13px;
    }
    .el-icon-circle-check{
      color: #4d62ff;
    }
    .el-icon-circle-close{
      color: #ff415d;
    }
  }
  .input-b{
    position: relative;
    display: flex;
    align-items: center;

  }
  .input-a{
    display: flex;
    align-items: center;
    input{
      width: 380px;
      height: 40px;
    }
  }
  .input-item-c{
    margin-bottom: 30px;
  }
  .label{
    width: 160px;
  }
  .tips-b{
    color: #639cff;
    margin: 16px 0 30px 160px;
  }
  .input-flex{
    width: 380px;
    display: flex;
    align-items: center;
    .phone-number{
      flex: 1;
      width: auto;
    }
  }
  .dropdown-wrap{
    width: 100px;
    height: 40px;
    border: 1px solid #41414f;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 0;
    margin-right: 20px;
    cursor: pointer;
    /deep/ .el-dropdown{
      width: 100%;
      height: 100%;
      padding: 0 10px;
      display: flex;
      align-items: center;
      color: #fff;
      .el-dropdown-link{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .el-icon-caret-bottom{
        color: #5F5E6B;
      }
    }
  }
  .input-send{
    border: none;
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 30px;
    .input-s-a{
      margin-bottom: 0;
      width: 380px;
    }
    .send-m{
      width: 380px;
      display: flex;
      align-items: center;
    }
    input{
      flex: 1;
      height: 40px;
      border: 1px solid #323243;
      color: #fff;
      padding-left: 10px;
    }
    .send-a{
      margin-left: 10px;
      width: 80px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 14px;
      color: #639cff;
      border: 1px solid #323243;
      cursor: pointer;
    }
  }
  .label-c{
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 16px;
    .label-m{
      width: 160px;
      color: #fff;
    }
    .tips-label{
      color: #ccc;
    }
    .blue-c{
      color: #639cff;
    }
  }
  .cursor-form{
    margin-left: 160px;
  }
  input {
    transition: all .3s linear;
    &:focus {
      border-color: #639CFF;
      box-shadow: 0 0 10px #639CFF;
    }
  }
  .form-wrap {
    display: flex;
    margin-bottom: 30px;
    input {
      border-radius: 4px;
      border: 1px solid #32323e;
      padding-left: 10px;
      height: 40px;
      width: 380px;
      color: #fff;
    }
    input::-webkit-input-placeholder {
      color: #606266;
    }
    input::-moz-placeholder {
      color: #606266;
    }
    input::-ms-input-placeholder {
      color: #606266;
    }
    label {
      margin-top: 10px;
      color: #fff;
      width: 160px;
    }
    .upload-wrap {
      display: flex;
      flex-direction: column;
    }
    .upload-positive-img, .upload-reverse-img, .upload-hold-img {
      position: relative;
      .icon-upload {
        margin: 40px 0 16px;
        line-height: 50px;
      }
      .upload-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    .upload-positive-img, .upload-hold-img {
      margin-right: 20px;
    }
    .upload-wrap{
      /deep/ .el-upload-dragger {
        background-color: #272730;
        width: 280px;
        border: 1px dashed #32323e;
        overflow: hidden;
      }

      /deep/ .el-upload-dragger:hover {
        border-color: #32323e;
      }

      /deep/ .el-upload:focus {
        border-color: #32323e;
        color: #32323e;
      }
    }
    .example-img {
      display: inline-block;
      width: 280px;
      height: 180px;
    }
  }
  .error-a{
    color: #ff415d;
    margin-top: 20px;
    margin-left: 160px;
  }
  .btn-ok{
    margin-left: 160px;
    margin-bottom: 100px;
    width: 380px;
    height: 40px;
    background-color: #4d62ff;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
      }
    }
  }
}
</style>
