<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App"
  };
</script>
<style lang="scss">
  .main-view {
    min-height: 100% !important;
    overflow: auto;
    padding: 30px;
    padding-top: 26px;
    background: rgba(247, 247, 247, 1);
  }
</style>
