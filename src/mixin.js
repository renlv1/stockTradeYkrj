export default {
  methods: {
    $isTwoVal (str) {
      let reg = /^\d+(\.\d{0,2})?$/
      if (!reg.test(str) || str <= 0) {
        return false
      } else {
        return true
      }
    },
	  $debounce(func, delay) {
		  let timer
		  return (...args) => {
			  if (timer) {
				  clearTimeout(timer)
			  }
			  timer = setTimeout(() => {
				  func.apply(this, args)
			  }, delay)
		  }
	  },
	  isEmpty (str) {
		  if (str) {
			  return str
		  } else {
			  return  '-'
		  }
	  },
	  eightNumber (value) { // 保留8位小数点,不四舍五入
		  if (!isNaN(value) && value !== null) {
			  let f = Math.round(value * 100000000) / 100000000
			  let s = f.toString()
			  let rs = s.indexOf('.')
			  if (rs < 0) {
				  rs = s.length
				  s += '.'
			  }
			  while (s.length <= rs + 8) {
				  s += '0'
			  }
			  return s
		  } else {
			  return ''
		  }
	  },
    $isFourVal (str) {
      let reg = /^\d+(\.\d{0,4})?$/
      if (!reg.test(str) || str <= 0) {
        return false
      } else {
        return true
      }
    },
    $previewImg (url) {
      this.$msgbox({
        title: '',
        message: this.$createElement('img', {attrs: {
          src: url
        }}),
        customClass: 'preview-dialog'
      })
    },
    $payWay (payStr = '') {
      let arr = []
      if (payStr.includes('"bankType":1')) {
        arr.push(this.$t('otcTrade.text16'))
      }
      if (payStr.includes('"bankType":2')) {
        arr.push(this.$t('otcTrade.text17'))
      }
      return arr.join(', ')
    },
  }
}
