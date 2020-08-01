<template>
  <div class="teacher-evaluation main-view">
    <div class="tab">
      <span>专 业</span>
      <ul class="nav">
        <li
          v-for="(item, index) in tab"
          :key="item.id"
          :class="{ active: index === tabIndex }"
          @click="tab_handler_click(item, index)"
          v-html="item.professionName"
        />
      </ul>
    </div>
    <el-checkbox v-model="dynamicValidateForm.evaluationFlag"
      >开启考核</el-checkbox
    >
    <div class="main">
      <h3>
        <span>考 核</span>
        <el-button class="add" @click="addMaxterm()">添加大项</el-button>
      </h3>
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm">
        <div
          class="item"
          v-for="(item,
          i) in dynamicValidateForm.teacherStandardTemplateFirstVos"
          :key="i"
        >
          <el-form-item
            :prop="`teacherStandardTemplateFirstVos.${i}.name`"
            :rules="[
              { required: true, message: '请输入内容', trigger: 'change' },
              {
                min: 2,
                max: 40,
                message: '请输入2-40个字',
                trigger: 'change'
              }
            ]"
          >
            <el-input
              placeholder="请输入2-40个字"
              maxlength="40"
              v-model="
                dynamicValidateForm.teacherStandardTemplateFirstVos[i].name
              "
            >
              <svg-icon
                @click.native.stop="delMaxterm(i)"
                icon-class="del"
                v-if="i > 0"
                slot="suffix"
              ></svg-icon
            ></el-input>
            <div class="add"><span @click="addMinterm(i)">添加小项</span></div>
          </el-form-item>
          <el-form-item
            v-for="(val, n) in item.teacherStandardTemplateSecondVos"
            :key="n"
            :prop="
              `teacherStandardTemplateFirstVos.${i}.teacherStandardTemplateSecondVos.${n}.name`
            "
            :rules="[
              { required: true, message: '请输入内容', trigger: 'change' },
              {
                min: 2,
                max: 40,
                message: '请输入2-40个字',
                trigger: 'change'
              }
            ]"
          >
            <el-input
              type="textarea"
              placeholder="请输入2-40个字"
              maxlength="40"
              v-model="val.name"
              show-word-limit
            >
            </el-input>
            <svg-icon
              icon-class="del"
              v-if="n > 0"
              @click.native.stop="delMinterm(i, n)"
            ></svg-icon>
          </el-form-item>
        </div>
      </el-form>
      <h6>
        注：每次修改只应用于新的班级，不会影响已开始班级
      </h6>
      <el-button
        :loading="btnLoading"
        class="custom_submit_button"
        @click="onSubmit"
      >
        保&nbsp;&nbsp;存
      </el-button>
    </div>
  </div>
</template>

