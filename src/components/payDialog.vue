<template>
  <el-dialog class="pay-dialog" :title="title" :close-on-click-modal="false" @close="close" :visible="visible">
    <!-- <div class="d-tit" v-if="type == 2">
      <h3>用户验证</h3>
      <p style="font-size: 13px; padding-top: 20px;">您需要在操作您的交易账户前进行用户验证</p>
    </div>
    <div class="d-tit" v-else>支付验证</div> -->
    <template v-if="$store.state.user.openTradePassword === 2 && $store.state.user.openGoogleCode === 2">
      <div @keyup.enter="submit">
        <div class="input-wrap">
          <div class="label">{{$t('common.payDialog.text1')}}</div>
          <input class="input" type="password" v-model="payPassword" :placeholder="$t('common.payDialog.text2')" autocomplete="new-password">
        </div>
        <div class="input-wrap" v-if="$store.state.user.openGoogleCode === 2">
          <div class="label">{{$t('common.payDialog.text3')}}</div>
          <input class="input" type="tel" v-model="payCode" :placeholder="$t('common.payDialog.text4')" >
        </div>
        <div class="input-wrap" v-else-if="$store.state.user.openMobileCode === 2">
          <div class="label">{{$t('common.payDialog.text5')}}</div>
          <div style="position: relative;">
            <captcha class="send"></captcha>
            <input type="text" v-model="payCode" :placeholder="$t('common.payDialog.text6')" >
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn cancel" @click="cancel">{{$t('common.payDialog.text7')}}</div>
        <button @click="submit" :disabled="disabled" class="btn" :class="{'disabled-btn': disabled}">{{$t('common.payDialog.text8')}}</button>
      </div>
    </template>
    <div v-else style="padding: 0 0 40px 0">
      <p class="bind-tips">{{$t('common.payDialog.text9')}}<br>{{$t('common.payDialog.text10')}}</p>
      <div class="btn auto" @click="$router.push('/user/accountInfo')">{{$t('common.payDialog.text11')}}</div>

    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      showDialog: false,
      payPassword: '',
      payCode: ''
    }
  },
  props: {
    type: String,
    visible: Boolean,
    title: {
      type: String,
      default: function () {
        return this.$t('common.payDialog.text12')
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.payPassword = ''
        this.payCode = ''
      }
    }
  },
  computed: {
    disabled () {
      return !this.payPassword || !this.payCode
    }
  },
  methods: {
    submit () {
      if (this.disabled) return
      this.$emit('submit', this.payPassword, this.payCode)
    },
    cancel () {
      this.close();
      this.$emit('cancel')
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.btns{
  display: flex;
  justify-content: center;
  padding: 20px 0 40px;
  .btn{
    margin: 0;
    flex: 1;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:nth-child(1) {
      border: 1px solid #d6d6d6;
      color: #1c1c1c;
      margin-right: 20px;
    }
    &:nth-child(2) {
      background-color: #1c1c1c;
      color: #fff;
      &.disabled-btn{
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
}
.btn.auto{
  width: 100%;
  height: 40px;
  background-color: #1c1c1c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
}
.bind-tips{
  text-align: center;
  color: #1c1c1c;
  font-size: 16px;
}
</style>
<style lang="less">
.pay-dialog{
  /deep/ .el-dialog__title{
    text-align: center;
    width: 100%;
    display: block;
  }
  .el-dialog{
    width: 440px;
    padding-top: 10px;
    border-radius: 10px;
  }
  .el-dialog__header{
    padding: 20px 40px 0;
  }
  .el-dialog__headerbtn{
    top: 30px;
    right: 34px;
  }
  .el-dialog__body{
    padding: 40px 40px 0 40px;
  }
}
</style>
