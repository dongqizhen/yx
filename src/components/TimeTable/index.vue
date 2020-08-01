<template>
  <div class="time-table">
    <h5>
      <span
        v-if="(type == 2 && index == 0) || type == 1"
        class="left"
        :class="RankValue <= 1 && 'disabled'"
        @click="pre"
      >
        <svg-icon icon-class="leftArrow" />
        上一{{ this.type == 1 ? "周" : "月" }}
      </span>
      {{ tableData.rankValue && timeNum }}
      <span
        v-if="(type == 2 && index == 0) || type == 1"
        class="right"
        :class="RankValue >= amount && 'disabled'"
        @click="next"
      >
        下一{{ this.type == 1 ? "周" : "月" }}
        <svg-icon icon-class="rightArrow" />
      </span>
    </h5>
    <el-table
      v-loading="tableLoading"
      :data="tableData.timeTable"
      border
      lazy
      style="width: 100%"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
    >
      <el-table-column prop="date" label="时间" width="107" align="center">
        <template slot-scope="{ row }">
          {{ row.startTime }}-{{ row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, i) in dateArr"
        :key="i"
        prop=""
        label="周一"
        align="center"
        :class-name="readOnly || !item.flag ? 'ban' : ''"
      >
        <template slot="header" slot-scope="{ column, $index }">
          {{ item.day }}
          <span>{{ dateArr[i].date }}</span>
        </template>
        <template
          v-if="item.flag || (row[delStr(i)] && row[delStr(i)].showMsg)"
          slot-scope="{ row }"
        >
          <div
            v-if="row[delStr(i)] && row[delStr(i)].showMsg"
            :class="!readOnly && 'noBan'"
            @click="cellClick(row[delStr(i)])"
          >
            <div v-if="!readOnly" class="label">
              <span v-show="row[delStr(i)].previewExistFlag">预</span>
              <span v-show="row[delStr(i)].lessonExistFlag">备</span>
              <span v-show="row[delStr(i)].homeworkExistFlag">作</span>
              <span v-show="row[delStr(i)].studentEvaluationStatus">评</span>
              <span v-show="row[delStr(i)].studentSignStatus">签</span>
              <span v-show="row[delStr(i)].teacherEvaluationStatus">考</span>
            </div>
            <div class="search-content">
              <h4>{{ row[delStr(i)].title }}</h4>
              <!-- <span>基础绕口令</span> -->
              <span class="name">
                {{ !readOnly ? row[delStr(i)].teacherName : "" }}

                <!-- {{
                !row[delStr(i)].teacherSignStatus
                  ? "未签到"
                  : row[delStr(i)].teacherSignStatus == 1
                  ? "已签到"
                  : "迟到"
              }} -->
                <svg-icon
                  v-if="!readOnly"
                  :icon-class="
                    !row[delStr(i)].teacherSignStatus ||
                    row[delStr(i)].teacherSignStatus == 3
                      ? 'noSign'
                      : row[delStr(i)].teacherSignStatus == 1
                      ? 'signIn'
                      : row[delStr(i)].teacherSignStatus == 2 && 'later'
                  "
                />
                <svg-icon
                  v-if="readOnly"
                  :icon-class="
                    row[delStr(i)].courseStudentSignStatus == 1
                      ? 'signIn'
                      : row[delStr(i)].courseStudentSignStatus == 2
                      ? 'later'
                      : 'noSign'
                  "
                />
              </span>
            </div>
          </div>
          <div v-else>
            <div
              v-if="!readOnly"
              class="add"
              @click.stop="addTimeTable(row[delStr(i)])"
            >
              +
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-if="!readOnly"
      :visible.sync="dialogVisible"
      lock-scroll
      custom-class="add_time_table"
      @close="close"
    >
      <el-form
        ref="add_time_table"
        :rules="rules"
        :model="query"
        label-position="left"
        label-width="130px"
        style="width: 100%;padding-left:20px;"
      >
        <el-form-item label="关联教学大纲">
          <el-input :value="profession.professionName" disabled />
          <el-select
            v-model="query.subjectId"
            class="subject"
            popper-class="select_timeTable"
            placeholder="请选择科目"
            @change="subjectChange"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.subjectName"
              :value="item.id"
            />
          </el-select>
          <el-cascader
            v-model="query.catalogId"
            :props="{
              multiple: true,
              value: 'id',
              label: 'catalogName',
              expandTrigger: true
            }"
            :options="options"
            collapse-tags
            popper-class="select_timeTable"
            @change="cascaderChange"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.catalogName }}</span>
              <!-- <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span> -->
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="title"
          :rules="{
            required: true,
            message: '课程名称必填',
            trigger: 'change'
          }"
        >
          <el-input
            v-model="query.title"
            placeholder="请输入课程名称（2-20字）"
          />
        </el-form-item>
        <el-form-item
          label="教  师"
          class="letter_space"
          prop="teacherId"
          :rules="{
            required: true,
            message: '请选择教师',
            trigger: 'change'
          }"
        >
          <el-select
            v-model="query.teacherId"
            placeholder="请选择教师"
            filterable
            :loading="teacherLoading"
            popper-class="select_timeTable"
            @visible-change="teacherVisibleChange"
            @change="teacherChange"
          >
            <el-option
              v-for="(item, i) in teacherList"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="custom_submit_button"
          @click="onSubmit"
        >
          确&nbsp;&nbsp;定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { numberToUpperCase, parseTime } from "@/utils";
  import { keyBy, groupBy, flatMap, countBy, map, filter } from "loadsh";

  import { fetchTeacher_ListByStatus } from "@/api/teacher";
  import {
    fetchProfession_List,
    fetchSubject_List,
    fetchCatalog_List,
    createCourse_timeTable,
    fetchClasses_details
  } from "@/api/classes";

  export default {
    name: "TimeTable",
    props: {
      readOnly: {
        type: Boolean,
        default: false
      },
      tableData: {
        type: [Array, Object],
        default: {}
      },
      type: "", // 类型 周月 全部
      index: {
        // 枚举值  判断是否显示上下按钮
        type: [Number, String],
        default: 0
      },
      rankValue: {
        type: [Number, String],
        default: 0
      }, // 周数
      profession: {
        type: Object,
        default: () => ({})
      },
      refresh: {}
    },
    data() {
      var vm = this;
      return {
        tableLoading: true,
        dialogVisible: false,
        btnLoading: false,
        teacherLoading: true, // 班主任loading
        teacherList: [], // 班主任列表
        tabval: "", // tab值
        RankValue: "1", // 当前
        amount: "", // 总数
        dateArr: [
          { date: "", day: "周一", flag: false },
          { date: "", day: "周二", flag: false },
          { date: "", day: "周三", flag: false },
          { date: "", day: "周四", flag: false },
          { date: "", day: "周五", flag: false },
          { date: "", day: "周六", flag: false },
          { date: "", day: "周日", flag: false }
        ], // 时间
        currDate: "", // 当前时间
        subjectList: [],
        options: [],
        rules: {
          // title: [{ required: true, message: "班级名称必填", trigger: "change" }]
        },
        query: {
          subjectId: "",
          courseId: "", // 课程表的课程id
          title: "", // 课程名称
          teacherId: "", // 老师的id数据
          catalogId: "" // 绑定的大纲(目录的Id)
        }
      };
    },
    computed: {
      timeNum() {
        if (this.type == 1) {
          return "第" + numberToUpperCase(this.tableData.rankValue - 1) + "周";
        } else if (this.type == 2) {
          return (
            (this.tableData.monthDate
              ? parseTime(this.tableData.monthDate, "{m}月", "")
              : "") +
            "第" +
            (this.index + 1) +
            "周"
          );
        } else {
          return "第" + numberToUpperCase(this.tableData.rankValue - 1) + "周";
        }
      },
      delStr() {
        return i => {
          switch (i) {
            case 0:
              return "monday";
            case 1:
              return "tuesday";
            case 2:
              return "wednesday";
            case 3:
              return "thursday";
            case 4:
              return "friday";
            case 5:
              return "saturday";
            case 6:
              return "sunday";
          }
        };
      }
    },
    watch: {
      tableData(newVal) {
        // console.log("a", newVal);
        this.RankValue = this.rankValue;
        const a = map(this.tableData.timeTable[0], (o, i) => {
          if (typeof o === "object") {
            return o.scheduleDate;
          }
        });
        const date = [];

        filter(a, o => {
          if (o) {
            date.push({
              date: parseTime(o, "{y}年{m}月{d}日", ""),
              day: `周${parseTime(o, "{a}")}`,
              flag: o <= this.tableData.endTime && o >= this.tableData.startTime
            });

            return [parseTime(o, "{y}-{m}-{d}")];
          }
        });

        this.dateArr = date;

        this.amount = this.tableData[
          this.type == 1 ? "weekAmount" : "monthAmount"
        ];

        // this.$nextTick(() => {
        //   setTimeout(() => {
        //     this.tableLoading = false;
        //   }, 1000);
        // });
        // let a = flatMap(newVal.timetable, (o, i) => {
        //   return o.list;
        // });
        // console.log(a);
        // let b = groupBy(a, o => {
        //   return o.startTime + "-" + o.endTime;
        // });
        // console.log(b);

        // let c = map(b, (o, i, c) => {
        //   return { ...o, date: i };
        // });
        // console.log(c);
        // this.data = c;
      }
    },
    mounted() {
      console.log(this.readOnly, this.tableData);
      this.RankValue = this.rankValue;
      Object.keys(this.profession).length &&
        fetchSubject_List({ professionId: this.profession.professionId }).then(
          res => {
            if (res) {
              this.subjectList = res.data.data.list;
              console.log(this.subJectList);
            }
          }
        );
      const a = map(this.tableData.timeTable[0], (o, i) => {
        if (typeof o === "object") {
          return o.scheduleDate;
        }
      });
      const date = [];

      filter(a, o => {
        if (o) {
          //console.log(o, parseTime(this.tableData.startTime));
          date.push({
            date: parseTime(o, "{y}年{m}月{d}日", ""),
            day: `周${parseTime(o, "{a}")}`,
            flag: o <= this.tableData.endTime && o >= this.tableData.startTime
          });

          return [parseTime(o, "{y}-{m}-{d}")];
        }
      });

      this.dateArr = date;
      // console.log(33, this.tableData.todayTime);
      this.amount = this.tableData[this.type == 1 ? "weekAmount" : "monthAmount"];
      this.$nextTick(() => {
        setTimeout(() => {
          this.tableLoading = false;
        }, 100);
      });
    },
    methods: {
      cellMouseEnter(row, column, cell, event) {
        // console.log(event.target, column);
        // if (column.property != "date")
        //   event.target.querySelector(".add").style.display = "flex";
      },
      subjectChange(val) {
        fetchCatalog_List({
          professionId: this.profession.professionId,
          subjectId: val,
          nullType: 1
        }).then(res => {
          this.options = res.data.data.list;
        });
      },
      cellMouseLeave(row, column, cell, event) {
        // if (column.property != "date")
        //   event.target.querySelector(".add").style.display = "none";
      },
      close() {
        this.query = {
          subjectId: "",
          courseId: "", // 课程表的课程id
          title: "", // 课程名称
          teacherId: "", // 老师的id数据
          catalogId: "" // 绑定的大纲(目录的Id)
        };
        this.$nextTick(() => {
          this.$refs["add_time_table"].clearValidate();
        });
      },
      cellClick(row, column, cell, event) {
        // console.log(row);
        this.$router.push({
          name: "TimeTableDetails",
          params: { courseId: row.id, lessonFlag: row.lessonExistFlag }
        });
      },
      onSubmit() {
        console.log(this.query);
        this.$refs["add_time_table"].validate(valid => {
          if (valid) {
            this.btnLoading = true;
            const val = map(this.query.catalogId, o => {
              return o[o.length - 1];
            });
            // console.log(val);
            // this.query.catalogId = val;
            createCourse_timeTable({ ...this.query, ...{ catalogId: val } }).then(
              res => {
                this.btnLoading = false;
                if (res) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                    // center: true,
                    duration: 2 * 1000
                  });
                  this.dialogVisible = false;

                  this.query = {
                    subjectId: "",
                    courseId: "", // 课程表的课程id
                    title: "", // 课程名称
                    teacherId: "", // 老师的id数据
                    catalogId: "" // 绑定的大纲(目录的Id)
                  };
                  this.$nextTick(() => {
                    this.$refs["add_time_table"].clearValidate();
                  });
                  // console.log(this.rankValue);
                  this.refresh(this.RankValue);
                }
              }
            );
          } else {
            return false;
          }
        });
      },
      cascaderChange(value) {
        console.log(value);
      },
      // 添加课程
      addTimeTable(item) {
        console.log(item);
        this.query.courseId = item.id;
        this.dialogVisible = true;
      },
      // 点击上一周/月
      pre() {
        if (this.RankValue > 1) {
          this.RankValue -= 1;
          this.$emit("pre", this.RankValue);
        }
      },
      // 点击下一周/月
      next() {
        // console.log(this.RankValue, this.amount);
        if (this.RankValue < this.amount) {
          this.RankValue += 1;
          this.$emit("next", this.RankValue);
        }
      },
      teacherVisibleChange(visible) {
        visible &&
          this.teacherLoading &&
          fetchTeacher_ListByStatus({ deleteFlag: 0 })
            .then(res => {
              this.teacherList = res.data.data;
            })
            .then(() => {
              this.teacherLoading = false;
            });
      },
      teacherChange(value) {
        // this.temp.teacherInChargeId = value;
      }
    }
  };