<script>
  import {
    getTheacher_TeacherStandardTemplate,
    updateTheacher_TeacherStandardTemplate
  } from "@/api/teacher";
  import { fetchProfession_List } from "@/api/classes";
  export default {
    data() {
      return {
        tab: [],
        tabIndex: 0,
        //checked: true,
        btnLoading: false,

        dynamicValidateForm: {
          professionId: "",
          evaluationFlag: true,
          teacherStandardTemplateFirstVos: [
            { name: "", teacherStandardTemplateSecondVos: [{ name: "" }] }
          ] //大项
        }
      };
    },
    created() {
      fetchProfession_List()
        .then(res => {
          //console.log(res);
          if (res) {
            const { list } = res.data.data;
            this.tab = [...this.tab, ...list];
            this.dynamicValidateForm.professionId = this.tab[0].id;
            return res;
          }
        })
        .then(res => {
          console.log(222, res);
          this.getTeacherStandard();
        });
    },
    methods: {
      tab_handler_click(item, index) {
        this.tabIndex = index;
        this.dynamicValidateForm.professionId = item.id;
        this.getTeacherStandard();
      },
      addMaxterm() {
        this.dynamicValidateForm.teacherStandardTemplateFirstVos.push({
          name: "",
          teacherStandardTemplateSecondVos: [{ name: "" }]
        });
      },
      delMaxterm(i) {
        this.dynamicValidateForm.teacherStandardTemplateFirstVos.splice(i, 1);
      },
      addMinterm(i) {
        // this.teacherStandardTemplateFirstVos.splice();
        _.map(
          this.dynamicValidateForm.teacherStandardTemplateFirstVos,
          (o, ind) => {
            ind == i && o.teacherStandardTemplateSecondVos.push({ name: "" });
          }
        );

        //console.log(this.teacherStandardTemplateFirstVos);
      },
      delMinterm(i, n) {
        _.map(
          this.dynamicValidateForm.teacherStandardTemplateFirstVos,
          (o, ind) => {
            ind == i && o.teacherStandardTemplateSecondVos.splice(n, 1);
          }
        );
      },
      onSubmit() {
        this.$refs["dynamicValidateForm"].validate(valid => {
          if (valid) {
            this.btnLoading = true;
            updateTheacher_TeacherStandardTemplate(this.dynamicValidateForm).then(
              res => {
                this.btnLoading = false;
                if (res) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                    // center: true,
                    duration: 2 * 1000
                  });
                  // this.$router.go(-1);
                }
              }
            );
          } else {
            return false;
          }
        });
      },
      async getTeacherStandard() {
        await getTheacher_TeacherStandardTemplate({
          professionId: this.dynamicValidateForm.professionId
        }).then(res => {
          console.log(res);
          if (res.data.data.teacherStandardTemplateFirstVos) {
            this.dynamicValidateForm = res.data.data;
          } else {
            let professionId = this.dynamicValidateForm.professionId;
            this.dynamicValidateForm = {
              professionId,
              evaluationFlag: true,
              teacherStandardTemplateFirstVos: [
                { name: "", teacherStandardTemplateSecondVos: [{ name: "" }] }
              ] //大项
            };
          }
          this.$nextTick(() => {
            this.$refs["dynamicValidateForm"].clearValidate();
          });
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .teacher-evaluation {
    .tab {
      display: flex;
      > span {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(80, 90, 100, 1);
        width: 100px;
        display: flex;
        align-items: center;
        letter-spacing: 15px;
        //justify-items: center;
      }
      > ul.nav {
        display: flex;
        padding: 0;
        flex-wrap: wrap;
        flex: 1;
        li {
          width: 140px;
          height: 36px;
          margin-right: 12px;
          margin-bottom: 12px;
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
    }
    >>> .el-checkbox {
      margin-left: 100px;
      font-size: 20px;

      margin-top: 8px;
      .el-checkbox__inner {
        height: 26px;
        width: 26px;
        border-radius: 13px;
        &::after {
          height: 10px;
          width: 5px;
          left: 9px;
          top: 5px;
          border-width: 2px;
        }
      }
      .el-checkbox__label {
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(80, 90, 100, 1);
        line-height: 28px;
      }
    }
    .main {
      margin-top: 30px;
      h3 {
        display: flex;
        width: 818px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 26px;
        > span {
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          width: 100px;
          display: flex;
          align-items: center;
          letter-spacing: 15px;
        }
        .el-button {
          width: 110px;
          height: 30px;
          background: linear-gradient(
            135deg,
            rgba(81, 195, 255, 1) 0%,
            rgba(42, 148, 255, 1) 100%
          );
          box-shadow: 0px 6px 10px 0px rgba(94, 181, 255, 0.5);
          border-radius: 20px;
          opacity: 1;
          transition: opacity 0.4s;
          color: #fff;
          padding: 0;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          &:hover {
            opacity: 0.8;
          }
          &:active {
            background: linear-gradient(
              130deg,
              rgba(28, 147, 255, 1) 0%,
              rgba(0, 122, 234, 1) 100%
            );
          }
        }
      }
      >>> .el-form {
        .item {
          width: 851px;
          border-bottom: #e8e8e8 solid 1px;
          margin-bottom: 20px;
          //padding-bottom: 3px;
          &:last-child {
            border: none;
          }
          .el-form-item {
            margin-bottom: 20px;
            width: 818px;
            &:first-child {
              //height: 40px;
              // background: rgba(255, 255, 255, 1);
              border-radius: 6px;
              //border: 1px solid rgba(234, 234, 234, 1);
              box-shadow: none;
              input {
                width: 400px;
              }
              .el-form-item__content {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .el-input {
                  width: auto;
                }

                > .add {
                  flex: 1;
                  display: flex;
                  justify-content: flex-end;
                }
                > .add > span {
                  font-size: 16px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(255, 255, 255, 1);
                  width: 110px;
                  height: 30px;
                  cursor: pointer;
                  display: flex;
                  background: linear-gradient(
                    135deg,
                    rgba(205, 180, 255, 1) 0%,
                    rgba(201, 57, 255, 1) 100%
                  );
                  box-shadow: 0px 6px 10px 0px rgba(170, 94, 255, 0.5);
                  border-radius: 20px;
                  opacity: 1;
                  transition: opacity 0.4s;
                  color: #fff;
                  padding: 0;
                  justify-content: center;
                  align-items: center;
                  &:hover {
                    opacity: 0.8;
                  }
                }
              }
            }

            .el-input__suffix {
              right: -25px;
              cursor: pointer;
              transition: opacity 0.4s;
              &:hover {
                opacity: 0.8;
              }
            }
            .el-form-item__content {
              display: flex;
              align-items: center;
              width: 100%;
              position: relative;
              .el-textarea {
                .el-input__count {
                  height: 26px;
                  bottom: 5px !important;
                }
              }
              .el-form-item__error {
                // left: 100%;
                // top: 0;
                display: flex;
              }
              > .svg-icon {
                position: absolute;
                margin-left: 12px;
                right: -25px;
                cursor: pointer;
                transition: opacity 0.4s;
                &:hover {
                  opacity: 0.8;
                }
              }
            }
            textarea {
              resize: none;
              height: 75px;
              border-radius: 6px;
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
        margin-bottom: 70px;
      }
    }
  }
</style>
