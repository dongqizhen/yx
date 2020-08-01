<template>
  <div class="addCourse main-view">
    <el-form
      ref="add_or_edit_Form"
      :rules="rules"
      :model="model"
      label-width="116px"
      style="width: 100%;"
    >
      <el-form-item label="教师姓名" prop="name" :inline-message="true">
        <el-input
          placeholder="请输入教师名称2~6个字"
          v-model="model.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="头衔" class="letter_space" prop="title">
        <el-input
          type="textarea"
          v-model="model.title"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="擅长专业" prop="" class="check">
        <el-checkbox-group v-model="model.professionIds">
          <el-checkbox
            :label="item.id"
            v-for="item in tab"
            :key="item.id"
            @change="change"
          >
            {{ item.professionName }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="照片"
        prop="photoUrlId"
        class="letter_space photo"
        :inline-message="true"
      >
        <span class="set-avatar-btn" @click="toggleShow">
          <img :src="photoUrl" v-if="model.photoUrlId" />
          <i class="el-icon-plus" v-else></i>
        </span>
        <span class="tip">请上传，Jpg.png.bmp. 且不大于1M</span>
        <my-upload
          ref="cropImage"
          v-model="show"
          field="file"
          :width="300"
          :height="300"
          :url="url"
          :params="params"
          :headers="headers"
          with-credentials
          :noCircle="true"
          :maxSize="1024"
          @src-file-set="srcFileSet"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
        />
      </el-form-item>
      <el-form-item label="教师介绍" prop="facultyDesc" class="desc">
        <tinymce
          id="tinymceId"
          class="editor"
          v-model="model.facultyDesc"
          @input="getContent"
          plugin="save"
        />
      </el-form-item>
      <el-form-item label="排序" class="letter_space">
        <el-input v-model="model.rankValue"></el-input>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      class="report"
      round
      @click="onSubmit"
      :loading="loading"
    >
      提交
    </el-button>
  </div>
</template>

<script>
  import { getToken } from "@/utils/auth";
  import { addOrUpdateTeacher } from "@/api/teacherIntroduce";
  import myUpload from "vue-image-crop-upload";
  import Tinymce from "@/components/Tinymce";
  import { fetchProfession_List } from "@/api/classes";
  import store from "@/store";

  export default {
    name: "AddTeacherIntroduce",
    components: { myUpload, Tinymce },
    data() {
      var validateDesc = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入教师介绍"));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        photoUrl: "",
        tab: [],
        model: {
          id: undefined,
          name: "",
          title: "", //头衔
          professionIds: [], //专业ID
          rankValue: null,
          facultyDesc: "",
          photoUrlId: ""
        },
        rules: {
          name: [
            {
              required: true,
              message: "教师名称必填",
              trigger: ["blur", "change"]
            },
            {
              min: 2,
              max: 6,
              message: "请输入2~6个字",
              trigger: ["blur", "change"]
            }
          ],
          title: [
            {
              required: true,
              message: "教师头衔必填",
              trigger: ["blur", "change"]
            }
          ],
          photoUrlId: [
            {
              required: true,
              message: "照片必传",
              trigger: "change"
            }
          ],
          facultyDesc: [
            {
              required: true,
              validator: validateDesc,
              trigger: ["change"]
            }
          ]
        },
        show: false, // 图片裁剪框
        params: {},
        headers: {
          serveResource: store.state.settings.serveResource,
          token: getToken(),
          smail: "*_~"
        },
        url:
          process.env.NODE_ENV !== "production"
            ? "/dev-api/echo-art/upload/uploadImages"
            : "/echo-art/upload/uploadImages"
      };
    },
    created() {
      if (this.$route.query.info) {
        const info = JSON.parse(this.$route.query.info);
        this.model = info;
        this.photoUrl = info.photoUrl;
      }
      fetchProfession_List()
        .then(res => {
          //console.log(res);
          if (res) {
            this.tab = res.data.data.list;
            //this.model.professionIds = res.data.data.list;
            return res;
          }
        })
        .then(res => {});
    },
    methods: {
      onSubmit() {
        this.$refs["add_or_edit_Form"].validate(valid => {
          if (valid) {
            this.loading = true;
            console.log(this.model);
            addOrUpdateTeacher(this.model)
              .then(res => {
                console.log("返回值：：：", res);
                this.$message({
                  message: this.model.id ? "编辑成功" : "添加成功",
                  type: "success",
                  center: true,
                  duration: 2000
                });
                this.$router.go(-1);
              })
              .catch(() => {
                this.loading = false;
              });
          }
        });
      },
      change() {
        console.log(this.model);
      },
      getContent(value) {},
      toggleShow() {
        this.show = !this.show;
      },
      srcFileSet(fileName, fileType, fileSize) {
        if (
          !(
            fileType == "image/png" ||
            fileType == "image/jpg" ||
            fileType == "image/jpeg" ||
            fileType == "image/bmp"
          )
        ) {
          this.$refs.cropImage.hasError = true;
          this.$refs.cropImage.errorMsg = "请上传png、jpg、bmp格式的图片";
          setTimeout(() => {
            this.$refs.cropImage.setStep(1);
          }, 32);
        }
      },
      // 裁剪成功
      cropSuccess(imgDataUrl, field) {
        this.photoUrl = imgDataUrl;
      },
      // 上传成功
      cropUploadSuccess(jsonData, field) {
        console.log(jsonData);
        this.model.photoUrlId = jsonData.data.urlId;
        this.photoUrl = jsonData.data.url;
      },
      // 上传失败
      cropUploadFail(status, field) {}
    }
  };
