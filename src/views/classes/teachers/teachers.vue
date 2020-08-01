<template>
  <div class="teachers main-view">
    <div class="base-information">
      <h2>班级基本信息</h2>
      <div class="information-title" v-if="Object.keys(classesInfo).length">
        <h3>
          <span>{{ classesInfo.professionName }}</span
          >{{ classesInfo.name }}
        </h3>
        <div>
          <div class="time">
            {{ classesInfo.startTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
            <span>至</span>
            {{ classesInfo.endTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </div>
          <span>班主任：{{ classesInfo.teacherInChargeName }}</span>
          <span>学生数量：{{ classesInfo.studentTotal }}</span>
        </div>
      </div>
      <div class="student-information">
        <h3>基本信息</h3>
        <div class="main-info">
          <div class="header">
            <span>班任信息</span>
            <el-avatar :src="teacherInCharge.photo"></el-avatar>
            {{ teacherInCharge.name }}
          </div>
          <div class="record-list">
            <h5>任教信息</h5>
            <el-row class="main">
              <el-col
                :span="8"
                v-for="item in teacherList"
                :key="item.id"
                @click.native="linkToDetail(item.id)"
              >
                <div class="grid-content bg-purple-dark">
                  <el-avatar :src="item.photo"></el-avatar>
                  {{ item.name }}
                  <el-rate
                    :value="item.score / 20"
                    disabled
                    show-score
                    text-color="#ff9900"
                    :score-template="score(item)"
                  >
                  </el-rate>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTeacherDetail } from "@/api/classes";
  export default {
    name: "Teachers",
    data() {
      return {
        classesInfo: {},
        teacherInCharge: {},
        teacherList: []
      };
    },
    created() {
      console.log(this.$route.params.classesId);
      getTeacherDetail({ id: this.$route.params.classesId }).then(res => {
        console.log("获取教师详情：：：", res);
        if (res) {
          this.classesInfo = res.data.data.classesInfo;
          this.teacherInCharge = res.data.data.teacherInCharge;
          this.teacherList = res.data.data.teacherList;
        }
      });
    },
    computed: {
      score() {
        return item => {
          return String(item.score);
        };
      }
    },
    methods: {
      linkToDetail(id) {
        this.$router.push({
          name: "EvaluationDetails",
          params: { teacherId: id }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .base-information {
    width: 100%;
    > h2 {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(80, 90, 100, 1);
      margin: 0;
      height: 25px;
      line-height: 25px;
      margin-bottom: 7px;
    }
    .information-title {
      height: 80px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 12px 0px rgba(202, 202, 202, 0.5);
      border-radius: 12px;
      width: 700px;
      padding: 16px;
      margin-bottom: 20px;
      > h3 {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(80, 90, 100, 1);
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        span {
          display: flex;
          min-width: 80px;
          height: 20px;
          padding: 0 10px;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            rgba(220, 156, 255, 1) 0%,
            rgba(185, 85, 255, 1) 100%
          );
          margin-right: 6px;
          border-radius: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
      > div {
        display: flex;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(168, 176, 185, 1);
        line-height: 20px;
        .time {
          > span {
            margin: 0 17px;
          }
        }
        > span {
          &:nth-child(2) {
            margin: 0 65px;
          }
        }
      }
    }
    .student-information {
      h3 {
        height: 38px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(80, 90, 100, 1);
        border-bottom: #f0f0f0 1px solid;
      }
      .main-info {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        // padding: 0 16px;
        //  height: 240px;
        padding: 15px 0;
        display: flex;
        flex-direction: column;
        padding-bottom: 0;
        > .header {
          display: flex;
          align-items: center;
          height: 36px;
          padding: 0 25px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          background: linear-gradient(
            135deg,
            rgba(90, 176, 255, 1) 0%,
            rgba(0, 132, 255, 1) 100%
          );
          position: relative;
          &::before {
            content: "";
            width: 15px;
            display: flex;
            height: 36px;
            position: absolute;
            background-image: url("../../../assets/images/blue.png");
            background-size: 15px 36px;
            right: -14px;
          }
          span {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            margin-right: 24px;
          }
          >>> .el-avatar {
            height: 50px;
            width: 50px;
            margin-right: 9px;
          }
        }
        .record-list {
          display: flex;
          flex: 1;
          justify-content: space-between;
          // align-items: center;
          padding: 0 25px;
          flex-direction: column;
          > h5 {
            display: flex;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(80, 90, 100, 1);
            line-height: 22px;
            margin: 26px 0 14px;
          }
          > .main {
            display: flex;
            // padding-top: 24px;
            flex-wrap: wrap;
            .el-col {
              margin-bottom: 20px;
              height: 50px;
              .bg-purple-dark {
                height: 100%;
                padding-left: 15px;
                &:hover {
                  background: rgba(237, 237, 237, 1);
                  border-radius: 6px;
                  //opacity: 0.29;
                  height: 50px;
                }
              }
            }
            .grid-content {
              display: flex;
              align-items: center;
              cursor: pointer;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(75, 75, 75, 1);
              .el-avatar {
                margin-right: 9px;
              }
              .el-rate {
                margin-left: 9px;
                >>> .el-rate__item {
                  .el-rate__icon {
                    font-size: 20px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .information-wrapper {
    }
  }
</style>
