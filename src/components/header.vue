<template>
  <div class="header">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display:none;"><symbol id="asset" null><path data-name="路径 110" d="M17.6 6.958h-.443V4.293a1.975 1.975 0 0 0-1.973-1.973h-.409v-.99A1.331 1.331 0 0 0 13.445 0H1.617A1.618 1.618 0 0 0 0 1.594V14.67A1.331 1.331 0 0 0 1.33 16h13.856a1.975 1.975 0 0 0 1.973-1.973v-2.668h.441a1.041 1.041 0 0 0 1.04-1.04V7.998a1.047 1.047 0 0 0-1.04-1.04zM1.617.918h11.829a.413.413 0 0 1 .413.409v.994H1.617a.7.7 0 0 1 0-1.4zm14.62 13.106a1.057 1.057 0 0 1-1.055 1.055H1.327a.414.414 0 0 1-.413-.413V3.078a1.61 1.61 0 0 0 .7.161h13.568a1.057 1.057 0 0 1 1.055 1.055v2.665h-3.131a1.041 1.041 0 0 0-1.04 1.04v2.321a1.041 1.041 0 0 0 1.04 1.04h3.131zm1.483-3.7a.121.121 0 0 1-.122.122H13.11a.121.121 0 0 1-.122-.122V7.998a.123.123 0 0 1 .122-.122h4.49a.123.123 0 0 1 .122.122v2.321z"/></symbol><symbol id="language" viewBox="0 0 16 16"><path data-name="路径 111" d="M13.657 2.343A8 8 0 0 0 2.343 13.657 8 8 0 0 0 13.657 2.343zM8.469 5.009a14.616 14.616 0 0 0 2.444-.276 13.235 13.235 0 0 1 .377 2.8H8.469zm0-.938V1.016a3.487 3.487 0 0 1 1.775 1.868 8.258 8.258 0 0 1 .4.948 13.73 13.73 0 0 1-2.174.239zm-.938-3.055v3.055a13.738 13.738 0 0 1-2.174-.239 8.255 8.255 0 0 1 .4-.948 3.487 3.487 0 0 1 1.774-1.868zm0 3.992v2.523h-2.82a13.237 13.237 0 0 1 .377-2.8 14.616 14.616 0 0 0 2.444.276zM3.773 7.531H.953a7 7 0 0 1 1.373-3.739 9.587 9.587 0 0 0 1.85.721 14.216 14.216 0 0 0-.4 3.018zm0 .938a14.215 14.215 0 0 0 .4 3.018 9.587 9.587 0 0 0-1.85.721 7 7 0 0 1-1.37-3.739zm.938 0h2.82v2.523a14.616 14.616 0 0 0-2.444.276 13.235 13.235 0 0 1-.376-2.799zm2.821 3.461v3.054a3.487 3.487 0 0 1-1.775-1.868 8.258 8.258 0 0 1-.4-.948 13.73 13.73 0 0 1 2.174-.239zm.938 3.054v-3.055a13.738 13.738 0 0 1 2.174.239 8.255 8.255 0 0 1-.4.948 3.487 3.487 0 0 1-1.775 1.868zm0-3.992V8.469h2.821a13.237 13.237 0 0 1-.377 2.8 14.616 14.616 0 0 0-2.444-.276zm3.758-2.523h2.82a7 7 0 0 1-1.373 3.739 9.587 9.587 0 0 0-1.85-.721 14.215 14.215 0 0 0 .402-3.018zm0-.937a14.215 14.215 0 0 0-.4-3.018 9.588 9.588 0 0 0 1.85-.721 7 7 0 0 1 1.373 3.739zm.819-4.472a8.881 8.881 0 0 1-1.487.556 9.255 9.255 0 0 0-.477-1.151 6.533 6.533 0 0 0-.7-1.116 7.039 7.039 0 0 1 2.609 1.658l.052.053zM5.615 1.349a6.533 6.533 0 0 0-.7 1.116 9.253 9.253 0 0 0-.477 1.151 8.883 8.883 0 0 1-1.487-.556l.052-.053a7.039 7.039 0 0 1 2.612-1.658zM2.954 12.941a8.881 8.881 0 0 1 1.487-.556 9.25 9.25 0 0 0 .477 1.151 6.533 6.533 0 0 0 .7 1.116 7.039 7.039 0 0 1-2.609-1.658zm7.431 1.711a6.532 6.532 0 0 0 .7-1.116 9.253 9.253 0 0 0 .477-1.151 8.884 8.884 0 0 1 1.487.556l-.052.053a7.038 7.038 0 0 1-2.612 1.657z"/></symbol><symbol id="login" viewBox="0 0 16 16"><path data-name="路径 112" d="M14.548.01c-.017 0-.031-.01-.048-.01H7.333a2 2 0 0 0-2 2v.667a.667.667 0 1 0 1.333 0V2a.668.668 0 0 1 .667-.667h3.106l-.2.068a1.34 1.34 0 0 0-.9 1.265v10h-2A.668.668 0 0 1 6.666 12v-1.333a.667.667 0 0 0-1.333 0V12a2 2 0 0 0 2 2h2v.667A1.335 1.335 0 0 0 10.666 16a1.4 1.4 0 0 0 .425-.066l4.005-1.335a1.34 1.34 0 0 0 .9-1.265v-12A1.336 1.336 0 0 0 14.548.01zm0 0"/><path data-name="路径 113" d="M7.138 6.196L4.471 3.529A.666.666 0 0 0 3.333 4v2H.667a.667.667 0 0 0 0 1.333h2.666v2a.666.666 0 0 0 1.138.471l2.667-2.667a.666.666 0 0 0 0-.941zm0 0"/></symbol><symbol id="order" null><path data-name="路径 106" d="M8.55 9.988H3.932a.468.468 0 1 0 0 .936H8.55a.468.468 0 1 0 0-.936z"/><path data-name="路径 109" d="M8.55 6.988H3.932a.468.468 0 1 0 0 .936H8.55a.468.468 0 1 0 0-.936z"/><path data-name="路径 108" d="M10.672 1.608v-.2A1.407 1.407 0 0 0 9.268 0H3.152a1.407 1.407 0 0 0-1.4 1.406v.2A2.35 2.35 0 0 0 0 3.875v9.781A2.345 2.345 0 0 0 2.34 16h7.739a2.345 2.345 0 0 0 2.34-2.344V3.875a2.35 2.35 0 0 0-1.747-2.267zm-7.988-.2a.469.469 0 0 1 .468-.469h6.116a.469.469 0 0 1 .468.469v1.155a.469.469 0 0 1-.468.469H3.152a.469.469 0 0 1-.468-.469zm8.8 12.25a1.407 1.407 0 0 1-1.4 1.406H2.34a1.407 1.407 0 0 1-1.4-1.406V3.875A1.41 1.41 0 0 1 1.748 2.6a1.406 1.406 0 0 0 1.4 1.369h6.116a1.406 1.406 0 0 0 1.4-1.369 1.41 1.41 0 0 1 .812 1.275z"/></symbol><symbol id="user" viewBox="0 0 16 16"><path d="M14.731 10.157a7.494 7.494 0 0 0-1.911-1.2.625.625 0 1 0-.508 1.142 6.251 6.251 0 0 1 1.594.993 2.492 2.492 0 0 1 .844 1.873v1.156a.626.626 0 0 1-.625.625H1.875a.626.626 0 0 1-.625-.625v-1.152a2.492 2.492 0 0 1 .844-1.869A8.786 8.786 0 0 1 8 9.25a4.63 4.63 0 1 0-2.817-.96 8.689 8.689 0 0 0-3.914 1.866A3.742 3.742 0 0 0 0 12.969v1.156A1.877 1.877 0 0 0 1.875 16h12.25A1.877 1.877 0 0 0 16 14.125v-1.156a3.742 3.742 0 0 0-1.269-2.812zM4.625 4.625A3.375 3.375 0 1 1 8 8a3.379 3.379 0 0 1-3.375-3.375zm0 0"/></symbol></svg>
    <div class="wrap nav row">
      <div class="row left">
        <router-link class="logo vCenter" to="/"><img src="@img/logo2.svg" height="32" alt=""></router-link>
        <router-link class="link link2" v-for="(item, index) in list" exact :key="index" :to="item.link">{{item.text}}</router-link>
      </div>
      <div class="row right">
        <template v-if="$store.getters.isLogin">
          <router-link to="/exchangeOrder" class="link">
            <svg class="svg" style="width: 14px">
              <use xlink:href="#order"></use>
            </svg>
            {{$t('common.header.text5')}}
          </router-link>
          <router-link to="/user/money" class="link">
            <svg class="svg">
              <use xlink:href="#asset"></use>
            </svg>
            {{$t('common.header.text4')}}
          </router-link>
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="fk"
            transition="el-zoom-in-top"
            style="min-width: auto"
            v-model="visibleUser">
            <div class="pop" @click="visibleUser = false">
              <router-link to="/user/accountInfo" class="item">{{$t('common.header.text2')}}</router-link>
              <router-link to="/user/exchangeRecord" class="item">{{$t('common.header.text3')}}</router-link>
              <div class="item pointer cred" @click="logout">{{$t('common.header.text14')}}</div>
            </div>
            <div slot="reference" class="link link-a">
              <svg class="svg">
                <use xlink:href="#user"></use>
              </svg>
              {{$store.state.user.nickName}}
              <div class="el-icon-caret-bottom" style="font-size: 12px; vertical-align: 2px"></div>
            </div>
          </el-popover>
        </template>
        <template v-else>
          <router-link class="link" to="/login">
            <svg class="svg">
              <use xlink:href="#login"></use>
            </svg>
            {{$t('common.header.text15')}}
          </router-link>
        </template>
        <el-popover
          placement="top"
          trigger="hover"
          popper-class="fk"
          transition="el-zoom-in-top"
          v-model="visibleLang">
          <div class="pop" @click="visibleLang = false">
            <div @click="switchLang('CN')" class="item pointer">中文</div>
            <div @click="switchLang('EN')" class="item pointer">EN</div>
          </div>
          <div slot="reference" class="link">
            <svg class="svg">
              <use xlink:href="#language"></use>

            </svg>
            <span v-if="lang === 'EN'"> EN </span>
            <span v-else> 中文 </span>
            <div class="el-icon-caret-bottom" style="font-size: 12px; vertical-align: 2px"></div>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visibleOrder: false,
      visibleUser: false,
      visibleLang: false,
      lang: localStorage.getItem('lang'),
    }
  },
  computed: {
    isbusinessman () {
      return this.$store.state.user.isbusinessman
    },
    list () {
      let isbusinessman = this.isbusinessman
      let arr = [
        {
          text: this.$t('common.header.text1'),
          link: '/quote'
        },
      ]
      return arr
    }
  },
  methods: {
    logout () {
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post('/user/logout').then(res => {
        if (res.success) {
          this.$store.commit('CLEAR_ACCOUNT')
          this.$router.push('/login')
        }
      })
    },
    switchLang (lang) {
      localStorage.setItem('lang', lang)
      location.reload()
    }
  }
};
</script>

