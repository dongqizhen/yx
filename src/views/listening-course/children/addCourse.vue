<template>
  <div class="addCourse main-view">
    <el-form
      ref="add_or_edit_Form"
      :rules="rules"
      :model="model"
      label-width="116px"
      style="width: 100%;"
    >
      <el-form-item
        label="专业"
        prop="professionId"
        class="letter_space"
        :inline-message="true"
      >
        <el-select v-model="model.professionId" placeholder="选择专业">
          <el-option
            v-for="item in professionOptions"
            :key="item.id"
            :label="item.professionName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频名称" prop="videoName" :inline-message="true">
        <el-input
          placeholder="请输入视频名称2~20个字"
          v-model="model.videoName"
          @input="handleChange"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="教师"
        prop="teacherName"
        class="letter_space"
        :inline-message="true"
      >
        <el-input
          placeholder="请输入教师名称"
          v-model="model.teacherName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="缩略图照片"
        prop="coverUrlId"
        class="photo"
        :inline-message="true"
      >
        <span class="set-avatar-btn" @click="toggleShow">
          <img :src="coverUrl" v-if="model.coverUrlId" />
          <i class="el-icon-plus" v-else></i>
        </span>
        <my-upload
          v-model="show"
          field="file"
          :width="300"
          :height="300"
          :url="url"
          :params="params"
          :headers="headers"
          with-credentials
          :noCircle="true"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
        />
      </el-form-item>
      <el-form-item label="上传视频" prop="videoId" class="uploadVideo">
        <upload-video
          :fileName="fileName"
          :uploadedFile="file"
          ref="upload"
          @getUpload="getUpload"
        ></upload-video>
      </el-form-item>
      <el-form-item label="视频介绍" prop="videoDesc">
        <el-input
          type="textarea"
          v-model="model.videoDesc"
          maxlength="400"
          show-word-limit
        ></el-input>
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
  // 海东是一个骚气的好同志，资深后端开发人员，从事后端开发多年，有非常丰富的工作经验。
  import { getToken } from "@/utils/auth";
  import { fetchProfession_List } from "@/api/classes";
  import { addOrUpdateCourse } from "@/api/learningCourse";
  import myUpload from "vue-image-crop-upload";
  import uploadVideo from "@/components/UploadVideo";
  import store from "@/store";

  export default {
    name: "AddCourse",
    components: { myUpload, uploadVideo },
    data() {
      return {
        fileName: "",
        file: [], //视频编辑得时候回填用
        coverUrl: "",
        professionOptions: [],
        loading: false,
        model: {
          id: undefined,
          professionId: "",
          teacherName: "",
          rankValue: null,
          videoName: "",
          videoDesc: "",
          coverUrlId: "",
          videoId: "",
          originName: ""
        },
        rules: {
          professionId: [
            { required: true, message: "专业必填", trigger: "change" }
          ],
          videoName: [
            {
              required: true,
              message: "视频名称必填",
              trigger: ["blur", "change"]
            },
            {
              min: 2,
              max: 20,
              message: "请输入2~20个字符",
              trigger: ["blur", "change"]
            }
          ],
          teacherName: [
            {
              required: true,
              message: "教师必填",
              trigger: ["blur", "change"]
            }
          ],
          coverUrlId: [
            {
              required: true,
              message: "缩略图照片必传",
              trigger: "change"
            }
          ],
          videoId: [{ required: true, message: "视频必传", trigger: "change" }],
          videoDesc: [
            {
              required: true,
              message: "视频介绍必填",
              trigger: ["blur", "change"]
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
      fetchProfession_List({}).then(res => {
        console.log("专业列表", res);
        this.professionOptions = res.data.data.list;
      });
      if (this.$route.query.info) {
        const info = JSON.parse(this.$route.query.info);
        console.log(info);
        this.model = info;
        this.coverUrl = info.coverUrl;
        this.fileName = info.videoName;
        this.file.push({
          status: "success",
          percentage: 100,
          name: info.originName,
          videoUrl: info.videoUrl
        });
      }
    },
    methods: {
      handleChange(value) {
        this.fileName = value;
      },
      onSubmit() {
        if (
          this.$refs.upload.fileList.length > 0 &&
          this.$refs.upload.fileList[0].status != "success"
        ) {
          this.$message.warning(
            "视频上传未完成，请等待视频上传结束以后再进行提交"
          );
          return;
        }
        this.$refs["add_or_edit_Form"].validate(valid => {
          if (valid) {
            this.loading = true;
            console.log(this.model);
            addOrUpdateCourse(this.model)
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
      getUpload(val) {
        this.model.videoId = val.videoId;
        this.model.originName = val.originName;
      },
      toggleShow() {
        this.show = !this.show;
      },
      // 裁剪成功
      cropSuccess(imgDataUrl, field) {
        // this.coverUrl = imgDataUrl;
      },
      // 上传成功
      cropUploadSuccess(jsonData, field) {
        console.log(jsonData);
        this.model.coverUrlId = jsonData.data.urlId;
        this.coverUrl = jsonData.data.url;
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
    .vue-image-crop-upload {
      z-index: 10002;
      background-color: rgba(0, 0, 0, 0.5);
      >>> .vicp-wrap {
        border-radius: 12px;
      }
    }
    .el-form {
      >>> .el-form-item {
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
          width: 80%;
          height: 230px;
          .el-textarea__inner {
            height: 100%;
            resize: none;
          }
        }
      }
    }
    .el-button {
      padding-top: 7px;
      margin-left: 120px;
    }
  }
</style>
