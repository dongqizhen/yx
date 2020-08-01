<template>
  <div class="upload">
    <el-upload
      drag
      class="upload-demo"
      action="#"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        视频小于500M，支持格式MP4、flv
      </div>
    </el-upload>
    <el-progress
      class="simulateProgress"
      :percentage="percentage"
      v-show="showPercentage"
    ></el-progress>
    <video-dialog-vue
      :visible="dialogVideoVisible"
      :sources="videoSources"
      @close="videoClose"
    />
  </div>
</template>

<script>
  /**
   * 阿里云上传视频必须有一个视频名称的字段，fileName
   */
  import {
    getUploadAddress,
    refreshUploadAddress,
    getVideoAddress
  } from "@/api/learningCourse";
  import videoDialogVue from "@/views/classes/components/videoDialog";
  export default {
    name: "UploadVideo",
    components: { videoDialogVue },
    data() {
      return {
        dialogVideoUrl: "",
        dialogVideoVisible: false,
        percentage: 0,
        showPercentage: false,
        uploader: null,
        fileList: this.uploadedFile || [],
        videoSources: {},
        videoId: ""
      };
    },
    props: ["fileName", "uploadedFile"],
    watch: {
      fileName(newVal) {
        this.fileName = newVal;
      }
    },
    methods: {
      videoClose() {
        this.dialogVideoVisible = false;
      },
      handleChange(file, fileList) {
        if (file.status == "ready") {
          if (!this.fileName) {
            this.$message.error("请先输入文件名称");
            fileList.pop();
            return false;
          }
          if (file.size > 500 * 1024 * 1024) {
            this.$message.error("上传视频文件不能超过500M,请选择其他文件上传");
            fileList.pop();
            return;
          }
          if (
            !(
              file.raw.type == "video/mp4" ||
              file.raw.type == "video/mpeg4" ||
              /(\.flv)$/.test(file.name)
            )
          ) {
            this.$message.error("对不起，只能上传mp4或者flv格式的视频");
            fileList.pop();
            return false;
          }

          if (fileList.length > 1) {
            fileList.shift();
          }
        }
        var userData = '{"Vod":{}}';
        if (this.uploader) {
          this.uploader.stopUpload();
        }
        this.fileList = fileList;
        this.uploader = this.createUploader(this);
        this.uploader.addFile(file.raw, null, null, null, userData);
        this.uploader.startUpload();
      },
      handlePreview(file) {
        console.log(file);
        if (file.raw) {
          if (file.status == "success") {
            getVideoAddress({ id: this.videoId }).then(res => {
              if (res.data.code == 0) {
                this.videoSources = {
                  src: res.data.data.url,
                  title: file.name
                };
                this.dialogVideoVisible = true;
              }
            });
          } else {
            this.$message.warning("视频未上传完成，请等待视频上传完成再浏览查看");
            return;
          }
        } else {
          this.videoSources = {
            src: file.videoUrl,
            title: file.originName
          };
          this.dialogVideoVisible = true;
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      createUploader(that) {
        let self = this;
        let uploader = new AliyunUpload.Vod({
          timeout: 60000,
          partSize: 1048576,
          parallel: 5,
          retryCount: 3,
          retryDuration: 2,
          userId: "1656244493045501",
          // 添加文件成功
          addFileSuccess: function(uploadInfo) {
            self.showPercentage = true;
            // console.log(uploadInfo);
          },
          // 开始上传
          onUploadstarted: function(uploadInfo) {
            // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
            // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
            // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
            if (!uploadInfo.videoId) {
              getUploadAddress({
                title: self.fileName,
                name: uploadInfo.file.name
              }).then(res => {
                console.log("获取上传视频凭证：：：", res.data.data);
                console.log("上传视频ID::", res.data.data.videoId);
                let uploadAuth = res.data.data.uploadAuth;
                let uploadAddress = res.data.data.uploadAddress;
                let videoId = res.data.data.videoId;
                self.videoId = videoId;
                self.$emit("getUpload", {
                  videoId,
                  originName: uploadInfo.file.name
                });
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                );
              });
            } else {
              // 如果videoId有值，根据videoId刷新上传凭证
              // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
              refreshUploadAddress({ id: uploadInfo.videoId }).then(res => {
                console.log("刷新上传视频凭证：：：", res.data.data);
                console.log("上传视频ID::", res.data.data.videoId);
                let uploadAuth = res.data.data.uploadAuth;
                let uploadAddress = res.data.data.uploadAddress;
                let videoId = res.data.data.videoId;
                self.$emit("getUpload", {
                  videoId,
                  originName: uploadInfo.file.name
                });
                self.videoId = videoId;
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                );
              });
            }
          },
          // 文件上传成功
          onUploadSucceed: function(uploadInfo) {
            self.showPercentage = false;
            self.percentage = 0;
            console.log(self.fileList);
            const tempFile = {
              ...self.fileList[0],
              status: "success",
              percentage: 100
            };
            console.log(tempFile);
            self.$set(self.fileList, 0, tempFile);
          },
          // 文件上传失败
          onUploadFailed: function(uploadInfo, code, message) {
            self.$message.error("文件上传失败,请稍后重试");
            return;
          },
          // 取消文件上传
          onUploadCanceled: function(uploadInfo, code, message) {},
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function(uploadInfo, totalSize, progress) {
            self.percentage = Math.ceil(progress * 100);
          },
          // 上传凭证超时
          onUploadTokenExpired: function(uploadInfo) {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth

            // axios.get(refreshUrl).then(({ data }) => {
            //   let uploadAuth = data.UploadAuth;
            //   uploader.resumeUploadWithAuth(uploadAuth);
            // });
            console.log("文件超时...");
            refreshUploadAddress({ id: uploadInfo.videoId }).then(res => {
              let uploadAuth = res.data.data.uploadAuth;
              uploader.resumeUploadWithAuth(uploadAuth);
            });
          },
          // 全部文件上传结束
          onUploadEnd: function(uploadInfo) {
            // console.log("onUploadEnd: uploaded all the files");
          }
        });
        return uploader;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .upload {
    width: 620px;
    .upload-demo {
      >>> .el-upload {
        width: 620px;
        padding: 7px;
        background-color: #fff;
        border-radius: 12px;
        .el-upload-dragger {
          width: 100%;
          height: 200px;
        }
      }
    }
    .el-progress {
      >>> .el-progress-bar {
        padding-right: 8px;
        .el-progress-bar__outer {
          height: 2px !important;
        }
      }
      >>> .el-progress__text {
        position: absolute;
        top: -11px;
        right: 8px;
      }
    }
  }
</style>