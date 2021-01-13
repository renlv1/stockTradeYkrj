/*  eslint-disable */
// Ajax拦截库
!function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){r(1)(window)},function(t,n){t.exports=function(t){var n="RealXMLHttpRequest";t.hookAjax=function(t){function r(n){return function(){var r=this.hasOwnProperty(n+"_")?this[n+"_"]:this.xhr[n],e=(t[n]||{}).getter;return e&&e(r,this)||r}}function e(n){return function(r){var e=this.xhr,i=this,o=t[n];if("function"==typeof o)e[n]=function(){t[n](i)||r.apply(e,arguments)};else{var u=(o||{}).setter;r=u&&u(r,i)||r;try{e[n]=r}catch(t){this[n+"_"]=r}}}}function i(n){return function(){var r=[].slice.call(arguments);if(!t[n]||!t[n].call(this,r,this.xhr))return this.xhr[n].apply(this.xhr,r)}}return window[n]=window[n]||XMLHttpRequest,XMLHttpRequest=function(){var t=new window[n];for(var o in t){var u="";try{u=typeof t[o]}catch(t){}"function"===u?this[o]=i(o):Object.defineProperty(this,o,{get:r(o),set:e(o),enumerable:!0})}this.xhr=t},window[n]},t.unHookAjax=function(){window[n]&&(XMLHttpRequest=window[n]),window[n]=void 0},t.default=t}}]);

const devPath = process.env.VUE_APP_DEV_PATH
const proPath = process.env.VUE_APP_PRO_PATH
const storageUrl = sessionStorage.getItem('BASE_PATH')
let selectEl = null

hookAjax({
  open: arg => {
    const url = arg[1]
    if (storageUrl) {
      if (!url.includes(storageUrl)) {
        arg[1] = selectEl.value
      }
    }
  }
})



let template = `
  <select id="selectEnv" style="position: fixed;right: 0;top: 0;z-index: 99;">
    <option value="${devPath}">测试环境</option>
    <option value="${proPath}">正式环境</option>
  </select>`

let el = document.createElement('template')
el.innerHTML = template.trim()
selectEl = document.body.appendChild(el.content.firstChild)

selectEl.addEventListener('change', e => {
  sessionStorage.setItem('BASE_PATH', e.target.value)
  location.reload(true)
})

if (proPath === storageUrl) {
  selectEl.selectedIndex = 1
}


