<template>
  <div class="c-page">
    <div class="wrap wrap-content">
      <div class="content-title">
        <h3>Hi，{{$store.state.user.userName}}</h3>
        <div class="description">
          <img src="./images/error.png">
          <span>{{$t('unAuth.text1')}}</span>
        </div>
      </div>
      <div class="form">
        <div class="form-wrap">
          <label>{{$t('unAuth.text2')}}</label>
          <input v-model="userAddress" :placeholder="$t('unAuth.text3')" />
        </div>
        <div class="form-wrap">
          <label>{{$t('unAuth.text4')}}</label>
          <!-- 上传水电缴费证明或房产证明 -->
          <div class="upload-wrap">
            <p class="tips">{{$t('unAuth.text5')}}</p>
            <el-upload
              class="upload-positive-img"
              drag
              :show-file-list="false"
              :action="`${$api}/upload/uploadimg`"
              :on-change="handlerPositiveProgress"
              :before-upload="beforeUpload"
              :http-request="upload"
              accept="image/*"
            >
              <img v-if="imagePositionUrl" :src="imagePositionUrl" class="upload-img">
              <div v-else>
                <img class="icon-upload" src="./images/img.png" />
                <div class="el-upload__text">{{$t('unAuth.text6')}}</div>
              </div>
            </el-upload>
            <el-progress v-show="uploadProgressPositiveShow" :percentage="uploadPositiveProgress"></el-progress>
          </div>
        </div>
        <div class="form-wrap">
          <label>{{$t('unAuth.text7')}}</label>
          <!-- 上传身份视频认证 -->
          <div class="upload-wrap">
            <p class="tips" style="width: 70% !important;">{{$t('unAuth.text8')}}</p>
            <div style="display: flex">
              <div>
                <el-upload
                  class="upload-hold-img"
                  drag
                  :show-file-list="false"
                  :on-change="handlerHoldProgress"
                  :before-upload="beforeUploadVideo"
                  :action="`${$api}/upload/uploadimg`"
                  accept="video/*"
                  :http-request="uploadVideo"
                  multiple>
                  <video v-if="imageHoldUrl" :src="imageHoldUrl" class="upload-img"></video>
                  <div v-else>
                    <img class="icon-upload" src="./images/hold-img.png" />
                    <div class="el-upload__text">{{$t('unAuth.text9')}}</div>
                  </div>
                </el-upload>
                <el-progress v-show="uploadProgressHoldShow" :percentage="uploadHoldProgress"></el-progress>
              </div>
              <!-- 手持身份证照片实例图 -->
              <div class="example">
                <img class="example-img" src="./images/example-img.png" />
                <p class="example-text">*{{$t('unAuth.text10')}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="form-wrap">
          <label class="label">{{$t('unAuth.text11')}}</label>
          <p class="tips">{{$t('unAuth.text12')}}{{$store.state.allUserInfo.bondLimit}}USDT</p>
        </div>
        <button class="submit" @click="submit" :disabled="!btnDisable" :class="{'isDisable': !btnDisable}">{{$t('unAuth.text17')}}
        </button>
      </div>
    </div>
    <pay-dialog ref="payDialog" @submit="payConfirm" :visible.sync="isShow"/>
  </div>
</template>

<script>
export default {
  name: "unAuth",
  data() {
    return {
      userAddress: '',

      //上传居住地址
      imagePositionUrl: '',
      fileNameImagePosition: '',
      uploadPositiveProgress: 0,
      uploadProgressPositiveShow: false,

      //身份视频认证
      imageHoldUrl: '',
      fileNameImageHoldUrl: '',
      uploadHoldProgress: 0,
      uploadProgressHoldShow: false,

      isShow: false
    }
  },
  computed: {
    btnDisable() {
      if (this.userAddress && this.imagePositionUrl && this.imageHoldUrl) {
        return true;
      }
      return false
    }
  },
  mounted() {
  },
  methods: {
    //上传进度(住宅证明)
    handlerPositiveProgress(file) {
      this.uploadPositiveProgress = 0; //防止重复上传 进度条为上一次的值
      if (file.status === 'ready' && file.raw.type.includes('image')) {
        this.uploadProgressPositiveShow = true;
        const interval = setInterval(() => {
          if (this.uploadPositiveProgress >= 99) {
            clearInterval(interval);
            return;
          }
          this.uploadPositiveProgress++
        }, 17)
      }
    },
    //上传成功后(住宅证明)
    upload(content) {
      let formData = new FormData();
      formData.append('myfile', content.file);
      formData.append('sourceType', 3);
      this.$fetch.postFormdata(content.action, formData).then(res => {
        this.imagePositionUrl = res.data[0].fileUrl;
        // 不带域名
        this.fileNameImagePosition = res.data[0].fileName;
        this.uploadPositiveProgress = 100;
        this.uploadProgressPositiveShow = false;
      }).catch(err => {
        console.log(err)
      })
    },
    //验证上传类型(住宅证明)
    beforeUpload(file) {
      const isImage = file.type.includes('image');
      if (!isImage) {
        this.$message.error(this.$t('unAuth.text13'));
      }
      return isImage;
    },

    //上传进度(身份视频认证)
    handlerHoldProgress(file) {
      this.uploadHoldProgress = 0; //防止重复上传 进度条为上一次的值
      if (file.status === 'ready' && file.raw.type.includes('video')) {
        this.uploadProgressHoldShow = true;
        const interval = setInterval(() => {
          if (this.uploadHoldProgress >= 99) {
            clearInterval(interval);
            return;
          }
          this.uploadHoldProgress++
        }, 17)
      }
    },
    //上传成功后(身份视频认证)
    uploadVideo(content) {
      let formData = new FormData();
      formData.append('myfile', content.file);
      formData.append('sourceType', 3);
      this.$fetch.postFormdata(content.action, formData).then(res => {
        this.imageHoldUrl = res.data[0].fileUrl;
        this.fileNameImageHoldUrl = res.data[0].fileName;
        this.uploadHoldProgress = 100;
        this.uploadProgressHoldShow = false;
      }).catch(err => {
        console.log(err)
      })
    },
    //验证上传类型(身份视频认证)
    beforeUploadVideo(file) {
      const isVideo = file.type.includes('video');
      if (!isVideo) {
        this.$message.error(this.$t('unAuth.text14'));
      }
      return isVideo;
    },

    submit() {
      // 需要绑定谷歌验证码或手机验证码
      if (this.$store.state.user.openTradePassword === 2 && (this.$store.state.user.openGoogleCode === 2 || this.$store.state.user.openMobileCode === 2)) {
        this.isShow = true;
      } else {
        this.$message.error(this.$t('unAuth.text15'))
      }
    },
    payConfirm(p1, p2) {
      this.$fetch.post('/business/doBusinessMan', {
        tradePwd: p1,
        code: p2,
        homeAddress: this.userAddress,
        addressImage: this.fileNameImagePosition,
        creationVideo: this.fileNameImageHoldUrl
      }).then((res) => {
        if (res.success) {
          this.isShow = false;
          this.$store.dispatch('getBalance');
          this.$message.success(this.$t('unAuth.text16'));
          setTimeout(() => {
            this.$router.push(`/advertising/auth`)
          }, 20);
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrap-content {
    width 1400px
    min-width 1080
    margin 30px auto
    @media screen and (max-width: 1600px) {
      width 80%
    }
  }

  .wrap {
    font-size 15px
    .content-title h3 {
      color #fff
    }
    .content-title::after {
      display inline-block
      margin-top 20px
      content ""
      color #fff
      height 1px
      width 100%
      background-color #32323e
    }
    .content-title > .description {
      margin-top 12px
      span {
        font-size 12px
        margin-left 6px
        vertical-align top
      }
    }
    .form {
      margin-top 30px
      font-size 14px
      .form-wrap {
        display flex
        margin-bottom 30px
        input {
          border-radius 4px
          border 1px solid #32323e
          padding-left 10px
          height 40px
          width 380px
          color #fff
        }
        input:
        :-webkit-input-placeholder {
          color: #606266;
        }
        input:
        :-moz-placeholder {
          color: #606266;
        }
        input:
        :-ms-input-placeholder {
          color: #606266;
        }
        label {
          color #fff
          width 160px
        }
        .label, p {
          margin-top 0
          color #fff
          width 160px
        }
        p {
          width auto !important
        }
        .upload-wrap {
          display flex
          flex-direction column
        }
        .upload-positive-img, .upload-reverse-img, .upload-hold-img {
          position relative
          .icon-upload {
            margin: 40px 0 16px;
            line-height: 50px;
          }
          .upload-img {
            max-height 170px
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%);
          }
        }
        .tips {
          color #ccc
          margin-bottom 16px
        }
        .upload-positive-img, .upload-hold-img {
          margin-right 20px
        }
        .example {
          .example-img {
            display inline-block
            height 140px
            margin-bottom 10px
          }
          .example-text {
            text-align center
            color #ccc
          }
        }
      }
      .submit {
        margin-top 30px
        width 380px
        margin-left 160px
        height 40px
        line-height 40px
        border-radius 4px
        background-color #4d62ff
        color #fff
        text-align center
        cursor pointer
      }
      .isDisable {
        background-color #41414f
        color #aaa
        cursor not-allowed
      }
    }
  }
</style>
<style scoped>
  >>> .el-upload-dragger {
    background-color: #272730;
    width: 280px;
    height: 170px;
    border: 1px dashed #32323e;
    overflow: hidden;
  }

  >>> .el-upload-dragger:hover {
    border-color: #32323e;
  }

  >>> .el-upload:focus {
    border-color: #32323e;
    color: #32323e;
  }
</style>
