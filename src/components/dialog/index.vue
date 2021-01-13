<template>
  <transition name="dialog">
    <div class="g-dialog" v-if="visible">
      <div class="g-dialog-mask"></div>

      <div class="g-dialog-wrap content-wrap">
        <div class="top-a">
          <i class="g-dialog-close" @click="visible = false">
            <img src="@img/menu/close.png" alt="">
          </i>
        </div>
        <div class="g-dialog-title">{{title}}</div>
        <div class="dialog-cont2" v-html="msg"></div>
        <div class="g-dialog-btn-wrap">
          <button class="g-dialog-btn g-dialog-cancel" @click="cancelCallback" v-if="type !== 'alert'">{{cancelText}}</button>
          <button class="g-dialog-btn g-dialog-ok" @click="okCallback" >{{okText}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  props: {
    // btn: boolean,
    contentTitle: String,
    content: String,
    type: String,
    title: String,
    msg: String,
    okFn: Function,
    okText: String,
    cancelFn: Function,
    cancelText: String,
    align: String
  },
  methods: {
    okCallback () {
      this.visible = false
      this.okFn && this.okFn()
    },
    cancelCallback() {
      this.visible = false
      this.cancelFn && this.cancelFn()
    }
  }
}
</script>

<style lang="less" scoped>
  @btnColor: #1c1c1c;
  @btnCancel: #fff;
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
    /deep/ .text-left{
      text-align: left;
    }
    .content-wrap {
      padding: 30px !important;
      border-radius: 6px;
      background-color: #fff;
      @media screen and (max-width:1400px) {
        padding: 30px !important;
      }
      .g-dialog-content{
        color: #000;
        margin-bottom: 60px;
      }
    }
    .g-dialog-title{
      font-size: 16px;
      font-weight: bold;
      line-height: 18px;
      text-align: center;
      margin-bottom: 0;
      .el-icon{
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
      width: 380px;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
      @media screen and (max-width:1200px) {
        width: 80%;
      }
    }
    &-close {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 34px;
      cursor: pointer;
    }
    &-title {
      font-size: 24px;
      line-height: 1;
    }
    &-btn-wrap {
      text-align: center;
      display: flex;
      justify-content: flex-end;
    }
    &-btn {
      display: inline-block;
      height: 34px;
      cursor: pointer;
      font-size: 14px;
      color: #fff;
      border-radius: 4px;
      background-color: #fff;
      &:nth-child(2) {
        margin-left: 20px;
      }
    }
    &-ok {
      flex: 1;
      background: @btnColor;
      transition: .4s;
      &:hover {
        background: darken(@btnColor, 10%);
      }
    }
    &-cancel {
      flex: 1;
      background-color: @btnCancel;
      border: none;
      color: #fff;
      & + button {
        width: 100px;
      }
    }



  }
  .dialog-cont2{
    margin: 30px 0 50px;
    text-align: center;
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
