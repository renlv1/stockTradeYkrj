<template>
  <div class="c-page">
    <div class="order user-gap">
      <div class="user-tit">{{$t('otcOrder.text1')}}</div>
      <!-- <div class="tab">
        <div class="item" @click="queryType = 1; statusIndex = 0; typeIndex = 0; getData()" :class="{active: queryType === 1}">进行中
          <span v-if="numArr1[0]">({{numArr1[0]}})</span>
          <div class="order-remind" v-if="remind.length"></div>
        </div>
        <div class="item" @click="queryType = 2; statusIndex = 0; typeIndex = 0; getData()" :class="{active: queryType !== 1}">已完成
          <span v-if="numArr1[1]">({{numArr1[1]}})</span>
        </div>
      </div> -->
      <!-- <div class="filter-wrap">
        <div class="section">
          <div class="label">订单状态</div>
          <div class="options status-list" :class="{diff: queryType !== 1}">
            <div class="item" :class="{active: statusIndex === index}" @click="statusClick(index)" v-for="(item, index) in statusList" :key="index">
              {{item}}
              <template v-if="numArr2[index]">
                <span>({{numArr2[index]}})</span>
                <div
                  class="order-remind"
                  v-if="(index === 3 && (remind.includes(1) || remind.includes(4)))
                  || (index === 2 && remind.includes(2))
                  ">
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="label">订单类型</div>
          <div class="options">
            <div class="item" :class="{active: typeIndex === index}" @click="typeClick(index)" v-for="(item, index) in typeList" :key="index">
              {{item}}
              <template v-if="numArr3[index]">
                <span >({{numArr3[index]}})</span>
                <template v-if="queryType === 1">
                  <div
                    class="order-remind"
                    v-if="(index === 1 && remind.includes(2))
                    || (index === 2 && (remind.includes(1) || remind.includes(4)))
                    ">
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="label">交易币种</div>
          <div class="options">
            <div class="item active">{{item.rateCurrency}}</div>
          </div>
        </div>
      </div> -->
      <div class="web-filter" style="padding: 10px 0 30px">
        <div class="vCenter">
          <el-select  v-model="queryType" @change="statusIndex = 0">
            <el-option v-for="(item, index) in $t('otcOrder.arr1')" :key="index" :value="index" :label="item"></el-option>
          </el-select>
          <div class="input">
            <el-select v-model="statusIndex">
              <el-option v-for="(item, index) in statusList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </div>
          <div class="input">
            <el-select v-model="typeIndex">
              <el-option v-for="(item, index) in $t('otcOrder.arr2')" :key="index" :value="index" :label="item"></el-option>
            </el-select>
          </div>
          <!-- <div class="btn" @click="getData()">查询</div> -->
        </div>
      </div>
      <load-more ref="loadMore" v-model="pageIndex" @change="getData" :list="list" :total="total">
        <div class="web-list">
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('otcOrder.arr4')" :key="index">{{item}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" :key="index"  @click="$router.push(`otcOrder/otcOrderDetail?id=${item.id}&data=${JSON.stringify(item)}`)">
                <td>{{item.id}}</td>
                <td>
                  <span v-if="item.buySystemCode !== $store.state.user.userSystemCode">{{item.buyName}}</span>
                  <span v-else>{{item.sellName}}</span>
                </td>
                <td>
                  <span class="cred tag" v-if="item.buySystemCode !== $store.state.user.userSystemCode">{{$t('otcOrder.text3')}}</span>
                  <span class="cgreen tag" v-else>{{$t('otcOrder.text4')}}</span>
                  {{item.transferAmount | f}}{{item.rateCurrency}}</td>
                <td>{{item.createTime | time}}</td>
                <td>{{item.total | f}}/{{item.rate | f}}{{item.rateCurrency}}</td>
                <td>
                  <span v-if="item.payMethod === 1">{{$t('otcOrder.text5')}}</span>
                  <span v-else-if="item.payMethod === 2">{{$t('otcOrder.text6')}}</span>
                  <span v-else>- -</span>
                  <div v-if="item.giveAccount" class="bank-info">{{item.payMethod === 2 ? item.giveRealName : item.giveBankName}} ({{item.giveAccount.slice(-4)}})</div>
                </td>
                <td v-html="status2text(item)">
                </td>
                <td>
                  <span style="padding-right: 10px; font-size: 14px;" :class="{cred: item.cancelTimes < 30000}" v-if="item.status < 2 && item.cancelTimes > 0">{{$t('otcOrder.text7', {time: getDuration(item.cancelTimes)})}}</span>
                  <span class="cblue">{{$t('otcOrder.text8')}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </load-more>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      list: [],
      typeIndex: 0,
      statusIndex: 0,
      total: -1,
      source: null,
      pageIndex: 1,
      loading: false,
      queryType: 0,
      numArr1: [],
      numArr2: [],
      numArr3: [],
    };
  },
  created () {
    let cache = this.$store.state.cacheStore[this.$route.path]
    if (cache) {
      Object.assign(this.$data, cache)
    }
  },
  computed: {
    orderNum () {
      return this.$store.state.totalOrder
    },
    remind () {
      let list = this.$store.state.globalMessageList
      let arr = []
      list.forEach(item => {
        if (item.messageType === 9 && item.orderType !== 5) {
          if (item.orderType !== 2 || (item.orderType === 2 && item.cancelTime > new Date().getTime())) {
            arr.push(item.orderType)
          }
        }
      })
      return arr
    },
    refreshTime () {
      return this.$store.state.refreshTime
    },
    statusList () {
      let statusList = this.$t('otcOrder.arr3')
      let arr = []
      statusList.forEach((item, index) => {
        arr.push({
          label: item,
          value: index + 1
        })
      })
      if (this.queryType === 1) {
        arr = arr.slice(0, 4)
      } else if (this.queryType === 2) {
        arr = arr.slice(4)
      }

      arr.unshift({
        label: this.$t('otcOrder.text2'),
        value: 0
      })

      return arr
    }
  },
  watch: {
    queryType () {
      this.getData()
    },
    statusIndex () {
      this.getData()
    },
    typeIndex () {
      this.getData()
    },
    refreshTime () {
      setTimeout(() => {
        this.getData()
      }, 2000)
    }
  },
  methods: {
    getData (pageIndex) {
      this.source && this.source.cancel()
      this.source = axios.CancelToken.source()
      this.loading = true
      if (pageIndex) {
        this.pageIndex = pageIndex
      }
      this.$fetch.post2('/deposit/queryTradeOrderList', {
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10,
        status: this.statusIndex || '',
        queryType: this.queryType,
        type: this.typeIndex // 0:所有 1:查询买单 2:查询卖单
      }, this.source.token).then(res => {
        // "doingNumber": 3,//进行中
        // "finishNumber": 1,//已完成
        // "typeAll": 1,//订单类型 所有
        // "typeBuy": 0,//订单类型 购买订单
        // "typeSell": 1,//订单类型 出售订单
        // "statusAll": 1, //订单状态 所有
        // "statusCancel": 2,//订单状态 已取消
        // "statusZhongcaiFinish": 0,//订单状态 申诉完成
        // "statusFinish": 0,//订单状态 已完成
        // "statusWait": 0,//订单状态 等待中
        // "statusNoPay": 3,//订单状态 未付款
        // "statusPay": 0,//订单状态 已付款
        // "statusZhongcai": 0,//订单状态 申诉中
        let d = res.data

        this.numArr1 =  [d.doingNumber, d.finishNumber]
        this.numArr2 =  [d.statusAll, d.statusWait,  d.statusNoPay, d.statusPay, d.statusZhongcai, d.statusFinish, d.statusCancel, d.statusZhongcaiFinish]
        this.numArr3 =  [d.typeAll, d.typeBuy, d.typeSell]

        this.loading = false
        if (res.success) {
          this.list = res.data.tradeOrderList
          this.total = res.data.totalRecord
        }

        this.countDown()
      }).catch(() => {
        this.loading = false
      })
    },
    status2text (item) {
      let statusText = ''
      let isRecharge = item.type === 1
      let isBoss = item.currentAddress === item.businessCode
      switch (item.status) {
        case 0:
          if (isRecharge) {
            if (isBoss) {
              statusText = this.$t('otcOrder.text9')
            } else {
              statusText = `<span class="cblue">${this.$t('otcOrder.text10')}</span>`
            }
          } else {
            statusText = this.$t('otcOrder.text11')
          }
          break
        case 1:
          if (isRecharge) {
            if (isBoss) {
              statusText = this.$t('otcOrder.text15')
            } else {
              statusText = `<span class="cblue">${this.$t('otcOrder.text13')}</span>`
            }
          } else {
            if (isBoss) {
              statusText = `<span class="cblue">${this.$t('otcOrder.text13')}</span>`
            } else {
              statusText = this.$t('otcOrder.text15')
            }
          }
          break
        case 2:
          if (isRecharge) {
            if (isBoss) {
              statusText = `<span class="cblue">${this.$t('otcOrder.text16')}</span>`
            } else {
              statusText = this.$t('otcOrder.text17')
            }
          } else {
            if (isBoss) {
              statusText = this.$t('otcOrder.text17')
            } else {
              statusText = `<span class="cblue">${this.$t('otcOrder.text16')}</span>`
            }
          }
          break
        case 3:
          statusText = this.$t('otcOrder.text18')
          break
        case 4:
          statusText = this.$t('otcOrder.text19')
          break
        case 5:
          if (item.zhongcaiStatus === 1) {
            statusText = this.$t('otcOrder.text20')
          } else if (item.zhongcaiStatus === 2) {
            statusText = `<span class="cblue">${this.$t('otcOrder.text21')}</span>`
          } else {
            statusText = this.$t('otcOrder.text22')
          }
          break
        case 6:
          statusText = this.$t('otcOrder.text23')
          break
        case 7:
          statusText = this.$t('otcOrder.text24')
          break
        case 8:
          statusText = this.$t('otcOrder.text225')
          break
      }

      return statusText
    },
    typeClick (index) {
      this.typeIndex = index
      this.$refs.loadMore.pageIndex = 1
      this.pageIndex = 1
      this.getData()
    },
    statusClick (index) {
      this.statusIndex = index
      this.$refs.loadMore.pageIndex = 1
      this.pageIndex = 1
      this.getData()
    },
    countDown () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.list.forEach(item => {
          if (item.status < 2 && item.cancelTimes > 0) {
            item.cancelTimes -= 1000
            if (item.cancelTimes <= 1000) {
              setTimeout(() => {
                this.getData()
              }, 2000)
            }
          }
        })
      }, 1000)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.timer)
      })
    },
    getDuration (mss) {
      if (!mss) {
        mss = '- -'
      } else if (mss > 0) {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        mss = `${this.toDouble(hours)}:${this.toDouble(minutes)}:${this.toDouble(seconds)}`
      }
      return mss
    },
    toDouble (num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
  },
  beforeRouteLeave (to, form, next) {
    this.$store.commit('SET_CACHE', {
      key: form.path,
      data: to.path.toLowerCase().includes('detail') ? this.$data : ''
    })
    next()
  }
};
</script>

<style lang="less" scoped>
.bank-info{
  font-size: 13px;
  color: #7a7a7a;
  padding-top: 4px;
}
.order{
  .tag{
    border: 1px solid;
    padding: 3px 5px;
    border-radius: 2px;
    margin-right: 4px;
    font-size: 12px;
  }
}
</style>
