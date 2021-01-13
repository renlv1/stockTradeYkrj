<template>
  <div class="bank-info">
    <div class="bank-type" :class="{diff: bank.bankType === 2}">{{bank.bankType === 1 ? $t('common.payDialog.text20') : $t('chat.text15')}}</div>
    <p>{{bank.realName}}</p>
    <p v-if="bank.bankType === 1">{{bank.bankName}}</p>
    <p>{{bank.subBankName}}</p>
    <p>{{bank.bankNumber}}</p>
    <span class="cblue pointer" v-if="bank.imgtwo && showCode !== false" @click="$previewImg(bank.imgtwo)">{{$t('common.payDialog.text21')}}</span>
    <div class="cblue pointer" style="margin-left:30px;" v-if="showCopy !== false" v-clipboard:success="() => $message.success($t('common.payDialog.text22'))" v-clipboard:copy="`${bank.bankName} ${bank.subBankName || ''} ${bank.realName} ${bank.bankNumber}`"><i class="el-icon-document-copy"></i> {{$t('common.payDialog.text23')}}</div>
  </div>
</template>

<script>
export default {
  props: {
    bank: Object,
    showCopy: {
      type: [String, Boolean],
      default: false
    },
    showCode: {
      type: [String, Boolean],
      default: false
    }
  },
}
</script>

<style lang="less" scopd>
.bank-info{
  display: flex;
  align-items: center;
  line-height: 1;
  flex-wrap: wrap;
  .bank-type{
    background: #5f5e6c;
    color: #fff;
    padding: 3px 6px;
    border-radius: 2px;
    font-size: 12px;
    &.diff{
      background: @blueBtn;
    }
  }
  > * {
    margin-right: 10px;
    &:empty{
      display: none;
    }
  }
}
</style>