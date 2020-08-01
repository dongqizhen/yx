<template>
  <el-image-viewer
    v-if="showViewer"
    :on-close="closeViewer"
    :url-list="urlList"
  ></el-image-viewer>
</template>

<script>
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";
  export default {
    components: {
      ElImageViewer
    },
    data() {
      return {};
    },
    props: ["showViewer", "urlList"],
    methods: {
      closeViewer() {
        this.$emit("close");
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
