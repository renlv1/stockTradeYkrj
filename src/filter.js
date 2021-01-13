function toDouble(value) {
  if (value < 10) {
    return '0' + value
  }
  return value
}

// 保留n位小数点,不四舍五入
export const f = (value, n = 4) => {
  value = parseFloat(value)
  let str = ''
  if (value) {
    const index = String(value).indexOf('.')
    if (index > 0) {
      const arr = String(value).split('.')
      if (arr[1].length >= n) {
        str = `${arr[0]}.${arr[1].slice(0, n)}`
      } else {
        str = value.toFixed(n)
      }
    } else {
      str = value.toFixed(n)
    }
    return str
  } else {
    return (0).toFixed(n)
  }
}

// 时间格式化
export const time = (time, separator = '.', showType = 1) => {
  if (time) {
    if (typeof time === 'string' && time.includes('-')) {
      time = time.replace(/-/g, '/')
    }
    let d = new Date(parseInt(time))
    let day = d.getDate()
    let month = d.getMonth() + 1
    let year = d.getFullYear()
    let hours = d.getHours()
    let min = d.getMinutes()
    let sec = d.getSeconds()
    let str = year + separator + toDouble(month) + separator + toDouble(day)
    if (showType === 1) {
      str += ' ' + toDouble(hours) + ':' + toDouble(min)
    } else if (showType === 2) {
      str = `${toDouble(hours)}:${toDouble(min)}:${toDouble(sec)}`
    }
    return str
  } else {
    return '- -'
  }
}