</script>

<style lang="scss" scoped>
  .addCourse {
    .set-avatar-btn {
      overflow: hidden;
      display: block;
      width: 140px;
      height: 140px;
      font-size: 24px;
      line-height: 140px;
      border-radius: 10px;
      text-align: center;
      background: rgba(233, 233, 233, 1);
      color: #cdcdcd;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .tip {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      margin-top: 9px;
      font-weight: 400;
      color: rgba(168, 176, 185, 1);
      line-height: 22px;
    }
    .vue-image-crop-upload {
      z-index: 10002;
      background-color: rgba(0, 0, 0, 0.5);
      >>> .vicp-wrap {
        border-radius: 12px;
      }
    }
    .el-form {
      >>> .el-form-item {
        margin-bottom: 20px;
        .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          .el-checkbox {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .el-checkbox__inner {
              width: 30px;
              height: 30px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            &.is-checked {
              .el-checkbox__inner {
                background-color: #fff;

                &::after {
                  width: 18px;
                  height: 18px;
                  border-radius: 4px;
                  background: linear-gradient(
                    135deg,
                    rgba(81, 195, 255, 1) 0%,
                    rgba(42, 148, 255, 1) 100%
                  );

                  box-shadow: 0px 0px 4px 0px rgba(94, 181, 255, 0.5);
                  position: absolute;
                  transform: rotate(0deg) scaleY(1);
                  top: 5px;
                  left: 5px;
                  // transition: transform 0s ease-in 0s,
                  //   -webkit-transform 0s ease-in 0s;
                }
                &::before {
                  width: 20px;
                  height: 20px;
                  background-color: #1890ff;
                  position: absolute;
                }
              }
            }
            .el-checkbox__label {
              font-size: 20px;
            }
          }
        }
        &.desc {
          display: flex;
          flex-direction: column;
          .el-form-item__content {
            width: 100%;
            margin-left: 10px !important;
            margin-top: 5px;
          }
        }
        &.check {
          .el-form-item__content {
            min-height: 36px;
            display: flex;
            align-items: center;
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
        &:not(.is-required) {
          .el-form-item__label {
            &:before {
              display: none;
            }
          }
        }
        &.photo {
          .el-form-item__label {
            padding-right: 30px;
          }
        }
        &.letter_space {
          .el-form-item__label {
            letter-spacing: 35px;
            padding-right: 0;
          }
        }
        &.uploadVideo {
          .el-form-item__content {
            width: 360px;
          }
        }
        .el-form-item__label {
          position: relative;
          padding-right: 35px;
          &:before {
            left: 80px;
          }
        }
        .el-input {
          width: 300px;
          .el-input__inner {
            width: 300px;
            height: 36px;
            background: rgba(255, 255, 255, 1);
            border-radius: 20px;
            border: 1px solid rgba(234, 234, 234, 1);
          }
        }
        .el-textarea {
          width: 60%;
          height: 136px;
          .el-textarea__inner {
            height: 100%;
            resize: none;
          }
        }
      }
    }
    .el-button {
      padding-top: 7px;
      //margin-left: 120px;
    }
  }
</style>
