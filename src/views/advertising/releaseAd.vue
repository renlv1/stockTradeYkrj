<template>
  <div class="c-page">
    <div class="wrap wrap-content">
      <div class="nav">
        <div class="back pointer" style="display: inline-block" @click="$router.go(-1)">
          <img src="./images/back.png" />
          <span>{{$t('releaseAd.text1')}}</span>
        </div>
        <h5>{{$route.query.flag == 1 ? $t('releaseAd.text2') : ($route.query.id ? $t('releaseAd.text3') : $t('releaseAd.text4'))}}</h5>
      </div>
      <div class="form-wrap">
        <div class="form-item">
          <label>{{$t('releaseAd.text5')}}</label>
          <div class="form-item-right">
            <el-select :disabled="Boolean(id)" style="width: 160px" v-model="sellTypeValue">
              <el-option
                v-for="item in sellTypeOptions.filter(value => value !== sellTypeValue)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <div class="segment"></div>

            <!-- 买入 -->
            <input v-if="type === 1" :disabled="(Boolean(id) && Boolean(!$route.query.flag))" :class="{'isDisableInput': (Boolean(id) && Boolean(!$route.query.flag))}"
                   class="input-large-size"
                   v-model="amount" :placeholder="`${$t('releaseAd.text6')}${$store.state.allUserInfo.usableBond}`" />
            <!-- 卖出 -->
            <input v-if="type !== 1 && $store.state.allUserInfo.userAccount" :disabled="(Boolean(id) && Boolean(!$route.query.flag))" :class="{'isDisableInput': (Boolean(id) && Boolean(!$route.query.flag))}" class="input-large-size"
                   v-model="amount"
                   :placeholder="`${$t('releaseAd.text6')}${$store.state.allUserInfo.userAccount.USDT.balance}`" />


            <div class="segment"></div>
            <el-select disabled style="width: 160px" v-model="currencyValue" :placeholder="$t('releaseAd.text7')">
              <el-option
                v-for="item in currencyOptions.filter(value => value !== currencyValue)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-item">
          <label>{{$t('releaseAd.text8')}}</label>
          <div class="form-item-right">
            <!-- CNY买入 -->
            <input v-if="type === 1 && tranCurrency === 'CNY'" class="input-large-size" v-model="price"
                   :placeholder="`${$t('releaseAd.text8')}${$store.state.allUserInfo.drawPriceCny}`" />
            <!-- CNY卖出 -->
            <input v-if="type === 2 && tranCurrency === 'CNY'" class="input-large-size" v-model="price"
                   :placeholder="`${$t('releaseAd.text8')}${$store.state.allUserInfo.depositPriceCny}`" />
            <!-- USDT买入 -->
            <input v-if="type === 1 && tranCurrency === 'USD'" class="input-large-size" v-model="price"
                   :placeholder="`${$t('releaseAd.text8')}${$store.state.allUserInfo.drawPrice}`" />
            <!-- USDT卖出 -->
            <input v-if="type === 2 && tranCurrency === 'USD'" class="input-large-size" v-model="price"
                   :placeholder="`${$t('releaseAd.text8')}${$store.state.allUserInfo.depositPrice}`" />

            <div class="segment"></div>
            <el-select style="width: 160px" v-model="tranCurrency" placeholder="请选择" @change="change" :disabled="(Boolean(id) && Boolean(!$route.query.flag))">
              <el-option
                v-for="item in currencyOptions.filter(value => value !== tranCurrency)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-item">
          <label>{{$t('releaseAd.text9')}}</label>
          <div class="form-item-right">
            <div class="input-wrap">
              <input class="input-large-size" v-model="adviceMinPrice"
                     :placeholder="`${$t('releaseAd.text10')}(${$t('releaseAd.text11')}${getMinTotal}USDT)`" />
              <span>USDT</span>
            </div>
            <p style="margin: 10px 20px 0">{{$t('releaseAd.text12')}}</p>
            <div class="input-wrap">
              <input class="input-large-size" v-model="adviceMaxPrice"
                     :placeholder="$t('releaseAd.text13')" />
              <span>USDT</span>
            </div>
          </div>
        </div>
        <div class="form-item">
          <label>{{$t('releaseAd.text14')}}</label>
          <div class="form-item-right" style="flex: 1;  margin-top: -10px">
            <!-- 收款方式不为空 -->
            <ul class="pay-type-list" v-if="payList.length !== 0">
              <li @click="choosePayItem(item, index)" v-for="(item, index) in payList" :key="item.index"
                  :class="{'active': item.checked}">
                <div class="pay-type-wrap">
                  <!-- 银行卡 -->
                  <div class="pay-type" v-if="item.bankType === 1">
                    <span style="background-color: #5f5e6c">{{$t('releaseAd.text15')}} </span>
                    <p>{{item.userName}} {{item.bankName}} {{item.subBankName}} {{item.bankRealNumber}}</p>
                  </div>

                  <!-- 支付宝 -->
                  <div class="pay-type" v-else-if="item.bankType === 2">
                    <span style="background-color: #639cff">{{$t('releaseAd.text16')}} </span>
                    <p>{{item.realName}} {{item.bankNumber}}</p>
                    <div class="er-code-wrap" v-show="item.imgtwo !== ''">
                      <img class="er-code-icon" src="./images/er-code.png" />
                      <img class="er-code" :src="item.imgtwo" />
                    </div>
                  </div>

                  <!-- 微信 -->
                  <div class="pay-type" v-else>
                    <span style="background-color: #639cff">{{$t('releaseAd.text17')}} </span>
                    <p>{{item.bankName}} {{item.bankNumber}}</p>

                    <div class="er-code-wrap" v-show="item.imgtwo !== ''">
                      <img class="er-code-icon" src="./images/er-code.png" />
                      <img class="er-code" :src="item.imgtwo" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- 收款方式为空 -->
            <div style="margin-top: 15px" v-else>
              {{$t('releaseAd.text18')}} <a style="color: #639cff; text-decoration: underline" href="/#/user/france">{{$t('releaseAd.text19')}}</a>
            </div>
          </div>
        </div>
        <div class="form-item">
          <label>{{$t('releaseAd.text20')}}</label>
          <div class="form-item-right" style="display: flex; flex-direction: column;">
            <div class="input-wrap" style="margin-bottom: 0">
              <input class="input-large-size" v-model="payTime" @input="checkTime(payTime)" :placeholder="$t('releaseAd.text21')" />
              <span>{{$t('releaseAd.text22')}}</span>
            </div>
            <p class="errorTips" v-show="showErrorText">{{$t('releaseAd.text21')}}</p>
            <p class="tips">*{{$t('releaseAd.text23')}}</p>
          </div>
        </div>
        <div class="form-item">
          <label style="margin-top: 0">{{$t('releaseAd.text24')}}</label>
          <div class="form-item-right" style="display: flex; flex-direction: column">
            <div>
              <span style="margin-right: 20px">{{$t('releaseAd.text25')}}</span>
              <el-switch
                @change="changeSwitch"
                v-model="open"
                active-color="#16dd9f"
                inactive-color="#32323e">
              </el-switch>
            </div>
            <div class="time-picker-wrap">
              <!--:picker-options="{-->
              <!--selectableRange: `'00:00:00' - (${endTime} ? ${endTime + ':00'} : '23:59:59')`-->
              <!--}"-->
              <el-time-picker
                style="width: 160px; color: #ccc;"
                value-format="HH:mm"
                v-model="startTime"
                :disabled="!open"
                format="HH:mm"
                :placeholder="$t('releaseAd.text26')">
              </el-time-picker>
              <span style="margin: 0 20px">{{$t('releaseAd.text12')}}</span>
              <!--:picker-options="{-->
              <!--selectableRange: `(${startTime} ? ${startTime + ':00'} : '00:00:00') - 23:59:59`-->
              <!--}"-->
              <el-time-picker
                style="width: 160px"
                :disabled="!open"
                value-format="HH:mm"
                v-model="endTime"
                format="HH:mm"
                :placeholder="$t('releaseAd.text26')">
              </el-time-picker>
            </div>
          </div>
        </div>
        <div class="form-item">
          <label>{{$t('releaseAd.text27')}}</label>
          <div class="form-item-right textarea-wrap" style="flex: .8; position: relative">
            <textarea v-model="tradeRemark" maxlength="200" :placeholder="$t('releaseAd.text28')" />
            <span class="textareaTextTip">{{tradeRemark.length}}/200</span>
          </div>
        </div>
        <div class="form-item">
          <label>{{$t('releaseAd.text29')}}</label>
          <div class="form-item-right textarea-wrap" style="flex: .8; position: relative">
            <textarea v-model="autoReply" maxlength="200" :placeholder="$t('releaseAd.text28')" />
            <span class="textareaTextTip">{{autoReply.length}}/200</span>
          </div>
        </div>
        <div class="form-item">
          <label style="margin-top: 0">{{$t('releaseAd.text30')}}</label>
          <div class="form-item-right" style="display: flex; flex-direction: column">
            <p>{{amount || 0}} USDT</p>
            <p class="tips">{{$t('releaseAd.text31')}}</p>
          </div>
        </div>

        <div class="form-item">
          <button class="submit" @click="submit" :disabled="!btnDisable" :class="{'isDisable': !btnDisable}">
            {{$route.query.flag == 1 ? $t('releaseAd.text2') : $t('releaseAd.text32')}}
          </button>
        </div>
      </div>
    </div>
    <pay-dialog ref="payDialog" @submit="payConfirm" :visible.sync="isShow" />
  </div>
