<template>
  <div class="add-classes main-view">
    <el-form
      ref="add_or_edit_Form"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="100px"
      style="width: 100%; "
    >
      <el-form-item label="班级名称" prop="classesName">
        <el-input
          v-model="temp.classesName"
          placeholder="请输入班级名称(4-30字)"
        />
      </el-form-item>
      <el-form-item label="专  业" class="letter_space" prop="professionName">
        <el-select
          v-model="temp.professionName"
          :loading="professionLoading"
          placeholder="请选择专业"
          :disabled="id && true"
          @visible-change="professionVisibleChange"
          @change="professionChange"
        >
          <el-option
            v-for="(item, i) in professionList"
            :key="item.id"
            :label="item.professionName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="班  主  任"
        class="letter_space_3"
        prop="teacherInChargeName"
      >
        <el-select
          v-model="temp.teacherInChargeName"
          placeholder="请选择教师"
          filterable
          :loading="teacherLoading"
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
      <el-form-item label="时  间" class="letter_space" prop="time">
        <el-date-picker
          v-model="temp.time"
          type="daterange"
          :disabled="id && true"
          align="left"
          unlink-panels
          :editable="false"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item
        ref="templateList"
        label="授课时段"
        class="period_of_time"
        prop="templateList"
      >
        <div v-for="(item, i) in temp.templateList" :key="i">
          <el-form-item
            :label="timeNum(i)"
            :prop="`templateList.${i}.startTime`"
            :rules="{
              required: true,
              message: '起始时间不能为空',
              trigger: 'change'
            }"
          >
            <el-time-select
              v-model="item.startTime"
              placeholder="起始时间"
              :disabled="id && true"
              :picker-options="{
                start: i == 0 ? '07:00' : temp.templateList[i - 1].endTime,
                step: '00:05',
                end
              }"
            />
          </el-form-item>

          <el-form-item
            :prop="`templateList.${i}.endTime`"
            :rules="{
              required: true,
              message: '结束时间不能为空',
              trigger: 'change'
            }"
          >
            <el-time-select
              v-model="item.endTime"
              placeholder="结束时间"
              :disabled="id !== undefined && true"
              :picker-options="{
                start: i == 0 ? '07:00' : temp.templateList[i - 1].endTime,
                step: '00:05',
                end,
                minTime: item.startTime
              }"
              @change="endTimeChange"
            />
          </el-form-item>
          <p v-if="i === temp.templateList.length - 1 && id === undefined">
            <svg-icon
              v-if="temp.templateList.length < 10 && isShowAddBtn"
              icon-class="add_btn"
              @click.native="addTime(i)"
            />
            <svg-icon
              v-if="temp.templateList.length > 1"
              icon-class="del_btn"
              @click.native="delTime"
            />
          </p>
        </div>

        <h6>
          注：请确定时间跟授课时段，系统会根据时间和时段生成课程表模板，课程表填入数据后，时间与时段将不能更改！
        </h6>
        <el-form-item>
          <el-button
            :loading="btnLoading"
            class="custom_submit_button"
            @click="onSubmit"
          >
            提&nbsp;&nbsp;交
          </el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    fetchProfession_List,
    create_classes,
    edit_classes,
    fetchClasses_details
  } from "@/api/classes";
  import { fetchTeacher_ListByStatus } from "@/api/teacher";
  import { numberToUpperCase } from "@/utils";

  export default {
    name: "AddClasses",
    props: ["id"],
    data() {
      return {
        btnLoading: false,
        end: "22:00", // 时间段末端
        isShowAddBtn: true, // 是否显示添加时段按钮
        professionLoading: true, // 专业loading
        professionList: [], // 专业列表
        teacherLoading: true, // 班主任loading
        teacherList: [], // 班主任列表
        temp: {
          // 添加教师验证
          // id: undefined,
          professionId: "", // 专业名称id
          professionName: "",
          classesName: "", // 班级名称
          teacherInChargeId: "", // 班主任ID
          teacherInChargeName: "",
          classesStartTime: "", // 班级开始时间
          classesEndTime: "", // 班级结束时间
          templateList: [
            {
              startTime: "",
              endTime: ""
            }
          ], // 授课时段
          time: ""
        },
        pickerOptions: {
          disabledDate: time => {
            // 设置选择的日期小于当前的日期,小于返回true,日期不可选

            return time.getTime() > Date.now() + 365 * 24 * 3600 * 1000;
          },
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        rules: {
          // 验证班级名称
          classesName: [
            { required: true, message: "班级名称必填", trigger: "change" },
            { min: 4, max: 30, message: "班级名称为4-30字", trigger: "change" }
          ],
          // 验证专业
          professionName: [
            {
              required: true,
              message: "请选择专业",
              trigger: "change"
            }
          ],
          // 验证教师职务类别
          teacherInChargeName: [
            {
              required: true,
              message: "请选择班主任",
              trigger: "change"
            }
          ],
          time: [
            {
              required: true,
              message: "请选择起止时间",
              trigger: "change"
            }
          ],
          templateList: [
            {
              required: true,
              message: "请选择授课时段",
              trigger: "change"
            }
          ]
        }
      };
    },
    computed: {
      timeNum() {
        return val => {
          return "时段" + numberToUpperCase(val);
        };
      }
    },
    created() {
      this.id !== undefined && this.getClassesDetails();
    },
    methods: {
      // 添加时段
      addTime(i) {
        let flag = false;
        this.$refs["add_or_edit_Form"].validateField(
          [`templateList.${i}.startTime`, `templateList.${i}.endTime`],
          valid => {
            if (valid != "") {
              flag = false;
            } else {
              flag = true;
            }
          }
        );
        flag &&
          this.temp.templateList.push({
            startTime: "",
            endTime: ""
          });
      },
      // 删除时段
      delTime() {
        this.isShowAddBtn = true;
        this.temp.templateList.length > 1 && this.temp.templateList.pop();
      },
      endTimeChange(value) {
        this.isShowAddBtn = value == this.end ? false : true;
      },
      dateChange([start, end]) {
        this.temp.classesStartTime = start;
        this.temp.classesEndTime = end;
      },
      professionVisibleChange(visible) {
        visible &&
          this.professionLoading &&
          fetchProfession_List()
            .then(res => {
              this.professionList = res.data.data.list;
            })
            .then(() => {
              this.professionLoading = false;
            });
      },
      professionChange(value) {
        console.log(this.temp);
        this.temp.professionId = value;
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
        this.temp.teacherInChargeId = value;
      },
      // 编辑班级 通过班级ID获取班级详情
      async getClassesDetails(id) {
        await fetchClasses_details({ id: this.id }).then(res => {
          const { classesStartTime, classesEndTime } = res.data.data;
          this.temp = res.data.data;
          this.temp.time = [classesStartTime, classesEndTime];
        });
      },
      onSubmit() {
        this.$refs["add_or_edit_Form"].validate(valid => {
          if (valid) {
            this.btnLoading = true;
            (this.id === undefined
              ? create_classes(this.temp)
              : edit_classes(this.temp)
            ).then(res => {
              this.btnLoading = false;
              if (res) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  // center: true,
                  duration: 2 * 1000
                });
                this.$router.go(-1);
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .add-classes {
    padding-top: 30px;
    >>> .el-form {
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
        &.period_of_time {
          height: 36px;
          > .el-form-item__content {
            flex-direction: column;
            align-items: flex-start;
            //  height: auto;
            > div {
              display: flex;
              margin-bottom: 25px;
              .el-form-item {
                margin-right: 12px;
                .el-form-item__label {
                  width: 70px !important;
                  font-size: 14px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(80, 90, 100, 1);
                  &::before {
                    display: none;
                  }
                }
                .el-form-item__content {
                  .el-form-item__error {
                    position: absolute !important;
                    top: 110%;
                  }
                }
              }
              > p {
                display: flex;
                align-items: center;
                margin-left: 16px;
                .svg-icon {
                  cursor: pointer;
                  margin-right: 12px;
                  width: 22px;
                  height: 22px;
                  &:hover {
                    opacity: 0.8;
                  }
                }
              }
            }
            > h6 {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(80, 90, 100, 1);
              line-height: 28px;
            }
            .custom_submit_button {
              margin-top: 45px;
            }
          }
          .el-input {
            width: 120px !important;
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
            width: 300px;
            .el-input__inner {
              border-radius: 20px;
            }
          }
          .el-date-editor {
            border-radius: 20px;
            width: 300px;
          }
          .el-radio-group {
            display: flex;
          }
          // .el-radio {
          //   display: flex;
          //   align-items: center;
          //   .el-radio__input {
          //     height: 30px;
          //     width: 30px;
          //     border: 1px solid rgba(234, 234, 234, 1);
          //     border-radius: 30px;
          //     background: #fff;
          //     display: flex;
          //     align-items: center;
          //     justify-content: center;
          //     &:not(.is-checked) {
          //       .el-radio__inner {
          //         display: none;
          //       }
          //     }
          //     .el-radio__inner {
          //       width: 18px;
          //       height: 18px;
          //       border-radius: 18px;
          //       background: linear-gradient(
          //         135deg,
          //         rgba(81, 195, 255, 1) 0%,
          //         rgba(42, 148, 255, 1) 100%
          //       );
          //       box-shadow: 0px 0px 4px 0px rgba(94, 181, 255, 0.5);
          //       &::after {
          //         display: none;
          //       }
          //     }
          //   }
          //   &.is-checked {
          //     .el-radio__label {
          //       color: #1890ff;
          //     }
          //   }
          //   .el-radio__label {
          //     font-size: 20px;
          //     font-family: PingFangSC-Regular, PingFang SC;
          //     font-weight: 400;
          //     color: rgba(80, 90, 100, 1);
          //   }
          // }
          .el-form-item__error {
            position: static;
            padding-top: 0;
            margin-left: 12px;
          }
        }
      }
    }
  }
</style>
