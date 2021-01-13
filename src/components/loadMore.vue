<template>
  <div class="load-list-wrap">
    <loading v-show="total < 0"></loading>
    <slot></slot>
    <div v-if="!list.length" class="empty">
      <!-- <img src="@img/empty.png" alt> -->
      <i class="el-icon-document"></i>
      <p>{{$t('common.empty')}}</p>
    </div>
    <div class="el-pagination-wrap" v-if="list.length">
      <el-pagination
        layout="prev, pager, next"
        @current-change="emit"
        :page-size="pageSize"
        :current-page.sync="pageIndex"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageIndex: this.value,
    }
  },
  props: {
    list: Array,
    total: Number,
    pageSize: {
      type: Number,
      default: 10
    },
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    emit(index) {
      this.$emit('input', index)
      this.$emit('change', index)
    },
    currentPageFn (page) {
    	this.pageIndex = page
    }
  },
  mounted () {
    setTimeout(() => {
      this.$emit('change', this.pageIndex)
    }, 20)
  }
}
</script>

<style lang="less" scoped>
  .load-list-wrap{
    position: relative;
    min-height: 400px;
    /deep/ table{
      border-left: 1px solid #f2f2f2;
      border-right: 1px solid #f2f2f2;
    }
  }
  .empty{
    text-align: center;
    font-size: 13px;
    color: #7d7c8e;
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    .vCenter;
    justify-content: center;
    flex-direction: column;
    i{
      font-size: 60px;
      margin-bottom: 10px;
      opacity: .5;
    }
    img{
      width: 100px;
      margin: 20px 0;
    }
  }
</style>