<style lang="less" scoped>
.header{
  background: #17233b;
  color: #fff;
  line-height: 80px;
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  font-size: 16px;
  border-bottom: 1px solid rgba(255,255,255,.1);
  min-width: 900px;
  .logo{
    margin-right: 50px;
  }
  .nav{
    margin-left: 40px;
    .link{
      width: 110px;
      color: #fff;
      &.active, &:hover{
        color: @blue;
      }
    }
    .es & .left .link, .en & .left .link{
      width: 160px;
      line-height: 18px;
      text-align: center;
      font-size: 15px;
    }
    .link2{
      text-align: left !important;
      width: 110px !important;
    }
  }
  .right{
    margin-right: -10px;
    .link{
      width: auto;
      padding: 0 10px;
      margin: 0 10px;
      font-size: 15px;
    }
    .link-a{
      user-select: none;
    }
    img{
      vertical-align: -2px;
      margin-right: 6px;
    }
  }
  div.link{
    cursor: pointer;

  }
}
.pop{
  line-height: 34px;
  .item{
    display: block;
    text-align: center;
    &:hover, &.active{
      color: @blue;
    }
  }

}
.el-icon-s-custom{
  background: #ccc;
  border-radius: 50%;
  padding: 6px;
  color: #333;
}
.svg{
  width: 18px;
  height: 16px;
  vertical-align: -2px;
  margin-right: 2px;
  fill: currentColor;
}
</style>
<style lang="less">
.fk.el-popover{
  min-width: 110px;
  margin-top: -15px;
}
</style>

