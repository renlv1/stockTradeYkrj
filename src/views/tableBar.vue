<template>
  <div class="table-w">
    <div class="right-wrap">
      <transition name="">
        <router-view class="right-container" :key="$route.fullPath"></router-view>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /*eslint-disable*/
	export default {
		data() {
			return {
				activeIndex: 0,
				showFlag: true,
				menuList: [
					{
						text: this.$t('accountUser.text1'),
						icon: require('@img/menu/money.png'),
            flag: true,
						children: [
							{text: this.$t('accountUser.text1'), link: '/user/money'},
							{text: this.$t('accountUser.text2'), link: '/user/topDeposit'},
							{text: this.$t('accountUser.text3'), link: '/user/depositAddress'},
						]
					},
					{
						text: this.$t('accountUser.text4'),
						flag: true,
						icon: require('@img/menu/order.png'),
						children: [
							{text: this.$t('accountUser.text5'), link: '/user/exchangeOrder'},
							{text: this.$t('accountUser.text6'), link: '/user/otcOrder'},
						]
					},
					{
						text: this.$t('accountUser.text7'),
						flag: true,
						icon: require('@img/menu/account.png'),
						children: [
							{text: this.$t('accountUser.text8'), link: '/user/accountInfo'},
							{text: this.$t('accountUser.text9'), link: '/user/idCardVerify'},
							{text: this.$t('accountUser.text10'), link: '/user/france'},
						]
					},
        ]
      }
		},
    watch: {
			$route: 'getRoute'
    },
    mounted () {
			this.getRoute()
    },
    methods: {
	    getRoute () {
	    	let route = this.$route.path
		    if (route === '/user/money') this.activeIndex = 0
		    if (route === '/user/topDeposit') this.activeIndex = 0
		    if (route === '/user/depositAddress') this.activeIndex = 0
		    if (route.indexOf('accountInfo') > -1) this.activeIndex = 2
		    if (route === '/user/idCardVerify') this.activeIndex = 2
		    if (route === '/user/france') this.activeIndex = 2
		    if (route.indexOf('exchangeOrder') > -1) this.activeIndex = 1
		    if (route.indexOf('otcOrder') > -1) this.activeIndex = 1
        // this.menuList.forEach((item, index) => {
	      //   this.$refs.child[index].style.height = ''
        // })
		    // this.$refs.child[this.activeIndex].style.height = this.$refs.child[this.activeIndex].scrollHeight + 'px'
      },
	    toogleMenu (index, item) {
		    item.flag = !item.flag
		    this.activeIndex = index

        if ( item.flag === true ) {
	        this.$refs.child[index].style.height = this.$refs.child[index].scrollHeight + 'px'
        } else {
	        this.$refs.child[index].style.height = 0
        }
      }
    }
	}
</script>

<style scoped lang="less">
.table-w{
  background: none;
  display: flex;
  min-height: calc(100vh - 60px);
  @media screen and (max-width: 1300px) {
    .uls{
      width: 240px !important;
    }
  }
  .right-wrap{
    color: #1c1c1c;
    border-radius: 6px;
    flex: 1;
  }
  .right-container{

  }
  .uls{
    color: #fff;
    font-size: 14px;
    // position: fixed;
    // left: 0;
    // top: 70px;
    // bottom: 90px;
    padding-top: 10px;
    background-color: @bg;
    width: 300px;
    margin-right: 10px;
    border-radius: 6px;
    .list{
      &.active-list{
        .icon{
          transform: rotate(180deg) !important;
        }
      }
      .flex-between{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px 0 20px;
        cursor: pointer;
        .icon{
          width: 9px;
          transform: rotate(0);
          transition: all .3s linear;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active-arrow{
            transform: rotate(180deg) !important;
          }
          img{
            width: 100%;
            display: block;
          }
        }
      }
      .item-t{
        display: flex;
        align-items: center;
        height: 50px;
        cursor: pointer;
        .img-box{
          margin-right: 10px;
          width: 16px;
        }
      }
      .child-a{
        overflow: hidden;
        /*height: 0;*/
        transition: height .3s linear;
        &.select-active{
          .child{
            height: 40px;
            line-height: 40px;
            opacity: 1;
          }
        }
        .child{
          height: 40px;
          line-height: 40px;
          padding-left: 50px;
          cursor: pointer;
          overflow: hidden;
          transition: all .3s linear;
          &.router-link-exact-active,&.active{
            background-color: #1f1f27;
          }
        }
      }
    }
  }
}
</style>
