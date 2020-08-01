<template>
  <div class="welcome main-view">
    <div class="content">
      <div class="school">{{ school.schoolName }}</div>
      <div class="teacher">{{ name }}</div>
      <span></span>
      <div class="text">Welcome</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  // import { getUserName } from "@/utils/auth";
  export default {
    name: "Index",
    computed: {
      ...mapGetters(["name", "school"])
    },
    methods: {
      // getUserName() {
      //   console.log("用户名", getUserName());
      //   const userName = getUserName();
      //   return userName["Admin-e-c-name"];
      // }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .welcome {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0;
    padding-top: 93px;
    background: url("../../assets/images/welcome.png") no-repeat;
    background-size: 100% auto;
    background-position: left bottom;
    .content {
      position: absolute;
      left: 100px;
      top: 100px;
      color: rgba(42, 148, 255, 1);
      .school {
        margin-bottom: 10px;
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 33px;
      }
      .teacher {
        font-size: 24px;
        margin-bottom: 17px;
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 33px;
      }
      > span {
        display: flex;
        width: 48px;
        height: 3px;
        background: rgba(42, 148, 255, 1);
        margin-bottom: 70px;
      }
      .text {
        font-size: 36px;
        margin-top: 30px;
      }
    }
  }
</style>
