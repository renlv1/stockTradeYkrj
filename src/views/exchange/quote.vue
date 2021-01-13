<template>
  <div class="c-page">
    <div class="order user-gap">
      <div class="add-w" @click="$router.push('/noticeCenter')" v-show="noticeTitle">{{noticeTitle}} ></div>
      <div class="allCenter ctrl-w" style="margin-bottom: 30px;">
        <div class="filter">
          <div class="item" :class="{active: stockType === index}" @click="stockType = index; searchKey = ''" v-for="(item, index) in [$t('exchangeNew.text2'), ...stockTypeList]" :key="index">
            {{item}}
          </div>
        </div>
        <div style="width: 400px" class="seatch-w-p">
          <el-input
            :placeholder="$t('exchangeNew.text42')"
            prefix-icon="el-icon-search"
            size="medium"
            clearable
            v-model="searchKey">
          </el-input>
        </div>
      </div>
        <div class="web-list" style="min-height: 400px;" v-loading="!currencyList.length">
          <table>
            <thead>
              <tr>
                <td class="pointer" @click="setSortType(1)">{{$t('exchangeNew.text43')}}
                  <i class="el-icon-d-caret" :class="{asc: sortType === 1, desc: sortType === 2}"></i>
                </td>
                <td>{{$t('exchangeNew.text44')}}</td>
                <td>{{$t('exchangeNew.text45')}}</td>
                <td class="pointer" @click="setSortType(3)">{{$t('exchangeNew.text46')}}<i class="el-icon-d-caret" :class="{asc: sortType === 3, desc: sortType === 4}"></i></td>
                <td>{{$t('exchangeNew.text47')}}</td>
                <td class="pointer" @click="setSortType(5)">{{$t('exchangeNew.text48')}}<i class="el-icon-d-caret" :class="{asc: sortType === 5, desc: sortType === 6}"></i></td>
                <td>{{$t('exchangeNew.text49')}}</td>
                <td>{{$t('exchangeNew.text50')}}</td>
                <td>{{$t('exchangeNew.text51')}}</td>
              </tr>
            </thead>
            <tbody>
              <tr class="pointer" v-for="(item, index) in calcCurrencyList" :key="index" @click="$router.push(`/exchange?currency=${item.currency}`)">
                <td>{{item.currency}}</td>
                <td class="name-w">
                  <p v-if="$i18n.locale === 'EN'">{{item.shareNameEn}}</p>
                  <p v-else>{{item.shareName}}</p>
                  <div class="tag">
                    {{item.shareCode}}
                  </div>
                </td>
                <td>{{stockTypeList[item.type]}}</td>
                <td>
                  <p>{{item.reckonAmount | f(item.pricePlaces)}}{{item.reckonCurrency}}</p>
                  <p class="diff">{{item.newAmount | f(2)}}{{item.newCurrency}}</p>
                </td>
                <td :class="item.riseFallAmount > 0 ? 'cgreen2' : 'cred2'"><i v-if="item.riseFallAmount > 0">+</i>{{item.riseFallAmount}}</td>
                <td :class="item.riseFallAmount > 0 ? 'cgreen2' : 'cred2'"><i v-if="item.riseFallAmount > 0">+</i>{{item.riseFallRate | f(2)}}%</td>
                <td>{{item.tradeNum | f(item.pricePlaces)}}</td>
                <td>
                  <p>{{item.reckonRradeAmount | f(item.pricePlaces)}}{{item.reckonCurrency}}</p>
                  <p class="diff">{{item.tradeAmount | f(2)}}{{item.newCurrency}}</p>
                </td>
                <td class="cblue" @click.stop="setCollect(item)">
                  <span class="c000"  v-if="item.isMyChoose === 1">- {{$t('exchangeNew.text32')}}</span>
                  <span v-else>+ {{$t('exchangeNew.text52')}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="empty" v-if="currencyList.length && !calcCurrencyList.length">
            <i class="el-icon-document"></i>
            <p>{{$t('common.empty')}}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stockTypeList: this.$t('exchangeNew.arr1'),
      stockType: 1,
      searchKey: '',
      sortType: '',
	    noticeTitle: ''
    };
  },
  computed: {
    currencyList () {
      let arr = [...this.$store.state.currencyList]
      switch (this.sortType) {
        case 1:
        case 2:
          arr.sort((a, b) => {
            return a.currency.localeCompare(b.currency)
          })
          break
        case 3:
        case 4:
          arr.sort((a, b) => {
            return a.reckonAmount - b.reckonAmount
          })
          break
        case 5:
        case 6:
          arr.sort((a, b) => {
            return a.riseFallRate - b.riseFallRate
          })
          break
      }
      if (this.sortType % 2 === 0) {
        arr.reverse()
      }
      return arr
    },
    calcCurrencyList () {
      const key = this.searchKey.toUpperCase()
      return this.currencyList.filter(item => {
        let str = item.shareName + item.shareCode + item.currency
        if (str.toUpperCase().includes(key)) {
          if (this.stockType === 0) {
            if (item.isMyChoose === 1) {
              return item
            }
          } else if (item.type === this.stockType - 1 || this.stockType < 2) {
            return item
          }
        }
      })
    },
    isLogin () {
      return this.$store.getters.isLogin
    },
  },
  watch: {
    stockType () {
      if (this.stockType === 0 && !this.isLogin) {
        this.$router.push('/login')
      }
    }
  },
  created () {
  	this.getNotice()
    this.$store.dispatch('getCurrencyList')
    const timer = setInterval(() => {
      this.$store.dispatch('getCurrencyList')
    }, 10000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
  	getNotice () {
		  this.$fetch.post('/notice/noticeList ', {
			  pageIndex: 1,
			  pageSize: 1
		  }).then(res => {
			  if (res.success && res.data.length > 0) {
			  	this.noticeTitle = res.data[0].title
			  }
		  })
    },
    setCollect (item) {
      if (this.isLogin) {
        this.$fetch.post('/shareInfo/addMyChoose', {
          shareId: item.id
        })
        item.isMyChoose = item.isMyChoose === 2 ? 1 : 2
      } else {
        this.$router.push('/login')
      }
    },
    setSortType (index) {
      this.sortType = this.sortType === index ? index + 1 : index
    }
  }
};
</script>

