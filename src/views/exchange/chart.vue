<template>
  <div class="chart view" :class="{hideIframe: hideIframe}">
    <div class="current-currency">
      <div class="c">
        <p>
          <span class="shareName" :title="activeCurrency.shareNameEn" v-if="$i18n.locale === 'EN'">{{activeCurrency.shareNameEn}}</span>
          <span class="shareName" v-else>{{activeCurrency.shareName}}</span>
          ({{activeCurrency.shareCode}})</p>
        <span>{{$t('exchangeNew.text31')}}: {{activeCurrency.currency}}</span>
      </div>
      <div class="n">
        <p :class="activeCurrency.riseFallRate < 0 ? 'red' : 'green'">
          <b style="font-size: 18px;">{{activeCurrency.reckonAmount | f($parent.pricePlaces)}}{{baseCurrency}}</b>
          <span style="margin-left: 5px;font-size: 12px;">
            <span class="green" v-if="activeCurrency.riseFallRate > 0">
              +{{activeCurrency.riseFallRate | f(2)}}%
              <!-- <i class="el-icon-top"></i> -->
            </span>
            <span class="red" v-else-if="activeCurrency.riseFallRate < 0">
              {{activeCurrency.riseFallRate | f(2)}}%
              <!-- <i class="el-icon-bottom"></i> -->
            </span>
            <span v-else>0.00%</span>
          </span>
        </p>
        <i>{{(activeCurrency.newAmount || 0).toFixed(2)}}{{activeCurrency.newCurrency}}</i>
      </div>
      <div class="f1">
      </div>
      <div class="collect" :class="{diff: activeCurrency.isMyChoose === 1}" @click="$emit('setCollect')">
        <span class="cgray" v-if="activeCurrency.isMyChoose === 1">{{$t('exchangeNew.text32')}}</span>
        <span v-else>+ {{$t('exchangeNew.text2')}}</span>
      </div>
    </div>
    <div class="intro">
      <div>
        <div class="label">{{$t('exchangeNew.text34')}}：</div>
        <div class="d">
          <p>{{activeCurrency.maxAmount / activeCurrency.usdtRate | f($parent.pricePlaces)}}{{baseCurrency}}</p>
          <p>{{activeCurrency.maxAmount | f(2)}}{{activeCurrency.newCurrency}}</p>
        </div>
      </div>
      <div>
        <div class="label">{{$t('exchangeNew.text35')}}：</div>
        <div class="d">
          <p>{{activeCurrency.minAmount / activeCurrency.usdtRate | f($parent.pricePlaces)}}{{baseCurrency}}</p>
          <p>{{activeCurrency.minAmount | f(2)}}{{activeCurrency.newCurrency}}</p>
        </div>
      </div>
      <div>
        <div class="label">{{$t('exchangeNew.text36')}}：</div>
        <div class="d">
          <p>{{activeCurrency.yestodayAmount / activeCurrency.usdtRate | f($parent.pricePlaces)}}{{baseCurrency}}</p>
          <p>{{activeCurrency.yestodayAmount | f(2)}}{{activeCurrency.newCurrency}}</p>
        </div>
      </div>
      <div>
        <div class="label">{{$t('exchangeNew.text37')}}：</div>
        <div class="d">
          <p>{{activeCurrency.todayAmount / activeCurrency.usdtRate | f($parent.pricePlaces)}}{{baseCurrency}}</p>
          <p>{{activeCurrency.todayAmount | f(2)}}{{activeCurrency.newCurrency}}</p>
        </div>
      </div>
    </div>
    <div ref="chartArea" v-loading="hideIframe || loading" style="height: calc(100% - 100px); position: relative;">
      <div class="actions">
        <div class="f1 vCenter" :style="`visibility:${chartType === 0 ? 'visible' : 'hidden'}`">
          <div class="times flex">
            {{$t('exchange.text37')}}
            <div class="item pointer"
              @click="setTime(index)"
              :class="{cblue: timeIndex === index}"
              v-for="(item, index) in ['1min', '15min', '1hour', '4hour', '1day', '1week' ,'1mon']" :key="index">
              {{item}}
            </div>
          </div>
          <div class="icons vCenter">
            <el-tooltip :content="$t('exchange.text40')" effect="light" :tabindex="-1" placement="top">
              <img src="@img/icon_zhibiao.svg" @click="showChartDialog('insertIndicator')" alt="">
            </el-tooltip>
            <el-tooltip :content="$t('exchange.text41')" effect="light" :tabindex="-1" placement="top">
              <img src="@img/icon_set.svg" @click="showChartDialog('chartProperties')" alt="">
            </el-tooltip>
            <el-tooltip :content="$t('exchange.text42')" effect="light" :tabindex="-1" placement="top">
              <img src="@img/icon_full.svg" @click="showFullScreen" alt="">
            </el-tooltip>
          </div>
        </div>
        <!-- <div class="tab flex">
          <div class="item"
            v-for="(item, index) in $t('exchange.arr1').slice(1)"
            @click="chartType = index"
            :class="{active: chartType === index}"
            :key="index">
            {{item}}
          </div>
        </div> -->
      </div>
      <div class="tooltips" @mouseover="showTooltips = true" v-show="activeBar.time && showTooltips" :style="`left: ${position.x}px;`">
        <div class="time">
          <b>{{activeBar.time * 1000 | time}}</b>
          <b style="margin-left: 20px;" :class="activeBar.quote < 0 ? 'red' : 'green'">
            <span v-show="activeBar.quote > 0">+</span>{{activeBar.quote | f(2)}}%</b>
        </div>
        <div class="item">
          <p>
            <span>{{$t('exchangeNew.text38')}}</span>
            <span>{{activeBar.open}}{{activeCurrency.newCurrency}}</span>
          </p>
          <p>
            <span>{{tradeCurrency}}{{$t('exchangeNew.text38')}}</span>
            <span>{{activeBar.ox | f($parent.pricePlaces)}}{{baseCurrency}}</span>
          </p>
        </div>
        <div class="item">
          <p>
            <span>{{$t('exchangeNew.text39')}}</span>
            <span>{{activeBar.high}}{{activeCurrency.newCurrency}}</span>
          </p>
          <p>
            <span>{{tradeCurrency}}{{$t('exchangeNew.text39')}}</span>
            <span>{{activeBar.hx | f($parent.pricePlaces)}}{{baseCurrency}}</span>
          </p>
        </div>
        <div class="item">
          <p>
            <span>{{$t('exchangeNew.text40')}}</span>
            <span>{{activeBar.low}}{{activeCurrency.newCurrency}}</span>
          </p>
          <p>
            <span>{{tradeCurrency}}{{$t('exchangeNew.text40')}}</span>
            <span>{{activeBar.lx | f($parent.pricePlaces)}}{{baseCurrency}}</span>
          </p>
        </div>
        <div class="item">
          <p>
            <span>{{$t('exchangeNew.text41')}}</span>
            <span>{{activeBar.close}}{{activeCurrency.newCurrency}}</span>
          </p>
          <p>
            <span>{{tradeCurrency}}{{$t('exchangeNew.text41')}}</span>
            <span>{{activeBar.cx | f($parent.pricePlaces)}}{{baseCurrency}}</span>
          </p>
        </div>
      </div>
      <div class="mask" v-show="activeBar.time" @mouseover="activeBar = {}"></div>
      <div id="tv_chart_container" @mouseover="showTooltips = true" @mouseleave="showTooltips = false" class="tv" v-show="chartType === 0" style="height: calc(100% - 48px)"></div>
      <!-- <v-chart style="width: 100%;" v-if="kLineData && chartType === 0" :options="kLineData"></v-chart> -->
      <v-chart style="width: 100%; padding-left: 22px;" :autoresize="true" v-show="deepData && chartType === 1" :options="deepData"></v-chart>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
