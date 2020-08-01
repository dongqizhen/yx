<template>
  <div class="add-teacher main-view">
    <div class="upload-avatar">
      <span class="set-avatar-btn" @click="toggleShow">
        <img :src="temp.teacherPhotoStr" />
      </span>
      <!-- <span class="tip">点击添加/修改头像</span> -->
      <my-upload
        field="file"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="show"
        :width="130"
        :height="130"
        :url="url"
        :params="params"
        :headers="headers"
        :noSquare="true"
        withCredentials
        img-format="png"
      ></my-upload>
    </div>
    <el-form
      ref="add_or_edit_Form"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="100px"
      style="width: 100%; "
    >
      <el-form-item label="教师姓名" prop="teacherName">
        <el-input
          v-model="temp.teacherName"
          placeholder="请输入教师姓名"
          :minlength="2"
          :maxlength="10"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="教师电话" prop="telephone">
        <el-input
          v-model.number="temp.telephone"
          placeholder="请输入教师电话"
          :maxlength="11"
          :disabled="temp.activateFlag == 1"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idnumber">
        <el-input
          v-model="temp.idnumber"
          placeholder="请输入身份证号"
          :maxlength="18"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="职   位" class="letter_space" prop="">
        <el-input
          v-model="temp.jobTitle"
          placeholder="请输入职位"
          :maxlength="20"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="职务类别" prop="fullTimeFlag">
        <el-radio-group v-model="temp.fullTimeFlag">
          <el-radio :label="0">兼职</el-radio>
          <el-radio :label="1">全职</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否教务">
        <el-radio-group v-model="temp.teacherLeaderFlag">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="btnLoading"
          class="custom_submit_button"
          @click="onSubmit"
        >
          提&nbsp;&nbsp;交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import myUpload from "vue-image-crop-upload";
  import { getToken } from "@/utils/auth";
  import store from "@/store";
  import {
    addTheacher_list,
    updateTheacher_list,
    getTheacher_Detail
  } from "../../../api/teacher";

  export default {
    name: "AddTeacher",
    components: { myUpload },
    data() {
      return {
        isEdit: false,
        btnLoading: false,
        temp: {
          //添加教师验证
          telephone: "", //电话
          teacherName: "", //姓名
          idnumber: "",
          jobTitle: "",
          teacherPhoto: "", //图片的id
          teacherPhotoStr: "", //图片的url
          fullTimeFlag: 1, //职务
          teacherLeaderFlag: 0 //是否教务
        },
        rules: {
          //验证教师姓名
          teacherName: [
            { required: true, message: "教师姓名必填", trigger: "change" },
            {
              min: 2,
              max: 10,
              message: "教师姓名为2-10个字",
              trigger: "change"
            }
          ],
          //验证教师电话
          telephone: [
            {
              required: true,
              message: "请输入手机号",
              trigger: "change"
            },
            {
              pattern: /^[1][0-9]{10}$/,
              message: "请输入正确的手机号",
              trigger: "change"
            }
          ],
          idnumber: [
            {
              pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
              message: "请输入正确的身份证号",
              trigger: "change"
            }
          ],
          //验证教师职务类别
          fullTimeFlag: [
            { required: true, message: "职务类别必选", trigger: "change" }
          ]
        },
        show: false, //图片裁剪框
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
      if (this.$route.query.id) {
        this.isEdit = true;
        getTheacher_Detail({ id: this.$route.query.id }).then(res => {
          console.log(res);
          this.temp = res.data.data;
        });
      }
    },
    methods: {
      onSubmit() {
        this.$refs["add_or_edit_Form"].validate(valid => {
          if (valid) {
            this.btnLoading = true;
            if (this.$route.query.id) {
              updateTheacher_list(this.temp).then(res => {
                this.btnLoading = false;
                if (res) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                    duration: 2 * 1000
                  });
                }
                this.$router.go(-1);
              });
            } else {
              addTheacher_list(this.temp).then(res => {
                this.btnLoading = false;
                if (res) {
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    duration: 2 * 1000
                  });
                }
                this.$router.go(-1);
              });
            }
          } else {
            return false;
          }
        });
      },
      toggleShow() {
        this.show = !this.show;
      },
      //裁剪成功
      cropSuccess(imgDataUrl, field) {
        console.log("-------- crop success --------");
        this.temp.teacherPhoto = imgDataUrl;
      },
      //上传成功
      cropUploadSuccess(jsonData, field) {
        console.log("-------- upload success --------");
        console.log(jsonData);
        this.temp.teacherPhoto = jsonData.data.urlId;
        this.temp.teacherPhotoStr = jsonData.data.url;
      },
      //上传失败
      cropUploadFail(status, field) {
        console.log("-------- upload fail --------");
        console.log(status);
        console.log("field: " + field);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .add-teacher {
    padding-top: 30px;
    .upload-avatar {
      width: 130px;
      display: flex;
      flex-direction: column;
      margin-bottom: 25px;
      margin-left: 110px;
      .set-avatar-btn {
        overflow: hidden;
        display: block;
        // margin: 30px auto 10px auto;
        width: 130px;
        height: 130px;
        font-size: 14px;
        line-height: 40px;
        border-radius: 50%;
        text-align: center;
        background: rgba(233, 233, 233, 1);
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      .vue-image-crop-upload {
        z-index: 10002;
        background-color: rgba(0, 0, 0, 0.5);
        >>> .vicp-wrap {
          border-radius: 12px;
          .vicp-preview-item-circle {
            margin-right: 80px !important;
          }
        }
      }
    }
    >>> .el-form {
      .el-form-item {
        width: 100%;
        margin-bottom: 40px;
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
        // .el-form-item__label {
        //   font-size: 18px;
        //   font-family: PingFangSC-Semibold, PingFang SC;
        //   font-weight: 600;
        //   color: rgba(80, 90, 100, 1);
        //   &::before {
        //     content: "";
        //     width: 6px;
        //     height: 6px;
        //     position: absolute;
        //     left: 70px;
        //     top: 8px;
        //     background: rgba(255, 112, 112, 1);
        //     // display: block;
        //     border-radius: 6px;
        //   }
        // }
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
