/*
  * 公共弹窗组件
  * @param {Option}
  * 调用方式
  * Dialog(param)
*/

import Vue from 'vue'
import dialogVue from './index.vue'

// 设置中/英文默认按钮文字
let lang = localStorage.getItem('lang')
let OK_TEXT = lang === 'EN' ? 'Sure' : '确定'
let CANCEL_TEXT = lang === 'EN' ? 'Cancel' : '取消'

let defaults = {
  type: 'alert', // 弹框类型 alert、confirm
  title: '', // 标题
  msg: '', // 内容文字
  okText: OK_TEXT, // 确定按钮文字
  cancelText: CANCEL_TEXT, // 取消按钮文字
  okFn: null, // 确定按钮回调函数
  cancleFn: null, // 取消按钮回调函数
  align: 'center', // 内容文字对齐方式
  // btn: ''
}
let instance = null
let DialogConstructor = Vue.extend(dialogVue)
let initInstance = () => {
  instance = null
  instance = new DialogConstructor({
    el: document.createElement('div')
  })
}

const Dialog = (options = {}) => {
  initInstance()
  let mergeOptions = Object.assign({}, defaults, options)

  Object.keys(mergeOptions).forEach(prop => {
    instance[prop] = mergeOptions[prop]
  })

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })
}

export default Dialog
