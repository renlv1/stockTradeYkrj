<template>
  <div class="c-page">
    <div class="wrap wrap-content">
      <div class="nav pointer" @click="$router.go(-1)">
        <div class="back">
          <img src="./images/back.png" />
          <p>返回</p>
        </div>
        <h5>广告详情</h5>
      </div>
      <div class="form-wrap">
        <div class="form-item">
          <label>广告编号</label>
          <p>94545121</p>
        </div>
        <div class="form-item">
          <label>广告状态</label>
          <p>已上架</p>
        </div>
        <div class="form-item">
          <label>接单时间</label>
          <div style="display: flex; align-items: center">
            <p style="margin-right: 20px">在非指定时间内启用自动暂停接单功能</p>
            <el-switch
              v-model="open"
              disabled
              active-color="#16dd9f"
              inactive-color="#32323e">
            </el-switch>
          </div>
        </div>
        <div class="form-item">
          <label>剩余数量/交易数量</label>
          <p>500.000USDT/1800.000USDT</p>
        </div>
        <div class="form-item">
          <label>交易价格</label>
          <p>1.055CNY</p>
        </div>
        <div class="form-item">
          <label>单笔交易金额限制</label>
          <p>1.055CNY-5000.000CNY</p>
        </div>
        <div class="form-item">
          <label>收款方式</label>
          <div>
            <span>银行卡</span>
            <span>KingMao 招商银行 东湖支行 565456478454</span>
          </div>
        </div>
        <div class="form-item">
          <label>收款时限</label>
          <div>
            <p>需要在30分钟内完成付款</p>
            <p class="tips">*超过时限未支付将会取消订单</p>
          </div>
        </div>
        <div class="form-item">
          <label>接单时间</label>
          <p>10:00-20:00 开始接单</p>
        </div>
        <div class="form-item">
          <label>交易备注</label>
          <p>请务在转账备注填写任何相关信息</p>
        </div>
        <div class="form-item">
          <label>自动回复</label>
          <p>请务在转账备注填写任何相关信息</p>
        </div>
        <div class="form-item">
          <label>广告预扣费用</label>
          <div>
            <p>5000.0000USDT</p>
            <p class="tips">支付完成后，系统将自动为您上架广告</p>
          </div>
        </div>
        <div class="form-item">
          <div class="btn-wrap">
            <button class="operation">下架广告</button>
            <button class="edit" @click="$router.push({
             path: '/advertising/releaseAd',
             query: {
               id: 100,
             }
            })">编辑广告</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "adDetail",
  data() {
    return {
      open: true,
    }
  },
  methods: {
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
    .nav {
      .back {
        display flex
        color #639cff
        img {
          margin-right 6px
        }
      }
      h5 {
        font-size 14px
        margin-bottom 15px
        color #fff
      }
    }
    .nav::after {
      content ""
      display inline-block
      height 1px
      width 100%
      background-color #32323e
    }
    .form-wrap {
      margin-top 30px
      .form-item {
        display flex
        margin-bottom 30px
        line-height 1
        font-size 14px
        label {
          width 160px
        }
        .tips {
          color #639cff
          margin-top 10px
        }
        .btn-wrap {
          margin-left 160px
          button {
            height 40px
            color #fff
            width 300px
            line-height 40px
            text-align center
            border-radius 4px
            margin-top 20px
            cursor pointer
          }
          .operation {
            background-color #32323e
            margin-right 20px
          }
          .edit{
            background-color #639cff
          }
        }
      }
    }
  }
</style>
