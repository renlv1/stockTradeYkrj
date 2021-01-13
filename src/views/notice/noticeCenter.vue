<template>
  <div class="c-page">
    <div class="wrap wrap-content">
      <div class="back-a">
        <div class="back-w" @click="$router.push('/quote')">
          <div>
            <img src="@img/menu/goback.png" alt="">
          </div>
          <span class="back-text">{{$t('accountUser.text11')}}</span>
        </div>
      </div>
      <div class="content-title">
        <h3>{{$t('notice.text1')}}</h3>
      </div>
      <ul class="notice-list">
        <load-more
          ref="loadMore"
          @change="getData"
          :list="list"
          :pageSize="pageSize"
          :total="total">
          <li v-for="(item, index) in list" :key="index" class="clearfix">
            <div class="title-w">
              <p class="title">{{item.title}}</p>
              <p class="list-date">{{item.createtime | time}}</p>
            </div>
<!--            <div>{{item.smallTitle}}</div>-->
            <div class="list-content" :class="{'all-content': item.flag}" ref="liCon"><span class="content-a">{{item.content}}</span><span class="close-btn"  @click="allFn2($event, item, index)">{{$t('notice.text2')}}</span></div>
            <div class="all-btn" @click="allFn($event, item, index)" v-show="item.show">{{$t('userA.text10')}}</div>
          </li>
        </load-more>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "noticeList",
  data() {
    return {
      fold: false,
      liConHeight: 66, //4行文字的高度
      pageSize: 20,
      pageIndex: 1,
      list: [],
      total: -1,
    }
  },
  mounted() {
  },
  computed: {},
  methods: {
	  allFn (e, item, i) {
		  let liCon = e.target.parentElement
		  liCon.classList.add('open');
		  liCon.classList.remove('close');
		  // e.target.innerHTML = ''
    },
	  allFn2 (e, item, i) {
		  let liCon = e.target.parentElement.parentElement
		  liCon.classList.add('close');
		  liCon.classList.remove('open');
    },
    getData(pageIndex) {
      if (pageIndex) {
        this.pageIndex = pageIndex
      } else {
        pageIndex = 1;
        this.$refs.loadMore.pageIndex = 1
      }

      this.$fetch.post('/notice/noticeList ', {
        pageIndex: pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        if (res.success) {
          this.list = res.data;
          this.total = res.mapData.totalRecord;
	        setTimeout(() => {
		        for (let i = 0; i < this.list.length; i++) {
			        if (this.$refs.liCon[i].offsetHeight < this.liConHeight) {
				        this.$set(this.list[i], 'show', false)
			        } else {
				        this.$set(this.list[i], 'show', true)
			        }
			        this.$set(this.list[i], 'text', this.$t('notice.text3'))
		        }
	        }, 500)
        }
      })
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrap-content {
    width 1400px
    min-width 1080
    margin 30px auto
    color #1c1c1c
    @media screen and (max-width: 1600px) {
      width 80%
    }
    .back-a{
      display: flex;
      margin-bottom: 40px
      .back-w{
        display: flex;
        align-items: center;
        cursor: pointer;
        .back-text{
          font-size: 14px;
          color: #639cff;
          margin-left: 6px;
        }
      }
    }
    .content-title {
      h3{
        font-size: 20px
        font-weight: bold
      }
    }
    .notice-list {
      li {
        padding 20px 0
        line-height 1.6
        border-bottom: 1px solid #f4f4f4
        &.open{
          .list-content{
            max-height initial !important
            overflow auto !important
          }
          .content-a{
            overflow auto !important
            display: inline !important
            max-height initial !important
          }
          .close-btn{
            display: inline-block !important
          }
          .all-btn{
            display: none
          }
        }
        &.close{
          .list-content{
            max-height: 66px
            overflow hidden
          }
          .content-a{
            font-size: 14px
            display -webkit-box
            max-height: 66px
            text-overflow ellipsis
            overflow hidden
            -webkit-box-orient vertical
            vertical-align top
            -webkit-line-clamp 3
          }
        }
        .title-w{
          display: flex
          align-items center
          justify-content space-between
          margin-bottom: 10px
        }
        .title{
          font-size: 16px
        }
        .list-date {
          color #b3b3b3
        }
        .list-content {
          max-height: 66px
          overflow hidden

          .close-btn{
            color #2492f5
            cursor pointer
            padding: 0 10px 0 20px
            display: none
          }
          .content-a{
            font-size: 14px
            display -webkit-box
            max-height: 66px
            text-overflow ellipsis
            overflow hidden
            -webkit-box-orient vertical
            vertical-align top
            -webkit-line-clamp 3
          }
        }
        .all-btn{
          cursor pointer
          color #2492f5
          vertical-align top
          padding-left: 10px
          text-align: right
          display inline-block
          float right
          background-color: rgba(255,255,255,.8)
        }
      }
    }
  }
</style>
