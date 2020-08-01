<template>
  <div class="evaluation-details main-view">
    <div class="base-information">
      <h2>班级基本信息</h2>
      <div v-if="Object.keys(classesInfo).length" class="information-title">
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
            <el-avatar :src="teacherScore.photo" />
            {{ teacherScore.name }}
            <el-rate
              :value="teacherScore.score / 20"
              disabled
              show-score
              text-color="#ff9900"
              :score-template="score(teacherScore)"
            />
          </div>
          <div class="record-list">
            <ul v-if="evaluationItemScore.length">
              <li v-for="item in evaluationItemScore" :key="item.id">
                <h4>
                  {{ item.name }}
                  <el-rate
                    :value="item.score / 20"
                    disabled
                    show-score
                    text-color="#ff9900"
                    :score-template="score(item)"
                  />
                </h4>
                <ul>
                  <li v-for="smallItem in item.children" :key="smallItem.id">
                    {{ smallItem.name }}
                    <div>
                      <el-rate
                        :value="smallItem.score / 20"
                        disabled
                        show-score
                        text-color="#ff9900"
                        :score-template="score(smallItem)"
                      />
                      {{ smallItem.evaluationStudentNumber }}人评价
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <no-data v-else />
          </div>
        </div>
      </div>
      <div class="student-information attendance">
        <h3>考勤信息</h3>
        <div class="main-info">
          <div class="header">
            <h3>
              <span>迟到：{{ teacherSignStatistics.lateTotal || 0 }}次</span>
              <span>未到：{{ teacherSignStatistics.absentTotal || 0 }}次 </span>
            </h3>
          </div>
          <div class="record-list">
            <ul v-if="Object.keys(teacherSignList).length">
              <li v-for="(item, key) in teacherSignList" :key="key">
                <h4>
                  周{{ key | parseTime("{a}") }}
                  <span>{{ key | parseTime("{y}-{m}-{d}") }}</span>
                </h4>
                <ul>
                  <li v-for="v in item" :key="v.id">
                    <p
                      :class="
                        v.teacherSignStatus == 1
                          ? 'normal'
                          : v.teacherSignStatus == 2
                          ? ''
                          : 'no_sign'
                      "
                    >
                      <span>
                        {{
                          v.teacherSignStatus == 1
                            ? "已签"
                            : v.teacherSignStatus == 2
                            ? "迟到"
                            : "未签"
                        }}</span
                      >
                      {{
                        v.teacherSignTime &&
                          "(" + parseTime(v.teacherSignTime, "{h}:{i}") + ")"
                      }}
                    </p>
                    <div class="time">
                      <span>{{ v.startTime }}-{{ v.endTime }}</span>
                      {{ v.title }}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <no-data v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTeacherScore } from "@/api/classes";
  import { parseTime } from "@/utils";

  export default {
    name: "EvaluationDetails",
    data() {
      return {
        value: 4.3,
        classesInfo: {},
        teacherScore: {},
        evaluationItemScore: [],
        teacherSignList: [],
        parseTime,
        teacherSignStatistics: ""
      };
    },
    computed: {
      score() {
        return item => {
          return String(item.score);
        };
      }
    },
    created() {
      const { classesId, teacherId } = this.$route.params;
      getTeacherScore({
        classesId,

        teacherId
      }).then(res => {
        console.log(res);
        if (res) {
          this.classesInfo = res.data.data.classesInfo;
          this.teacherScore = res.data.data.teacherScore;
          this.evaluationItemScore = res.data.data.evaluationItemScore;
          this.teacherSignList = _.groupBy(
            res.data.data.teacherSignList,
            "scheduleDate"
          );
          this.teacherSignStatistics = res.data.data.teacherSignStatistics;
          // console.log(this.teacherSignList);
        }
      });
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
          padding: 0 10px;
          height: 20px;
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
        // border-bottom: #f0f0f0 1px solid;
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
            background-image: url("../../../../assets/images/blue.png");
            background-size: 15px 36px;
            right: -15px;
            top: 0;
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
          // flex: 1;
          justify-content: space-between;
          // align-items: center;
          padding: 6px 25px 15px;
          //padding-top: 6px;
          flex-direction: column;
          > ul {
            > li {
              padding-top: 19px;
              padding-bottom: 10px;
              border-bottom: #e8e8e8 1px solid;
              &:last-child {
                border: 0;
              }
              > h4 {
                font-size: 18px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: rgba(80, 90, 100, 1);
                line-height: 25px;
                display: flex;
                align-items: center;
                margin-bottom: 14px;
                .el-rate {
                  margin-left: 16px;
                }
              }
              > ul {
                > li {
                  font-size: 16px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(168, 176, 185, 1);
                  line-height: 22px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 10px;

                  > div {
                    display: flex;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(42, 148, 255, 1);
                    line-height: 22px;
                    .el-rate {
                      margin-right: 35px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .attendance {
      margin-top: 20px;
      .main-info {
        .header {
          h3 > span {
            font-size: 16px;
            margin-right: 49px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
        }
        .record-list {
          > ul {
            > li {
              border: 0;
              display: flex;
              flex-direction: row;

              h4 {
                display: flex;
                align-items: flex-start;
                span {
                  margin-left: 30px;
                }
              }
              > ul {
                margin-left: 40px;
                li {
                  display: flex;
                  margin-bottom: 20px;
                  justify-content: flex-start;
                  > p {
                    display: flex;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 112, 112, 1);
                    line-height: 22px;
                    width: 105px;
                    span {
                      width: 44px;
                      height: 22px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: rgba(255, 112, 112, 1);
                      border-radius: 11px;
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: rgba(255, 255, 255, 1);
                      margin-right: 5px;
                    }
                    &.no_sign {
                      span {
                        background: rgba(198, 198, 198, 1);
                      }
                    }
                    &.normal {
                      color: rgba(132, 215, 158, 1);
                      span {
                        background: rgba(132, 215, 158, 1);
                      }
                    }
                  }
                  > .time {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(168, 176, 185, 1);
                    display: flex;
                    margin-left: 35px;
                    > span {
                      margin-right: 20px;
                    }
                  }
                  &:last-child {
                    margin-bottom: 0;
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
