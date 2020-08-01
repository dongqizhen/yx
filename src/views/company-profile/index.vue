<template>
  <div class="company-profile main-view">
    <tinymce v-model="content" :height="300" />
  </div>
</template>

<script>
  import Tinymce from "@/components/Tinymce";
  import { fetchSchool_details } from "@/api/school";
  export default {
    name: "CompanyProfile",
    data() {
      return {
        content: ``
      };
    },
    components: { Tinymce },
    created() {
      fetchSchool_details().then(res => {
        if (res) {
          console.log(res);
          this.content = res.data.data.content;
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  .main-view {
    height: 100%;
  }
</style>
