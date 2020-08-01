<template>
  <div class="release-evaluation main-view">
    <div class="container">
      <div class="main">
        <el-form ref="form" :model="model" :rules="rules" label-position="left">
          <el-form-item label="评测标题" prop="title" class="title">
            <el-input
              placeholder="请输入评测标题"
              show-word-limit
              maxlength="20"
              v-model="model.testTitle"
            ></el-input>
          </el-form-item>
          <el-form-item label="评测内容" prop="testRequirement">
            <tinymce
              id="tinymceId"
              class="editor"
              v-model="model.testRequirement"
              plugin="save"
            />
          </el-form-item>
          <el-form-item
            label="考核项设置（考核项设置后，会根据考核教师的打分生成雷达图）"
            class="option"
          >
            <div>
              <span class="tips">每项最多6个字，最少3项，最多10项</span>
              <div
                v-for="(item, i) in model.examsCopy"
                :key="i"
                class="el-input-container"
              >
                <span>{{ timeNum(i) }}</span>
                <el-form-item
                  :prop="`examsCopy[${i}].examContent`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入内容',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <el-input
                    placeholder="请输入6个字以内"
                    v-model="item.examContent"
                    :maxlength="6"
                  />
                </el-form-item>
                <p v-if="i >= 2 && i == model.examsCopy.length - 1">
                  <svg-icon
                    icon-class="add_btn"
                    @click.native="addItem(i)"
                    v-if="i < 9"
                  />
                  <svg-icon
                    icon-class="del_btn"
                    v-if="i > 2"
                    @click.native="delItem"
                  />
                </p>
              </div>
            </div>
            <div class="evaluationChart">
              <img src="../../../assets/images/evaluation-chart.png" />
            </div>
          </el-form-item>
        </el-form>
        <el-button
          :loading="loading"
          class="custom_submit_button"
          @click="onSubmit"
        >
          保&nbsp;&nbsp;存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Tinymce from "@/components/Tinymce";
  import { numberToUpperCase } from "@/utils";
  import { getEvaluationDetail } from "@/api/stuEvaluation";
  import {
    createOrUpdateStudentEvaluation_template,
    getStudentEvaluation_templateDetail,
  } from "@/api/student";

  export default {
    name: "ReleaseEvaluation",
    components: {
      Tinymce,
    },
    data() {
      var validateEvaluationContent = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("评测内容不能为空，请输入评测内容"));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        model: {
          freezeStatus: 0,
          testTitle: "",
          testRequirement: "",
          exams: [],
          examsCopy: [
            { examContent: "" },
            { examContent: "" },
            { examContent: "" },
          ],
        },
        rules: {
          testRequirement: [
            {
              required: true,
              validator: validateEvaluationContent,
              trigger: ["change"],
            },
          ],
        },
      };
    },
    mounted() {
      if (this.$route.query.id) {
        this.getStudentStandard();
      }
    },
    computed: {
      timeNum() {
        return (val) => {
          return numberToUpperCase(val);
        };
      },
    },
    methods: {
      addItem(i) {
        this.model.examsCopy.push({
          examContent: "",
        });
      },
      delItem() {
        this.model.examsCopy.pop();
      },
      onSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            this.model.exams = this.model.examsCopy.map(
              (item) => item.examContent
            );
            createOrUpdateStudentEvaluation_template(this.model).then((res) => {
              this.btnLoading = false;
              if (res) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 2 * 1000,
                });
                this.$router.go(-1);
              }
            });
          } else {
            return false;
          }
        });
      },
      async getStudentStandard() {
        await getEvaluationDetail({
          id: this.$route.query.id,
        }).then((res) => {
          console.log("模板详情：：：", res);
          if (res.data.data) {
            this.model = {
              freezeStatus: 0,
              exams: res.data.data.exams,
              examsCopy: res.data.data.exams,
              testRequirement: res.data.data.testRequirement,
              testTitle: res.data.data.testTitle,
              id: res.data.data.evaluateId,
            };
            this.$nextTick(() => {
              this.$refs["form"].clearValidate();
              window.tinymce
                .get("tinymceId")
                .setContent(res.data.data.testRequirement);
            });
          } else {
            this.model = {
              freezeStatus: 0,
              exams: [],
              examsCopy: [
                { examContent: "" },
                { examContent: "" },
                { examContent: "" },
              ],
              testTitle: "",
              testRequirement: "",
            };
            this.$nextTick(() => {
              this.$refs["form"].clearValidate();
              window.tinymce.get("tinymceId").setContent("");
            });
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .main {
    padding: 20px;
    background: rgba(255, 255, 255, 1);
    border-radius: 16px;
    background-color: #fff;
    margin-top: 18px;
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
      .el-form-item {
        display: flex;
        flex-direction: column;
        position: relative;
        &.title {
          flex-direction: row;
          .el-form-item__content {
            margin-left: 20px;
            .el-input {
              width: 626px;
            }
          }
        }
        &.option {
          .el-form-item__label {
            &:before {
              left: 83px;
            }
          }
          .el-form-item__content {
            display: flex;
            .evaluationChart {
              flex: 1;
              // min-width: 510px;
              // height: 510px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: 420px;
                height: 420px;
              }
            }
          }
        }
        .editor.tinymce-container {
          .tox-tinymce {
            height: 500px !important;
            .tox-editor-container
              .tox-editor-header
              .tox-toolbar-overlord
              .tox-toolbar:nth-child(2)
              .tox-toolbar__group
              > button[title="保存"] {
              display: none;
            }
          }
        }
        .el-form-item__content {
          .tips {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(80, 90, 100, 1);
            line-height: 22px;
          }
          .el-input-container {
            display: flex;
            padding-left: 14px;
            margin-bottom: 26px;
            align-items: center;
            > span {
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(80, 90, 100, 1);
              margin-right: 8px;
            }
            .el-input {
              width: auto;
              input {
                width: 600px;
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
        }
      }
    }
    >>> .el-checkbox {
      font-size: 20px;
      margin-top: 20px;
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
    .tip {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(80, 90, 100, 1);
      line-height: 22px;
      margin-left: 36px;
      margin-bottom: 20px;
    }
  }
</style>