</script>
<style>
  .select_timeTable {
    z-index: 10012 !important;
  }
</style>
<style lang="scss" scoped>
  .time-table {
    margin-top: 35px;
    > h5 {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(78, 78, 78, 1);
      line-height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 11px;
      > span {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(78, 78, 78, 1);
        flex: 1;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.disabled {
          color: #d6d6d6;
          cursor: not-allowed;
          .svg-icon {
            color: #d6d6d6;
          }
        }
        &.right {
          justify-content: flex-end;
        }
      }
    }
    >>> .el-table {
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
      border: 1px solid rgba(221, 221, 221, 1);
      .el-table__header-wrapper {
        .el-table__header {
          tr {
            height: 66px !important;
            th {
              background: rgba(249, 249, 249, 1);
              .cell {
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(120, 131, 156, 1);
                display: flex;
                flex-direction: column;
                > span {
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(120, 131, 156, 1);
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
      .el-table__body-wrapper {
        .el-table__body {
          .el-table__row {
            .el-table_1_column_1 {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(120, 131, 156, 1);
            }
            td {
              padding: 0px !important;
              .cell {
                height: 175px;
                width: calc(100% - 6px);
                padding: 0 !important;
                margin: 3px;
                .add {
                  height: 100%;
                  display: flex;
                  align-items: center;
                  width: 100%;
                  justify-content: center;
                  background: rgba(243, 243, 243, 1);
                  border-radius: 10px;
                  font-size: 50px;
                  color: #cdcdcd;
                  //display: none;
                }
              }
            }
            td:not(:first-child) {
              cursor: pointer;
            }
          }
          tr {
            height: 175px;
            &:hover > td {
              background: none !important;
            }
            td {
              &.ban {
                cursor: default !important;
                pointer-events: none;
                .noBan {
                  cursor: pointer;
                  pointer-events: initial;
                  border-radius: 10px;
                  &.active {
                    background: rgba(77, 77, 77, 0.23);
                  }
                }
              }
              .noBan {
                cursor: pointer;
                pointer-events: initial;
                border-radius: 10px;
                &.active {
                  background: rgba(77, 77, 77, 0.23);
                }
              }
            }
            .cell {
              display: flex;
              //flex-direction: column;
              align-items: center;
              justify-content: center;
              > div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
                position: relative;
                .label {
                  display: flex;
                  width: 100%;
                  justify-content: center;
                  position: absolute;
                  top: 7px;
                  left: 0;
                  span {
                    width: 22px;
                    height: 22px;
                    background: rgba(252, 107, 107, 1);
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    line-height: 22px;
                    border-radius: 22px;
                    margin-right: 5px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:nth-child(2) {
                      background: rgba(255, 203, 80, 1);
                    }
                    &:nth-child(3) {
                      background: rgba(83, 212, 157, 1);
                    }
                    &:nth-child(4) {
                      background: rgba(42, 148, 255, 1);
                    }
                    &:nth-child(5) {
                      background: #2a1ef4;
                    }
                    &:last-child {
                      background: rgba(155, 123, 255, 1);
                      margin-right: 0;
                    }
                  }
                }
                > .search-content {
                  width: 100%;
                }
                h4 {
                  font-size: 16px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(80, 90, 100, 1);
                  line-height: 22px;
                  // word-break: break-all;
                  // width: 100%;
                }
                > .search-content > span {
                  font-size: 16px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(80, 90, 100, 1);
                  line-height: 22px;
                  margin-bottom: 10px;

                  &.name {
                    display: flex;
                    align-items: center;
                    margin-top: 7px;
                    justify-content: center;
                    line-height: 17px;
                    //height: 17px;
                    //width: 50px;
                    > span {
                      position: relative;
                      font-size: 12px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: rgba(255, 255, 255, 1);
                      line-height: 17px;
                      margin-left: 5px;
                      display: flex;
                      align-items: center;
                      left: 0;
                    }
                  }
                  &:last-child {
                    margin-bottom: 0px;
                  }
                  .svg-icon {
                    // position: absolute;
                    // top: 0;
                    width: 50px !important;
                    height: 17px !important;
                    margin-left: 3px;
                  }
                }
              }
            }
          }
        }
      }
      th.is-leaf,
      td {
        border-bottom: 1px dashed rgba(221, 221, 221, 1);
      }
      &.el-table--border {
        th,
        td {
          border-right: 1px dashed rgba(221, 221, 221, 1);
          &:last-child {
            border-right: 0;
          }
        }
      }
    }
    >>> .el-dialog__wrapper {
      .add_time_table {
        //width: 1000px;

        .el-dialog__body {
          padding-bottom: 0;
          .el-form {
            .el-form-item {
              width: 100%;
              //margin-bottom: 40px;
              display: flex;
              align-items: center;
              position: relative;
              &:not(.is-required) {
                .el-form-item__label {
                  &::before {
                    display: none;
                  }
                }
              }
              .el-form-item__content {
                display: flex;
                align-items: center;
                margin-left: 0 !important;
                height: 36px;
                display: flex;
                align-items: center;
                .el-input {
                  width: 500px;
                  .el-input__inner {
                    border-radius: 20px;
                  }
                  &.is-disabled {
                    width: 120px;
                    margin-right: 10px;
                  }
                }

                .el-cascader {
                  .el-input {
                    width: 240px;
                  }
                  .el-cascader__tags .el-tag > span {
                    flex: auto;
                  }
                }

                .el-select.subject {
                  width: 120px;
                  margin-right: 10px;
                  .el-input {
                    width: 100%;
                  }
                }

                .el-form-item__error {
                  // position: static;
                  padding-top: 0;
                  margin-left: 12px;
                  top: 120%;
                }
              }
            }
          }
        }
        .el-dialog__footer {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
