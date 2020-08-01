<template>
  <div class="student-details main-view">
    <div class="base-information">
      <h2>课程基本信息</h2>
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
          <div v-if="Object.keys(details).length" class="header">
            <el-avatar :src="details.studentScore.photo" />
            {{ details.studentScore.name }}
            <el-rate
              :value="details.studentScore.score / 20"
              disabled
              show-score
              text-color="#ff9900"
              :score-template="score(details.studentScore)"
            />
          </div>
          <div v-if="Object.keys(details).length" class="record-list">
            <ul>
              <li>
                <div>
                  <span class="pre">预习</span>
                  {{ details.previewScore.description }}
                </div>

                <el-rate
                  :value="details.previewScore.score / 20"
                  disabled
                  :max="5"
                  show-score
                  text-color="#ff9900"
                  :score-template="score(details.previewScore)"
                />
              </li>
              <li>
                <div>
                  <span class="teaching">课中</span>
                  {{ details.performanceScore.description }}
                </div>

                <el-rate
                  :value="details.performanceScore.score / 20"
                  disabled
                  :max="5"
                  show-score
                  text-color="#ff9900"
                  :score-template="score(details.performanceScore)"
                />
              </li>
              <li>
                <div>
                  <span class="afterClass">课后</span>
                  {{ details.homeworkScore.description }}
                </div>

                <el-rate
                  :value="details.homeworkScore.score / 20"
                  disabled
                  :max="5"
                  show-score
                  text-color="#ff9900"
                  :score-template="score(details.homeworkScore)"
                />
              </li>
            </ul>
            <span @click="toLearningDetail">详&nbsp;&nbsp;情</span>
          </div>
        </div>
        <time-table
          v-for="(item, i) in tableData"
          :key="i"
          read-only
          :table-data="item || []"
          :type="1"
          :rank-value="rankValue"
          @pre="pre"
          @next="next"
        />
      </div>
    </div>
  </div>
</template>

<script>
  // FIXME 学生课程表修复
  import TimeTable from "@/components/TimeTable";
  import {
    fetchClasses_everyStudentScore,
    fetchClasses_timeTable
  } from "@/api/classes";

  export default {
    name: "StudentDetails",
    components: {
      TimeTable
    },
    data() {
      return {
        tableData: [],
        classesInfo: {},
        details: {},
        rankValue: 0
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
      this.getStudent_score();
      this.getTimeTable();
    },
    methods: {
      toLearningDetail() {
        this.$router.push({ name: "LearningDetails" });
      },
      async getStudent_score() {
        const { studentId, classesId } = this.$route.params;
        await fetchClasses_everyStudentScore({
          studentId,
          classesId
        }).then(res => {
          if (res) {
            const { classesInfo, ...details } = res.data.data;
            this.details = details;
            this.classesInfo = classesInfo;
          }
        });
      },
      pre(rankValue) {
        this.getTimeTable(rankValue);
      },
      next(rankValue) {
        // console.log(rankValue);
        this.getTimeTable(rankValue);
      },
      async getTimeTable(rankValue = this.rankValue) {
        const { studentId, classesId } = this.$route.params;

        await fetchClasses_timeTable({
          studentId,
          classesId,
          rankValue
        }).then(res => {
          if (res) {
            const { weekList, rankValue } = res.data.data;
            this.tableData = weekList;

            this.rankValue = rankValue;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .student-details {
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
          border-bottom: #f0f0f0 1px solid;
        }
        .main-info {
          background: rgba(255, 255, 255, 1);
          border-radius: 16px;
          // padding: 0 16px;
          height: 240px;
          padding: 15px 0;
          display: flex;
          flex-direction: column;
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
              top: 0;
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
            align-items: center;
            padding: 0 25px;
            ul {
              display: flex;
              flex-direction: column;
              padding-top: 32px;
              li {
                display: flex;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                line-height: 22px;
                align-items: center;
                margin-bottom: 30px;
                min-width: 630px;
                justify-content: space-between;
                color: rgba(168, 176, 185, 1);
                > div:first-child {
                  display: flex;

                  > span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 20px;
                    background: rgba(255, 112, 112, 1);
                    border-radius: 10px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    margin-right: 14px;
                    &.teaching {
                      background: rgba(42, 148, 255, 1);
                    }
                    &.afterClass {
                      background: rgba(255, 198, 11, 1);
                    }
                  }
                }

                >>> .el-rate {
                  width: 160px;
                  margin-left: 180px;
                  display: flex;
                  > .el-rate__text {
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                  }
                  // justify-content: space-between;
                }
              }
            }
            > span {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100px;
              height: 28px;
              cursor: pointer;
              background: linear-gradient(
                135deg,
                rgba(148, 241, 239, 1) 0%,
                rgba(0, 199, 247, 1) 100%
              );
              box-shadow: 0px 8px 10px 0px rgba(191, 248, 242, 0.71);
              border-radius: 20px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              transition: opacity 0.3s;
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
      .time-table {
        margin-bottom: 30px;
      }
      .information-wrapper {
      }
    }
  }
</style>