// 引入 ECharts 主模块
import ECharts from 'vue-echarts'
// 引入相关模块
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// require("echarts/lib/chart/candlestick")
require("echarts/lib/component/grid")
require("echarts/lib/component/tooltip")
require("echarts/lib/component/dataZoom")
// require("echarts/lib/component/visualMap")

import axios from 'axios'



export default {
  props: {
    baseCurrency: String,
    tradeCurrency: String,
    activeCurrency: Object
  },
  data(){
    return {
      kLineData: {},
      deepData: {},
      detail: {},
      kInfo: {},
      priceList: [],
      newBuyList: [],
      newSellList: [],
      chartType: 0,
      timeIndex: 1,
      loading: false,
      tempTradeCurrency: '',
      tvWidget: null,
      timeIndex: 0,
      hideIframe: true,
      activeBar: {},
      allBars: [],
      Datafeed: null,
      position: {},
      showTooltips: false
    }
  },
  components: {
    'v-chart': ECharts
  },
  watch: {
    tradeCurrency () {
      this.tvWidget && this.tvWidget.activeChart().setSymbol(`${this.tradeCurrency}/${this.baseCurrency}`)
    }
  },
  mounted () {
    const _this = this
    const Datafeed = {
  onReady (cb) {
    setTimeout(() => {
      cb({
        "supports_marks": false,
        "supports_time": false,
        "supports_search": false,
        "supports_group_request": false,
        "supported_resolutions": ["1","15","60","240","1D","1W","1M"]
      })
    }, 0)
  },
  resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const symbol = {
      "description": symbolName,
      "exchange-listed": "STOCKCOIN",
      "exchange-traded": "STOCKCOIN",
      "has_intraday": true,
      "has_no_volume": false,
      "has_weekly_and_monthly": true,
      "minmov": 1,
      "minmov2": 0,
      "name": symbolName,
      "pricescale": 100,
      "session": "24x7",
      "supported_resolutions": ["1", "15", "60", "240", "1D", "1W", "1M"],
      "ticker": symbolName,
      "timezone": "Asia/Shanghai",
      "type": "stock",
    }
    setTimeout(() => {
      onSymbolResolvedCallback(symbol)
    }, 0)
  },
  getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    let bars = []
    let path = process.env.VUE_APP_BASE_PATH
    axios.get(`${path}/history?symbol=${symbolInfo.name}&resolution=1&from=${from}&to=${to}`).then(({data}) => {
      if (data.s === 'ok') {
        data.o.forEach((time, index) => {
          const bar = {
            time: data.t[index] * 1000,
            volume: data.v[index],
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
            close: data.c[index],
          }
          bars.push(bar)
          _this.allBars.push({
            ...bar,
            time: data.t[index],
            ox: data.ox[index],
            hx: data.hx[index],
            lx: data.lx[index],
            cx: data.cx[index],
            quote: data.quote[index],
          })
        })

      }
      let meta = {noData: !bars.length}
      if (data.nextTime) {
        meta.nextTime = data.nextTime
      }
      onHistoryCallback(bars, meta)
    })

  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    // stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
    // setTimeout(() => {
    //   onRealtimeCallback({
    //     time: 1606082680 * 1000,
    //     volume: 500,
    //     open: 11000,
    //     high: 11000,
    //     low: 11000,
    //     close: 11000,
    //   })
    // }, 3000)
	},
	unsubscribeBars: subscriberUID => {
		// stream.unsubscribeBars(subscriberUID)
	},
	// calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
  //   const arr = ['1', '15', '60']
	// 	return arr.includes(resolution) ? {resolutionBack: 'M', intervalBack: '1'} : undefined
  // },
  getServerTime (cb) {
    cb(parseInt(new Date().getTime() / 1000))
  }
}
this.Datafeed = Datafeed
    let locale = 'zh'
    const lang = localStorage.getItem('lang')
    if (lang && (lang === 'EN' || lang === 'ES')) {
      locale = lang.toLowerCase()
    }
    this.tvWidget = new TradingView.widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      symbol: `${this.tradeCurrency}/${this.baseCurrency}`,
      interval: '1',
      container_id: "tv_chart_container",
      //	BEWARE: no trailing slash is expected in feed URL
      // datafeed: new Datafeeds.UDFCompatibleDatafeed(process.env.VUE_APP_BASE_PATH),
      datafeed: this.Datafeed,
      // datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
      library_path: "charting_library/",
      locale,
      disabled_features: [
        'header_widget',
        'timeframes_toolbar',
        'display_market_status',
        "volume_force_overlay"
        // 'create_volume_indicator_by_default'
      ],
      enabled_features: [
        // "study_templates"
        "keep_left_toolbar_visible_on_small_screens"
      ],
      // charts_storage_url: 'https://saveload.tradingview.com',
      // charts_storage_api_version: "1.1",
      // client_id: 'tradingview.com',
      // user_id: 'public_user_id',
      theme: 'light',
      // custom_css_url: 'custom.css',
      autosize: true,
      loading_screen: {
        backgroundColor: '#272730'
      },
      overrides: {
        "volumePaneSize": "medium",
        // "mainSeriesProperties.style": 0,
        // "paneProperties.background": '#fff',
        "mainSeriesProperties.candleStyle.upColor": '#12b886',
        "mainSeriesProperties.candleStyle.borderUpColor": '#12b886',
        "mainSeriesProperties.candleStyle.downColor": '#fa5252',

      },
      // studies_overrides: {
      //   "MA Cross.short:plot.color": "#6B3798",
      //   "MA Cross.long:plot.color": "#708957",
      // }
    });
    this.tvWidget.onChartReady(() => {
      this.hideIframe = false
      // 创建均线
      this.tvWidget.chart().createStudy('Moving Average', false, false, [5, 'close', 0], null, {
        'Plot.color': '#34a9ff',
        'Plot.linewidth': 1
      })
      this.tvWidget.chart().createStudy('Moving Average', false, false, [10, 'close', 0], null, {
        'Plot.color': '#ffb620',
        'Plot.linewidth': 1
      })
      this.tvWidget.chart().createStudy('Moving Average', false, false, [15, 'close', 0], null, {
        'Plot.color': '#8750ff',
        'Plot.linewidth': 1
      })
      this.tvWidget.chart().createStudy('Moving Average', false, false, [30, 'close', 0], null, {
        'Plot.color': '#ff688f',
        'Plot.linewidth': 1
      })
      let timer = null
      this.tvWidget.activeChart().crossHairMoved(({time, x, y}) => {
        clearTimeout(timer)
        if (!this.showTooltips) return
        timer = setTimeout(() => {
          const activeBar = this.allBars.find(item => item.time === time)
          this.activeBar = activeBar || {}
          let containerWidth = this.$refs.chartArea.clientWidth
          if (x > containerWidth - 300) {
            this.position.x = x - 190
          } else {
            this.position.x = x + 100
          }
        }, this.activeBar.time ? 100 : 0)
      })
  })
  },
  methods:{
    chartMouseMove (e) {
      console.log(e)
      this.position.x = e.clientX
      this.position.y = e.clientY
    },
    showChartDialog (id) {
      if (this.tvWidget) {
        this.tvWidget.activeChart().executeActionById(id)
        this.tvWidget.closePopupsAndDialogs()
      }
    },
    showFullScreen () {
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement
      || document.mozFullScreenElement || document.msFullscreenElement
      if (isFullscreen) {
        this.exitFullscreen()
      } else {
        this.fullScreen(this.$refs.chartArea)
      }
    },
    fullScreen (ele) {
      const func =
        ele.requestFullscreen ||
        ele.mozRequestFullScreen ||
        ele.webkitRequestFullscreen ||
        ele.msRequestFullscreen;
      func.call(ele);
    },
    exitFullscreen () {
      const func =
        document.exitFullScreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      func.call(document);
    },
    setTime (index) {
      let str
      if (this.tvWidget) {
        console.log(this.tvWidget)
        // ['1min', '15min', '1hour', '4hour', '1day', '1week' ,'1mon']
        switch (index) {
          case 0:
            str = 1
            break
          case 1:
            str = 15
            break
          case 2:
            str = 60
            break
          case 3:
            str = 240
            break
          case 4:
            str = '1D'
            break
          case 5:
            str = '1W'
            break
          case 6:
            str = '1M'
            break
        }
        this.timeIndex = index
        this.tvWidget.activeChart().setResolution(String(str))
      }
    },
    double (num) {
      if (num < 10) {
        return '0' + num
      } else {
        return num
      }
    },
    splitData(rawData) {
      let categoryData = []
      let values = []
      let volumes = []
      for (let i = 0; i < rawData.length; i++) {
        let time = rawData[i].splice(0, 1)[0]
        let date = new Date(time)
        let hour = this.double(date.getHours())
        let min = this.double(date.getMinutes())

        categoryData.push(`${hour}:${min}`)
        values.push(rawData[i])
        volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1])
      }
      return {
        categoryData,
        values,
        volumes
      }
    },
    getData() {
      this.loading = true
      this.$fetch.post('/coinentrustRecord/queryTradeKLine', {
        type: this.timeIndex, // 1:1min 2:15min 3:1hour 4:4hour 5:1day 6:1week 7:1mon
        baseCurrency: this.baseCurrency,
        tradeCurrency: this.tradeCurrency,
      }).then((res) => {
        this.loading = false
        if (res.success) {
          let kData = res.data.KLine
          // this.detail = res.data.tradeVolume
          // this.detail.total = res.data.total
          // this.kInfo = kData[kData.length - 1]
          let lineArr = []
          kData.forEach((item) => {
            // 数据push的顺序不能错
            // let obj = []
            // obj.push(item[5]) // 时间
            // obj.push(item[0]) // 开盘价
            // obj.push(item[3]) // 收盘价
            // obj.push(item[2]) // 最低价
            // obj.push(item[1]) // 最高价
            // obj.push(item[4]) // 总成交数量


            lineArr.push([
              item.sj,
              item.openingPrice,
              item.closingPrice,
              item.minPrice,
              item.maxPrice,
              item.tradeCashAmount,
            ])
          })

          this.kLineData = this.splitData(lineArr)
          this.drawK()
        }
      })
    },
    getDeepData() {
      let pricePlaces = this.$parent.pricePlaces
      let numPlaces = this.$parent.numPlaces

      if (this.tradeCurrency !==  this.tempTradeCurrency) {
        this.loading = true
      }

      this.$fetch.post('/coinentrustRecord/getDepthData', {
        baseCurrency: this.baseCurrency,
        tradeCurrency: this.tradeCurrency,
      }).then((res) => {
        this.loading = false

        this.tempTradeCurrency = this.tradeCurrency
        if (res.success) {
          this.newSellList = []
          this.newBuyList = []
          this.priceList = []
          const buyList = res.data.buy || []
          const sellList = res.data.sell || []
          buyList.reduce((pre, cur) => {
            cur.amount = cur.noMatchAmount
            let val = pre + cur.amount
            cur.total = val
            return val
          }, 0)
          sellList.reduceRight((pre, cur) => {
            cur.amount = cur.noMatchAmount
            let val = pre + cur.amount
            cur.total = val
            return val
          }, 0)
          res.data.buy.reverse().forEach(item => {
            this.newSellList.push('')
            this.newBuyList.push(item.total.toFixed(numPlaces))
            this.priceList.push(item.price.toFixed(pricePlaces))
          })

          res.data.sell.reverse().forEach(item => {
            this.newSellList.push(item.total.toFixed(numPlaces))
            this.newBuyList.push('')
            this.priceList.push(item.price.toFixed(pricePlaces))
          })
          this.drawDeep()
        }
      }) // 𓃒 𓃗 𓃘 𓃝 𓃟 𓃠 𓃡 𓃩 𓃬 𓃯 𓃰 𓃱 𓃲 𓃵 𓃷
    },
    drawK () {
      var upColor = '#48be64'
      var upBorderColor = '#48be64'
      var downColor = '#f3544f'
      var downBorderColor = '#f3544f'
      this.kLineData = {
        grid: [
          {
            top: '5%',
            left: '0',
            right: '6%',
            bottom: '15%',
            height: '68%',
          },
          {
            top: '72%',
            left: '0',
            right: '6%',
            height: '20%'
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              border: '1px solid #777',
              shadowColor: 'transparent',
            },
            lineStyle: {
              type: 'dashed'
            }
          },
          formatter: params => {
            // let d
            // if (params[0].seriesType === 'candlestick') {
            //   d = params[0].data
            // } else {
            //   d = params[1].data
            // }
            // this.kInfo = [
            //   d[1],
            //   d[4],
            //   d[3],
            //   d[2],
            //   d[5]
            // ]
          }
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},

        },
        xAxis: [
          {
            type: 'category',
            data: this.kLineData.categoryData,
            show: false,
            axisLine: {
              lineStyle: {
                color: '#373C52',
                width: 1
              }
            },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: this.kLineData.categoryData,
            scale: true,
            // boundaryGap: ['50%', '50%'],
            // axisLine: {onZero: false},
            // axisTick: {show: false},
            // splitLine: {show: false},
            // axisLabel: {show: false},
            splitNumber: 10,
            min: 'dataMin',
            max: 'dataMax',
            axisLine: {
              lineStyle: {
                color: '#373C52',
                width: 1
              }
            },
          }
        ],
        yAxis: [
          {
            scale: true, // Y轴起始值为数据的最小值
            position: 'right',
            splitLine: {
              lineStyle: {
                color: '#292d3d',
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                color: '#373C52',
                width: 1,
              }
            },
            axisLabel: {
              formatter: val => {
                return parseFloat(val).toFixed(4)
              },
              fontSize: '11px',
            }
          },
          {
            scale: true,
            position: 'right',
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            // axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
          }
        ],
        textStyle: {
          color: '#545361'
        },
        visualMap: {
          show: false,
          seriesIndex: 1,
          dimension: 2,
          pieces: [{
              value: 1,
              color: downColor
          }, {
              value: -1,
              color: upColor
          }]
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 80,
            end: 100
          },
        ],
        series: [
          {
            type: 'candlestick',
            data: this.kLineData.values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            }
          },


          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.kLineData.volumes,
            barWidth: '40%',
            barGap: '0',
          },
            {
            name: 'MA5',
            type: 'line',
            data: this.kLineData.volumes,
            smooth: true,
            showSymbol: false,
            lineStyle: {
                width: 1
            }
          },
        ]
      }
    },
    drawDeep () {
      const that = this
      this.deepData = {
        grid: {
          left: 0,
          right: 0,
          top: '4%',
          bottom: '1%',
          containLabel: true
        },
        animation: false,
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0,
          axisPointer: { // 坐标指示器
            lineStyle: {
              // type: 'dashed',
              // width: 2,
               color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(0, 255, 233,0)'
                    }, {
                        offset: 1,
                        color: 'rgba(255, 255, 255,1)',
                    }, ],
                    global: false
                }
            },
            handle: {
              show: true
            },

          },

          formatter: function (params) {
            //let str = `${params.seriesName}<br>价格：${params.name}<br>总量：${params.value}`
            // return '1212'
            return `${that.$t('exchange.text38')}${params[0].name || params[1].name}<br>${that.$t('exchange.text39')}${params[0].value || params[1].value}`
          }
        },
        xAxis: {
          data: this.priceList,
          splitLine: {
            show: false
          },
          boundaryGap: false,
          axisLabel: {
            formatter: val => {
              return parseFloat(val).toFixed(4)
            },
            fontSize: '11px',
            align: 'left'
          },

        },
        yAxis: [{
          position: 'right',
          splitLine: {
            show: false
          }
        }],
        textStyle: {
          color: '#545361'
        },
        series: [
          {
            // name: this.$t('exchange.text19'),
            type: 'line',
            data: this.newBuyList,
            symbol: "none",
            // step: true,
            itemStyle: {
              color: '#18ca93'
            },
            areaStyle: {
              color: '#253a3b',
            },

          },
          {
            // name: this.$t('exchange.text20'),
            type: 'line',
            data: this.newSellList,
            symbol: "none",
            itemStyle: {
              color: '#f43f5a'
            },
            areaStyle: {
              color: '#3d2934'
            },
          }
        ]
      }
    },
  },
  beforeDestroy () {
    this.tvWidget && this.tvWidget.remove()
  }
}
</script>
<style lang="less" scoped>
@red: #ff415d;
@green: #16dd9f;
.red{
  color: @red !important;
}
.green{
  color: @green !important;
}
.chart{
  flex: 1;
  padding: 0 22px 0 0;
  display: flex;
  flex-direction: column;
  .current-currency{
    margin-left: 22px;
    height: 60px;
    border-bottom: 1px solid @bc;
    .vCenter;
    .c{
      p{
        font-weight: bold;
        font-size: 18px;
        color: #000;
      }
      .shareName{
        font-size: 16px;
        font-weight: bold;
        max-width: 200px;
        overflow: hidden;
        color: #000;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
        vertical-align: -4px;
      }
      span{
        font-size: 12px;
        color: #999;
      }
    }
    .n{
      margin-left: 30px;
      font-size: 12px;
      p{
        font-size: 13px;
      }
    }
    .collect{
      border: 1px solid @blue;
      color: @blue;
      padding: 4px 0;
      border-radius: 2px;
      cursor: pointer;
      width: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.diff{
        border-color: #bbb;
      }
    }
  }
  .actions{
    margin-left: 22px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    line-height: 20px;
    padding: 6px 0;
  }
  .tv{
    padding-left: 10px;
  }
  .icons{
    height: 20px;
    img{
      margin-left: 14px;
      width: 16px;
    }
  }
  .times{
    .item{
      margin-left: 10px;
    }
  }
  .tab{
    border: 1px solid @blueBtn;
    border-radius: 2px;
    .item{
      padding: 0 10px;
      cursor: pointer;
      &.active{
        background: @blueBtn;
        color: #fff;
      }
    }
  }
}
.tooltips{
  position: absolute;
  top: 90px;
  padding: 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  min-width: 220px;
  font-size: 13px;
  .time{
    padding-bottom: 10px;
  }
  .item{
    padding: 4px 0;
    p{
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:first-child{
        color: #000;
        padding-bottom: 2px;
      }
    }
    &:not(first-child){
      border-top: 1px solid #eee;
    }
  }

}
.echarts{
  height: calc(100% - 48px) !important;
}
.intro{
  font-size: 13px;
  padding: 10px 22px 4px;
  display: flex;
  flex-wrap: wrap;
  color: #000;
  white-space: nowrap;
  line-height: 16px;
  > div{
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  p{
    margin-right: 30px;
    & + p{
      color: #999;
      font-size: 12px;
    }
  }
}
.mask{
  &:before,&:after{
    content: '';
    position: absolute;
    bottom: 0;
    height: 100%;
  }
  &:before{
    left: 0;
    width: 65px;
  }
  &:after{
    right: 0;
    width: 47px;
  }
}
</style>
<style>
.hideIframe iframe{
  display: none !important;
}
</style>
