<template>
  <div class="classes-students main-view">
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
        <h3>当前学生信息</h3>
        <el-row class="main" v-if="studentList.length">
          <el-col
            :span="8"
            v-for="item in studentList"
            :key="item.id"
            @click.native="linkToDetail(item)"
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
        <no-data v-else></no-data>
      </div>
      <div
        class="student-information undo-student"
        v-if="historyStudentList.length"
      >
        <h3>这些学生曾经在本班留下足迹</h3>
        <el-row class="main" v-if="historyStudentList.length">
          <el-col
            :span="8"
            v-for="item in historyStudentList"
            :key="item.id"
            @click.native="linkToDetail(item)"
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
        <no-data v-else></no-data>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchClasses_studentGross } from "@/api/classes";
  export default {
    name: "Students",
    data() {
      return {
        classesInfo: {},
        studentList: [],
        historyStudentList: []
      };
    },
    created() {
      this.getStudentGross();
    },
    computed: {
      score() {
        return item => {
          return String(item.score);
        };
      }
    },
    methods: {
      linkToDetail({ id }) {
        this.$router.push({
          name: "StudentDetails",
          params: { studentId: id }
        });
      },
      async getStudentGross() {
        const { classesId } = this.$route.params;

        await fetchClasses_studentGross({ classesId }).then(res => {
          const {
            classesInfo,
            studentList,
            currentStudentList,
            historyStudentList
          } = res.data.data;
          this.classesInfo = classesInfo;
          this.studentList = currentStudentList;
          this.historyStudentList = historyStudentList;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .classes-students {
    display: flex;
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
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        padding: 0 16px;
        &.undo-student {
          margin-top: 20px;
        }
        h3 {
          height: 38px;
          display: flex;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          border-bottom: #f0f0f0 1px solid;
        }
        > .main {
          display: flex;
          padding-top: 24px;
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
      .information-wrapper {
      }
    }
  }
</style>