<style lang="less" scoped>
.c-page.zoom-enter-to{
  transition: none;
}
.user-gap{
  padding: 0;
}
.add-w{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1d2b47;
  cursor: pointer;
  color: #e6e6e6;
  font-size: 14px;
  position: relative;
  z-index: 100;
  margin-top: -1px;
}
.web-list{
  padding: 0 30px;
  thead td{
    height: 50px !important;
  }
  .name-w{
    max-width: 150px;
  }
}
.ctrl-w{
  background-color: #17233b;
  padding: 40px 30px 0 30px;
  align-items: flex-start !important;
}
.diff{
  font-size: 13px;
  color: #aaa;
  padding-top: 2px;
}
.filter{
  display: flex;
  .item{
    margin-right: 10px;
    font-size: 16px;
    cursor: pointer;
    padding: 8px 20px;
    height: 40px;
    color: #e6e6e6;
    border-radius: 4px 4px 0 0;
    background-color: #263655;
    &.active{
      background: #fff;
      color: #2492f5;
    }
  }
}
.seatch-w-p{
  /deep/ .el-input__inner{
    background-color: #263655;
    height: 32px;
    border: none;
    color: #fff;
  }
}
.tag{
  padding-top: 4px;
  // display: flex;
  // align-content: center;
  color: #999;
  font-size: 12px;
  i{
    background: #eee;
    padding: 3px 5px;
    border-radius: 2px;
    margin-right: 6px;
  }
}
.empty{
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 150px;
  color: #999;
  i{
    font-size: 40px;
    margin-bottom: 10px;
  }
}
.el-icon-d-caret{
  &.desc{
    background-image: linear-gradient(to bottom, #767588 40%, @blue 60%);
  }
  &.asc{
    background-image: linear-gradient(to top, #767588 40%, @blue 60%);
  }
  &.desc,&.asc{
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