</template>

<script>
export default {
  name: "releaseAd",
  data() {
    return {
      female: false,
      showErrorText: false,

      sellTypeValue: this.$t('releaseAd.text33'),
      sellTypeOptions: this.$t('releaseAd.arr1'),

      orderCode: '',
      amount: '',
      price: '',
      adviceMinPrice: '',
      adviceMaxPrice: '',
      payTime: '',
      open: false,
      startTime: '',
      endTime: '',
      tradeRemark: '',
      autoReply: '',

      currencyValue: 'USDT',

      tranCurrency: 'CNY',
      currencyOptions: ['USD', 'CNY'],

      currentIndex: 0,
      payList: [], //支付方式

      isShow: false,

      testValue: null
    }
  },
  mounted() {
    this.getPayList(); //获取支付收款方式
    if (this.id) {
      this.getDetail()
    }
  },
  computed: {
    btnDisable() {
      if (this.amount && this.price && this.adviceMinPrice && this.adviceMaxPrice && this.bankIdList.length !== 0 && this.payTime && this.open && this.startTime && this.endTime) {
        return true
      }
      if (this.amount && this.price && this.adviceMinPrice && this.adviceMaxPrice && this.bankIdList.length !== 0 && !this.open && this.payTime) {
        return true;
      }
      return false;
    },
    id() { //广告id
      return this.$route.query.id
    },

    type() { //交易类型(1买入，2卖出)
      return this.sellTypeValue === this.$t('releaseAd.text33') ? 2 : 1
    },
    getMinTotal() {
      let minTotal = this.$store.state.allUserInfo.minTotal;
      if (minTotal) {
        minTotal = JSON.parse(minTotal).USDT
      }
      return minTotal || 0
    },
    bond() {
      let businessman = this.$store.state.allUserInfo.businessman;
      let bond = 0;
      if (businessman) {
        bond = businessman.bond
      }
      return bond;
    },
    bankIdList() {
      let arr = [];
      this.payList.filter(item => item.checked).forEach((item) => {
        arr.push(item.id)
      });
      return arr;
    }
  },
  methods: {

    checkTime(value) {
      if (value) {
        var reg = /^\+?[1-9]\d*$/g;
        if (!reg.test(this.payTime)) {
          this.payTime = String(value).slice(0, -1);
        }
      } else {
        this.payTime = ''
      }
      if (value < 15 || value > 30) {
        this.showErrorText = true
      } else {
        this.showErrorText = false
      }
    },
    getDetail() { //广告详情
      this.$fetch.post('/orders/queryOrderDetail', {
        serviceOrderId: this.id
      }).then((res) => {
        this.amount = res.data.tradeTotal;
        this.price = res.data.rate;
        this.adviceMinPrice = res.data.minTotal;
        this.adviceMaxPrice = res.data.maxTotal;
        this.payTime = res.data.payLimit;

        if (this.$route.query.flag == 1) {
          this.orderCode = res.data.orderCode;
        }

        this.open = res.data.serviceDateStatus == 1;
        if (this.open) {
          this.startTime = res.data.serviceStart.slice(0, 2) + ':' + res.data.serviceStart.slice(2, 4);
          this.endTime = res.data.serviceEnd.slice(0, 2) + ':' + res.data.serviceEnd.slice(2, 4);
        }

        this.tradeRemark = res.data.tradeRemark || '';
        this.autoReply = res.data.autoReply || '';
        let payJson = res.data.payJson;
        if (payJson) {
          let arr = JSON.parse(payJson);
          this.$nextTick(() => {
            // 只绑定一个
            if (arr.length === 1) {
              this.payList.forEach(item => {
                if (item.id === arr[0].id) {
                  item.checked = true
                }
              })
            } else {
              arr.forEach(item => {
                this.payList.filter(list => list.id === item.id).forEach((value) => {
                  value.checked = true
                })
              })
            }
          });
        }
      })
    },
    submit() {
      let url;
      let bankIdList = this.bankIdList.length === 1 ? this.bankIdList[0] : this.bankIdList.join(',');

      if (this.payTime < 15 || this.payTime > 30) {
        return;
      }

      if (this.id && !this.$route.query.flag) {
        url = '/orders/updateServiceOrder';  //编辑广告单
      } else {
        if (this.type === 2) {
          this.isShow = true; //非编辑卖单
        } else {
          url = '/orders/createBuyServiceOrder'; //非编辑买单
        }
      }

      this.$fetch.post(url, {
        orderCode: this.orderCode,
        serviceOrderId: this.id,
        mintotal: this.adviceMinPrice,
        maxtotal: this.adviceMaxPrice,
        rate: this.price,
        total: this.amount,
        currency: this.tranCurrency,
        bankIdList,
        autoReply: this.autoReply,
        tradeRemark: this.tradeRemark,
        payLimit: this.payTime,
        serviceStart: this.startTime.replace(':', ''),
        serviceEnd: this.endTime.replace(':', ''),
        serviceDateStatus: this.open ? 1 : 0
      }).then((res) => {
        if (res.success) {
          this.$message.success(this.$t('releaseAd.text34'));
          this.$router.go(-1);
          this.resetForm()
        }
      })
    },
    payConfirm(p1, p2) {  //卖单
      let url = '/orders/createServiceSellOrder';
      let bankIdList = this.bankIdList.join(',');
      this.$fetch.post(url, {
        orderCode: this.orderCode,
        mintotal: this.adviceMinPrice,
        maxtotal: this.adviceMaxPrice,
        rate: this.price,
        tradePwd: p1,
        code: p2,
        total: this.amount,
        currency: this.tranCurrency,
        bankIdList,
        autoReply: this.autoReply,
        tradeRemark: this.tradeRemark,
        payLimit: this.payTime,
        serviceStart: this.startTime.replace(':', ''),
        serviceEnd: this.endTime.replace(':', ''),
        serviceDateStatus: this.open ? 1 : 0
      }).then((res) => {
        if (res.success) {
          this.$message.success(this.$t('releaseAd.text34'));
          this.$router.go(-1);
          this.show = false;
          this.resetForm()
        }
      })
    },
    choosePayItem(item, index) {
      item.checked = !item.checked;
      this.$set(this.payList, index, item)
    },
    change() { //切换交易价格币种
      this.getPayList()
    },
    changeSwitch() {
      if (!this.open) {
        this.startTime = '';
        this.endTime = '';
      }
    },
    getPayList() {
      this.$fetch.post('/bankinfo/queryBankInfoList', {
        currency: this.tranCurrency,
        pageIndex: 1,
        pageSize: 50
      }).then((res) => {
        res.data.forEach((item) => {
          item.checked = false;
        });
        this.payList = res.data;
      })
    },

    resetForm() {
      this.amount = '';
      this.price = '';
      this.adviceMinPrice = '';
      this.adviceMaxPrice = '';
      this.payTime = '';
      this.startTime = '';
      this.endTime = '';
      this.autoReply = '';
      this.tradeRemark = '';
      this.getPayList();
    }
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
        color #639cff
        display flex
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
      margin-top 40px
      .form-item {
        display flex
        margin-bottom 30px
        label {
          margin-top 5px
          width 160px
        }
        .submit {
          height 40px
          background-color #639cff
          color #fff
          width 380px
          line-height 40px
          text-align center
          border-radius 4px
          margin-top 20px
          cursor pointer
          margin-left 160px
        }
        .isDisable {
          background-color #41414f
          color #aaa
          cursor not-allowed
        }
        .form-item-right {
          display flex
          .input-large-size {
            font-size 14px
            width 380px
            border-radius 4px
          }
          input {
            border 1px solid #32323e
            padding-left 15px
          }
          .input-middle-size {
          }
          .segment {
            margin-left 20px
          }
          .input-wrap {
            position relative
            margin-bottom 0
            span {
              position absolute
              right 20px
              top 50%
              transform translateY(-50%)
            }
          }
          .pay-type-list {
            flex 1
            li {
              display flex
              align-items center
              margin-top 15px
              padding-bottom 15px
              border-bottom 1px solid #32323e
              cursor pointer
              .pay-type {
                display flex
                align-items center
                span {
                  display inline-block
                  color #fff
                  padding 2px 6px
                  border-radius 3px
                  margin-right 10px
                }
                p {
                  margin-right 15px
                }
                .er-code-wrap {
                  display inline-block
                  position relative
                  .er-code {
                    display none
                    border 4px solid #5f5e6c
                    border-radius 4px
                    max-width 300px
                  }
                  &:hover {
                    .er-code {
                      z-index 999
                      display inline-block
                      left 20px
                      top 20px
                      position absolute
                    }
                  }
                }
              }
            }
            li:before {
              display inline-block
              content ""
              width 15px
              height 15px
              border-radius 50%
              border 1px solid #5f5e6c
              margin-right 20px
            }
            li.active:before {
              background-image url("./images/active.png")
              background-position center
              background-size cover
              border none
              margin-right 22px
            }
          }
          .errorTips {
            color #ff415d
            font-size 14px
            margin-top 10px
          }
          .tips {
            color #639cff
            font-size 14px
            margin-top 10px
          }
          .time-picker-wrap {
            margin-top 20px
          }
          textarea{
            width 100%
            height 100px
            border: 1px solid #41414f;
            border-radius: 4px;
            box-shadow: 0 0 1px rgba(0, 0, 0, .1);
            background-color: #272730;
            padding: 10px;
            color: #fff;
            letter-spacing: normal;
            font-family: "微软雅黑";
            resize: none;
          }
          .textareaTextTip {
            position absolute
            right 5px
            bottom 3px
          }
          p {
            display inline-block
            vertical-align top
          }
          .isDisableInput {
            background-color: #2d2d37;
            cursor not-allowed
          }
        }
      }
    }
  }
</style>
<style scoped>
  .input-wrap input:focus {
    box-shadow: 0 0 0 #32323e;
  }

  >>> input {
    color: #fff;
    border: 1px solid #32323e;
    border-radius: 4px;
  }

  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { /* WebKit browsers */
    color: #5f5e6c;
  }

  input::-moz-placeholder, textarea::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #5f5e6c;
  }

  input:-ms-input-placeholder, textarea:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #5f5e6c;
  }

  >>> .el-input__inner {
    background-color: #272730
  }

  >>> .el-time-panel.el-popper {
    background-color: #ccc
  }

  >>> .el-input.is-disabled .el-input__inner {
    background-color: #2d2d37;
    border-color: #2d2d37
  }
</style>
