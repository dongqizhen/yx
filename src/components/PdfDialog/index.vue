<template>
  <el-dialog :visible.sync="dialogPdfVisible" @close="$emit('close')">
    <div class="content-box">
      <embed v-if="dialogPdfVisible" :src="pdfUrl" />
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialogPdfVisible: false
      };
    },
    props: ["pdfUrl", "visible"],
    watch: {
      pdfUrl(newValue) {
        this.pdfUrl = newValue;
      },
      visible(newValue) {
        this.dialogPdfVisible = newValue;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
    >>> .el-dialog {
      margin-top: 2vh !important;
      margin-bottom: 2vh;
      height: calc(100% - 4vh);
      .el-dialog__body {
        width: 100%;
        height: calc(100% - 30px);
        .content-box {
          width: 100%;
          height: 100%;
          overflow: hidden;
          embed {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>