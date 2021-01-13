<template>
  <!-- 我的广告 -->
  <div class="tab-content">
    <div class="filter">
      <el-select style="width: 160px; margin-right: 20px" v-model="typeValue"  @change="getData(1)">
        <el-option
          v-for="item in typeOptions.filter(value => value !== typeValue)"
          :key="item"
          :label="item"
          :value="item"
          clearable>
        </el-option>
      </el-select>
      <el-select style="width: 160px; margin-right: 20px" v-model="currencyValue"  @change="getData(1)">
        <el-option
          v-for="item in currencyOptions.filter(value => value !== currencyValue)"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select style="width: 160px; margin-right: 20px" v-model="stateValue" @change="getData(1)">
        <el-option
          v-for="item in stateOptions.filter(value => value !== stateValue)"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <button class="filter-btn clear-btn" @click="clearFilter">{{$t('myAdvertising.text1')}}</button>
      <button class="filter-btn submit-btn" @click="createAd">{{$t('myAdvertising.text2')}}</button>
    </div>
    <div class="table-wrap">
      <load-more
        ref="loadMore"
        @change="getData"
        :list="list"
        :pageSize="pageSize"
        :value="pageIndex"
        :total="total"
      >
        <table>
          <tr class="table-head">
            <th>{{$t('myAdvertising.text3')}}</th>
            <th style="min-width: 130px">{{$t('myAdvertising.text4')}}</th>
            <th>{{$t('myAdvertising.text5')}}</th>
            <th>{{$t('myAdvertising.text6')}}</th>
            <th>{{$t('myAdvertising.text7')}}</th>
            <th>{{$t('myAdvertising.text8')}}</th>
            <th>{{$t('myAdvertising.text9')}}</th>
          </tr>
          <tr class="no-border" v-for="item in list" :key="item.index">
            <td>{{item.id}}</td>
            <td>
              <div class="table-flex" style="text-align: left;">
                <span :class="{'sell-box': item.type !== 1, 'buy-box': item.type === 1 }">{{item.type === 1 ? $t('advertising.text8') : $t('advertising.text6')}}</span>
                <span>{{item.tradeTotal | f}}</span>
              </div>
            </td>
            <td>{{item.rate | f}}{{item.rateCurrency}}</td>
            <td>{{item.minTotal | f}}-{{item.maxTotal | f}}</td>
            <td>{{item.subTotal | f}}</td>
            <td>
              <span v-if="item.payStatus === 5">{{$t('myAdvertising.text10')}}</span>
              <template v-else>
                <span v-if="item.status === 1">{{$t('myAdvertising.text11')}}</span>
                <span v-if="item.status === 4">{{$t('myAdvertising.text12')}}</span>
                <span v-if="item.status === 3">{{$t('myAdvertising.text13')}}</span>
              </template>
            </td>
            <td class="operation">
              <template v-if="item.payStatus !== 5">
                <template v-if="item.status === 1">
                  <span @click.stop="handleOrder(item, 2)" class="cblue">{{$t('myAdvertising.text14')}}</span>
                  <span @click.stop="handleOrder(item, 3)" class="cblue">{{$t('myAdvertising.text15')}}</span>
                </template>
                <template v-if="item.status === 3">
                  <span @click.stop="selectOrder(item)" class="cblue">{{$t('myAdvertising.text16')}}</span>
                  <span class="cred" @click.stop="handleOrder(item, 4)">{{$t('myAdvertising.text17')}}</span>
                </template>
                <template v-if="item.status === 4">
                  <span @click.stop="handleOrder(item, 1)" class="cblue">{{$t('myAdvertising.text18')}}</span>
                  <span @click.stop="handleOrder(item, 3)" class="cblue">{{$t('myAdvertising.text19')}}</span>
                </template>
              </template>
              <span
                v-if="item.status !== 3"
                @click.stop="$router.push(`/advertising/releaseAd?id=${item.id}`)"
                class="cblue">{{$t('myAdvertising.text20')}}</span>
            </td>
          </tr>
        </table>
      </load-more>
    </div>
  </div>
</template>

