<template>
  <div class="learning-details main-view">
    <div class="base-information">
      <h2>班级基本信息</h2>
      <div v-if="classesInfo" class="information-title">
        <h3>
          <div class="classes">
            <span>{{ classesInfo.professionName }}</span>
            {{ classesInfo.name }}
          </div>

          <div class="time">
            {{ classesInfo.startTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
            <span>至</span>
            {{ classesInfo.endTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </div>
        </h3>
        <div class="avatar-wapper">
          <div class="avatar">
            <el-avatar :src="studentScore.photo" />
            {{ studentScore.name }}
          </div>

          <span
            >从{{ classesInfo.startTime | parseTime("{y}-{m}-{d}") }} -
            {{ classesInfo.endTimeStr }} 整体表现</span
          >
          <el-rate
            :value="studentScore.score / 20"
            disabled
            show-score
            text-color="#ff9900"
            :score-template="score(studentScore)"
          />
        </div>
      </div>
    </div>
    <div class="tab">
      <ul class="nav">
        <li
          v-for="(item, index) in tab"
          :key="index"
          :class="{ active: index === tabIndex }"
          @click="tab_handler_click(index)"
          v-html="item"
        />
      </ul>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column prop="title" label="" width="250" align="center" />
        <el-table-column prop="" label="" width="400" align="left">
          <template slot-scope="{ row }">
            <span
              >{{ parseTime(row.day, "{y}年{m}月{d}日", "") }} 星期{{
                parseTime(row.day, "{a}")
              }}</span
            >
            <span>{{ row.startTime }}-{{ row.endTime }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="" width="150" align="left">
          <template slot-scope="{ row }"> </template>
        </el-table-column> -->
        <el-table-column
          v-if="tabIndex != 1"
          prop=""
          label=""
          width="300"
          align="left"
        >
          <template slot-scope="{ row }">
            <span class="btn custom_submit_button" @click="toPreview(row)"
              >{{ tabIndex == 0 ? "预习" : "作业" }}内容</span
            >
            <span class="btn custom_submit_button" @click="toPreviewDetail(row)"
              >提交内容</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="" align="right">
          <template slot-scope="{ row }">
            <el-rate
              :value="row.score / 20"
              disabled
              show-score
              text-color="#ff9900"
              :score-template="score(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    fetchCourse_StudentDetails,
    fetchClasses_everyStudentScore
  } from "@/api/classes";
  import { parseTime } from "@/utils";

  export default {
    name: "LearningDetails",
    data() {
      return {
        listLoading: false,
        tab: ["预&nbsp;&nbsp;习", "课&nbsp;&nbsp;中", "作&nbsp;&nbsp;业"],
        tabIndex: 0, // tab active index
        classesInfo: "",
        studentScore: "",
        contentScore: "",
        parseTime,
        tableData: []
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
      this.getClassesDetails().then(() => {});
      this.getStudentDetails();
    },
    methods: {
      tab_handler_click(index) {
        this.tabIndex = index;
        this.getStudentDetails();
      },
      toPreview(row) {
        //console.log(row);
        const { href } = this.$router.resolve({
          name: "TimeTableDetails",
          params: { courseId: row.id }
        });
        if (this.tabIndex == 0) {
          window.open(href + "?from=learnPreview", "_blank");
        } else {
          window.open(href + "?from=learnHomeWork", "_blank");
        }
      },
      toPreviewDetail(row) {
        // console.log(row);
        if (this.tabIndex == 0) {
          const { href } = this.$router.resolve({
            name: "PreviewDetails",
            params: { courseId: row.id }
          });
          window.open(href + "?from=learnPreview", "_blank");
        } else {
          const { href } = this.$router.resolve({
            name: "HomeworkDetails",
            params: { courseId: row.id }
          });
          window.open(href + "?from=learnPreview", "_blank");
        }
      },
      async getClassesDetails() {
        const { studentId, classesId } = this.$route.params;
        fetchClasses_everyStudentScore({ classesId, studentId }).then(res => {
          if (res) {
            const { classesInfo, studentScore } = res.data.data;
            this.classesInfo = classesInfo;
            this.studentScore = studentScore;
          }
        });
      },
      async getStudentDetails() {
        const { studentId, classesId } = this.$route.params;
        this.listLoading = true;
        await fetchCourse_StudentDetails({
          studentId,
          classesId,
          type: this.tabIndex + 1
        })
          .then(res => {
            if (res) {
              const { studentInfo, contentScore } = res.data.data;
              this.tableData = contentScore;
            }
          })
          .then(() => {
            setTimeout(() => {
              this.listLoading = false;
            }, 100);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .learning-details {
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
        height: 115px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 12px 0px rgba(202, 202, 202, 0.5);
        border-radius: 12px;
        //width: 700px;
        padding: 16px;
        padding-top: 13px;
        margin-bottom: 20px;
        > h3 {
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: #f0f0f0 1px solid;
          .time {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(168, 176, 185, 1);
            line-height: 20px;
            float: right;
            > span {
              margin: 0 17px;
            }
          }
          .classes {
            display: flex;
            align-items: center;
            > span {
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
        }
        > div {
          display: flex;
          font-size: 14px;
          flex: 1;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(168, 176, 185, 1);
          line-height: 20px;
          padding-top: 14px;
          .avatar {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(75, 75, 75, 1);
            .el-avatar {
              margin-right: 9px;
            }
          }
          > span {
            display: flex;
            align-items: center;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            margin-left: 80px;
            color: rgba(168, 176, 185, 1);
          }
          .el-rate {
            margin-left: 9px;
            flex: 1;
            display: flex;
            height: 40px;
            justify-content: flex-end;
            align-items: center;
            >>> .el-rate__item {
              .el-rate__icon {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
    .tab {
      margin-top: 34px;
      > ul.nav {
        display: flex;
        padding: 0;
        margin-bottom: 12px;
        li {
          width: 140px;
          height: 36px;
          margin-right: 12px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(80, 90, 100, 1);
          border: 1px solid rgba(211, 211, 211, 1);
          transition: background 0.5s;
          &.active {
            background: rgba(42, 148, 255, 1);
            border: 1px solid rgba(42, 148, 255, 1);
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      >>> .el-table {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        .el-table__body-wrapper {
          .el-table__body {
            .el-table__row {
              height: 80px;
              margin: 0 25px;
              td {
                font-size: 18px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(168, 176, 185, 1);
                &:first-child {
                  font-size: 18px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(80, 90, 100, 1);
                }
                &:last-child {
                  .cell {
                    justify-content: flex-end;
                  }
                }
                .cell {
                  display: flex;
                  justify-content: center;
                  height: 50px;
                  align-items: center;
                }
                .btn {
                  &:last-child {
                    background: linear-gradient(
                      135deg,
                      rgba(241, 175, 148, 1) 0%,
                      rgba(255, 77, 24, 1) 100%
                    );
                    box-shadow: 0px 8px 10px 0px rgba(248, 209, 191, 0.71);
                    margin-left: 20px;
                  }
                }
                &:last-child {
                  .cell {
                    padding: 0 16px;
                    .el-rate {
                      display: flex;
                      justify-content: flex-end;
                    }
                    .el-rate__text {
                      width: 35px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                  }
                }
              }
              &:last-child {
                td {
                  border-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
