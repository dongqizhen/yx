<template>
  <div class="nodata el-table__empty-block">
    <span class="el-table__empty-text">暂无数据</span>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .nodata {
    min-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    border-radius: 12px;
    span {
      line-height: 60px;
      width: 50%;
      font-size: 14px;
      color: #909399;
    }
  }
</style>
