<template>
  <input @input="input" type="text" :maxlength="maxLength" :placeholder="placeholder">
</template>

<script>
export default {
  props: {
    placeholder: String,
    maxLength: String,
    reg: RegExp
  },
  methods:{
    input (e) {
      let reg = this.reg || /^([1-9]\d*|0{1})(\.\d{0,4})?/ // 最多四位小数
      let input = e.target
      let val = input.value
      let res = val.match(reg)
      if (res) {
        val = res[0]
      } else {
        val = ''
      }
      input.value = val
      this.$emit('input', val)
    }
  },
}
</script>