<script>
export default {
  name: "myAdvertising",
  data() {
    return {
      typeOptions: this.$t('myAdvertising.arr1'),
      typeValue: this.$t('myAdvertising.text21'),

      currencyOptions: this.$t('myAdvertising.arr2'),
      currencyValue: this.$t('myAdvertising.text22'),

      stateOptions: this.$t('myAdvertising.arr3'),
      stateValue: this.$t('myAdvertising.text23'),

      list: [],
      pageSize: 20,
      pageIndex: 1,
      total: -1,

      dialogVisible: false,
      dialogTitle: '',
      dialogDescription: '',
    }
  },

  props: {
    //派发一个属性告知子组件是否要缓存状态
    ceche: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    bankList() {
      return this.$store.state.bankList
    },
  },

  mounted() {
    if (!this.ceche) {
      //不需要缓存
      window.localStorage.removeItem('cacheTable');
      this.$refs.loadMore.pageIndex = 1
    } else {
      let cacheData = JSON.parse(window.localStorage.getItem('cacheTable'));
      this.typeValue = cacheData.typeValue;
      this.currencyValue = cacheData.currencyValue;
      this.stateValue = cacheData.stateValue;
      this.$refs.loadMore.pageIndex = cacheData.pageIndex
    }
  },
  destroyed() {
    //离开后缓存页面数据
    let cacheTable = {};
    cacheTable.typeValue = this.typeValue;
    cacheTable.currencyValue = this.currencyValue;
    cacheTable.stateValue = this.stateValue;
    cacheTable.pageIndex = this.pageIndex;
    window.localStorage.setItem('cacheTable', JSON.stringify(cacheTable));
  },
  methods: {
    //clear
    clearFilter() {
      this.typeValue = this.$t('myAdvertising.text21');
      this.currencyValue = this.$t('myAdvertising.text22');
      this.stateValue = this.$t('myAdvertising.text23');
      this.pageIndex = 1;
      this.getData()
    },
    handleOrder(item, type) {
      //1开启 2 暂停 3下架 4 删除
      let tips = '';
      if (type === 1) {
        if (item.serviceDateStatus) {
          tips = this.$t('myAdvertising.text24');
        } else {
          tips = this.$t('myAdvertising.text25')
        }
      } else if (type === 2) {
        if (item.serviceDateStatus) {
          tips = this.$t('myAdvertising.text26');
        } else {
          tips = this.$t('myAdvertising.text27')
        }
      } else if (type === 3) {
        if (item.type === 1) {
          tips = this.$t('myAdvertising.text28');
        } else {
          tips = this.$t('myAdvertising.text29')
        }
      } else if (type === 4) {
        tips = this.$t('myAdvertising.text30')
      }
      this.$confirm(tips).then(() => {
        this.$fetch.post('/orders/handelServiceOrder', {
          serviceOrderId: item.id,
          type,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$store.dispatch('getBalance');
            this.$message.success(this.$t('myAdvertising.text31'));
            this.getData()
          }
        })
      })
    },
    selectOrder(item) {
      this.$router.push({
        path: '/advertising/releaseAd',
        query: {
          flag: 1,
          id: item.id,
        }
      })
    },
    del() {
      this.dialogVisible = true;
      this.dialogTitle = this.$t('myAdvertising.text17');
      this.dialogDescription = this.$t('myAdvertising.text32');
    },
    open() {
      this.dialogVisible = true;
      this.dialogTitle = this.$t('myAdvertising.text18');
      this.dialogDescription = this.$t('myAdvertising.text33');
    },
    stop() {
      this.dialogVisible = true;
      this.dialogTitle = this.$t('myAdvertising.text14');
      this.dialogDescription = this.$t('myAdvertising.text34');
    },

    createAd() {
      if (!this.bankList.length) {
        this.$confirm(this.$t('myAdvertising.text35')).then(() => {
          this.$router.push('/user/france')
        })
      } else {
        this.$router.push('/advertising/releaseAd')
      }
    },
    getData(pageIndex) {
      if (pageIndex) {
        this.pageIndex = pageIndex
      } else {
        let pageIndex = 1;
        this.$refs.loadMore.pageIndex = 1
      }
      let type = this.typeOptions.indexOf(this.typeValue) === 0 ? '' : this.typeOptions.indexOf(this.typeValue);
      let rateCurrency = this.currencyValue === this.$t('myAdvertising.text22') ? '' : this.currencyValue;
      let status = this.stateOptions.indexOf(this.stateValue);
      this.$fetch.post('/orders/queryUserServiceOrderList', {
        type,
        rateCurrency,
        status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }).then((res) => {
        if (res.success) {
          this.list = res.data.results;
          this.total = res.data.totalRecord
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tab-content {
    .filter {
      display flex
      margin 30px 0 40px
      .filter-btn {
        color #fff
        width 100px
        height 40px
        font-size 14px
        margin-right 20px
      }
      .clear-btn {
        background-color #32323e
        border-radius 4px
      }
      .submit-btn {
        background-color #4d62ff
        border-radius 4px
      }
    }
  }
</style>
