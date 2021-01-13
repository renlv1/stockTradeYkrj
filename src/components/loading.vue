<template>
  <div class="global-loading">
    <!-- <div class="loading-content">
      <div class="wave"></div>
      <div class="loading-img"><img src="@img/loading.png" alt=""></div>
    </div> -->

    <!--<img class="rotate" src="@img/loading.svg" alt="">-->

    <!-- 全局使用element loading -->
    <svg viewBox="25 25 50 50" class="circular">
      <circle r="20" fill="none" class="path" cx="50" cy="50"></circle>
    </svg>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.global-loading {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 98;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  .wave{
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 100%;
    animation: translateY 1.2s ease-out infinite;
    &:before {
        bottom: -55px;
        border-radius: 45%;
        background: #43c718 !important;
    }
    &:after {
        bottom: -60px;
        // opacity: .5;
        // background: #43c718 !important;
        border-radius: 40%;
        animation-delay: .2s;
    }
    &:after, &:before {
        content: "";
        position: absolute;
        left: 50%;
        margin-left: -40px;
        width: 80px;
        height: 80px;
        background-color: #3aaaff;
        animation: rotate 2s linear infinite;
    }
  }
  .loading-content {
    position: relative;
    background: rgba(0,0,0,.8);
    width: 56px;
    height: 35px;
    overflow: hidden;
  }
  .loading-img{
    position: relative;
  }

  .circular {
    height: 42px;
    width: 42px;
    animation: loading-rotate 2s linear infinite;
  }
  .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90,150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #409eff;
    stroke-linecap: round;
  }
}
@keyframes translateY {
  0% {
      transform: translateY(100%);
  }
  100% {
      transform: translateY(-100%);
  }
}
@keyframes rotate {
  0% {
    opacity: 0;
    transform: rotate(0deg);
    // filter: hue-rotate(360deg)
  }
  20%{
    opacity: 0;
  }
  100% {
      transform: rotate(360deg);
      // filter: hue-rotate(0deg)
  }
}

.rotate{
  width: 44px;
  animation: rotate 1s linear infinite;
}
</style>
