<template>
  <div class="preview-details main-view">
    <div class="base-information" v-if="studentInfo">
      <h2>学生基本信息</h2>
      <div class="information-title">
        <div class="avatar">
          <el-avatar :src="studentInfo.photo" />
          {{ studentInfo.name }}
          <el-rate
            :value="studentInfo.score / 20"
            disabled
            show-score
            text-color="#ff9900"
            :score-template="score(studentInfo)"
          />
        </div>
        <div class="ev" v-if="studentInfo.evaluationDes">
          {{ studentInfo.evaluationDes }}
        </div>
      </div>
      <div class="content">
        <div class="base common">
          <h3>基本信息</h3>
          <div class="content">
            <div class="voice" v-if="detailInfo.audio">
              <img src="../../../../assets/images/avatar.jpg" />
              <span @click="previewAudioPlay">
                <audio ref="voice" :src="detailInfo.audio.url" />
                <svg-icon v-if="!audioPlay" icon-class="yuyin" />
                <i v-else><img src="../../../../assets/images/audio.gif"/></i>
                {{ detailInfo.audio.duration | durationTrans() }}
              </span>
            </div>
            <div class="image__preview">
              <div
                class="commonStyle"
                v-if="detailInfo.photoList && detailInfo.photoList.length"
              >
                <el-image
                  v-for="item in detailInfo.photoList"
                  :key="item.pathId"
                  style="width: 192px; height: 144px"
                  :src="item.pathStr"
                  fit="contain"
                  lazy
                  :preview-src-list="imageList"
                />
              </div>
              <div
                class="audio commonStyle"
                v-if="detailInfo.audioList && detailInfo.audioList.length"
              >
                <div
                  v-for="(item, i) in detailInfo.audioList"
                  :key="item.pathId"
                  class="item"
                  @click="audio_play(item)"
                >
                  <!-- TODO -->
                  <div class="audio">
                    <el-image
                      style="width: 192px; height: 144px"
                      :src="item.thumbnailPathId"
                      fit="contain"
                    />
                    <span>
                      {{ item.duration | durationTrans() }}
                    </span>
                  </div>
                  <i><svg-icon icon-class="audioPlay"/></i>
                </div>
              </div>
              <div class="video commonStyle">
                <div
                  v-for="item in detailInfo.videoList"
                  :key="item.pathId"
                  class="item"
                  @click="lookVideo(item)"
                >
                  <el-image
                    style="width: 192px; height: 144px"
                    :src="item.thumbnailPathId"
                    fit="contain"
                  />
                  <span>
                    {{ item.duration | durationTrans() }}
                  </span>
                  <i><svg-icon icon-class="videoPlay"/></i>
                </div>
              </div>
              <div class="office">
                <div
                  v-for="item in detailInfo.officeList"
                  :key="item.pathId"
                  class="item"
                  @click="openPdf(item)"
                >
                  <el-image :src="item.thumbnailPathId" fit="contain" />
                  <div>
                    <span class="name">{{ item.resourceName }}</span>
                    <span class="size">{{
                      (item.pdfPageSize / 1024).toFixed(2) + "K"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text common">
          <h3>文本</h3>
          <div class="text-content" v-if="detailInfo.submitContent">
            <span>{{ detailInfo.submitTitle }}</span>
            <div>
              {{ detailInfo.submitContent }}
            </div>
          </div>
          <no-data v-else></no-data>
        </div>
        <!-- <div class="data common"> -->
        <!-- <h3>预习资料</h3>
          <ul class="ppt">
            <li v-for="i in [1, 2, 3]" :key="i">
              <svg-icon icon-class="ppt"></svg-icon>
              <div>
                <span class="name">一个很长的文件名字很长哦.pptx</span>
                <span class="size">552k</span>
              </div>
            </li>
          </ul> -->
        <!-- <div class="video">
            <video-player
              class="video-player-box vjs-custom-skin"
              :style="{}"
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true"
              @ready="playerReadied"
              @pause="onPlayerPause($event)"
              @play="onPlayerPlay($event)"
              @canplay="onPlayerCanplay($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              customEventName="customstatechangedeventname"
              @statechanged="playerStateChanged($event)"
            >
            </video-player>
          </div> -->
        <!-- </div> -->
        <div class="titles common">
          <h3>题目</h3>
          <ul v-if="detailInfo && detailInfo.answerDetailEntities.length">
            <li
              v-for="(item, index) in detailInfo.answerDetailEntities"
              :key="item.id"
            >
              <svg-icon
                v-if="item.studentAnswer != null"
                :icon-class="
                  item.studentAnswer == item.answer
                    ? 'answerRight'
                    : 'answerError'
                "
              />
              <div class="name">{{ index + 1 }}、{{ item.stem }}（ ）</div>
              <div v-if="item.type == 1" class="content">
                <ul>
                  <li v-for="(option, index) in item.optionList" :key="index">
                    {{ String.fromCharCode(65 + index) }}.{{ option.item }}
                  </li>
                </ul>
              </div>
              <div v-else class="content content-judge">
                <ul>
                  <li>
                    <el-radio-group>
                      <el-radio label="1">正确</el-radio>
                      <el-radio label="2">错误</el-radio>
                    </el-radio-group>
                  </li>
                </ul>
              </div>
              <div class="answer">
                <span class="rightAnswer"
                  >正确答案<span>{{
                    item.type == 1
                      ? item.answer == 0
                        ? "A"
                        : item.answer == 1
                        ? "B"
                        : item.answer == 2
                        ? "C"
                        : item.answer == 3
                        ? "D"
                        : item.answer == 4
                        ? "E"
                        : "F"
                      : item.answer == 1
                      ? "错误"
                      : "正确"
                  }}</span></span
                >
                <span class="studentAnswer"
                  >学生答案<span>{{
                    item.type == 1
                      ? item.studentAnswer == 0
                        ? "A"
                        : item.studentAnswer == 1
                        ? "B"
                        : item.studentAnswer == 2
                        ? "C"
                        : item.studentAnswer == 3
                        ? "D"
                        : item.studentAnswer == 4
                        ? "E"
                        : item.studentAnswer == 5
                        ? "F"
                        : "未答"
                      : item.studentAnswer == 1
                      ? "错误"
                      : item.studentAnswer == 0
                      ? "正确"
                      : "未答"
                  }}</span></span
                >
              </div>
              <div class="look">
                <span @click="lookAnalysis(item.analysis)">查看解析</span>
              </div>
            </li>
          </ul>
          <no-data v-else></no-data>
        </div>
      </div>
    </div>
    <el-dialog
      title="答案解析"
      :visible.sync="dialogAnalysisVisible"
      custom-class="lookAnalysis"
    >
      <el-input v-model="analysis" type="textarea" disabled />
    </el-dialog>
    <video-dialog-vue
      :visible="dialogVideoVisible"
      :sources="videoSources"
      @close="videoClose"
    ></video-dialog-vue>

    <audio-dialog-vue
      :visible="dialogAudioVisible"
      :sources="music"
      @close="audioClose"
    ></audio-dialog-vue>
    <!-- pdf -->
    <el-dialog :visible.sync="dialogPdfVisible" :destroy-on-close="true">
      <div class="content-box" style="height:470px" ref="pdf">
        <!-- <embed :src="dialogPdfUrl" style="width: 100%;height: 100%;" /> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import _ from "lodash";
  import {
    fetchCourse_previewDetail,
    fetchCourse_studentDetail
  } from "@/api/classes";
  import { getStudent_Detail } from "@/api/student";

  import videoDialogVue from "../../components/videoDialog.vue";
  import audioDialogVue from "../../components/audioDialog.vue";

  export default {
    name: "PreviewDetails",
    components: {
      audioDialogVue,
      videoDialogVue
    },
    data() {
      return {
        audioPlay: false,
        analysis: "",
        dialogAudioVisible: false,
        dialogAnalysisVisible: false,
        dialogVideoVisible: false,
        detailInfo: "",
        studentInfo: "",
        dialogPdfVisible: false,
        dialogPdfUrl: "",
        videoSources: {},

        isPlay: false,
        isReady: false,
        music: {}
      };
    },
    computed: {
      score() {
        return item => {
          return String(item.score);
        };
      },
      imageList() {
        const imgList = _.map(this.detailInfo.photoList, o => {
          return o.pathStr;
        });
        return imgList;
      }
    },
    created() {
      fetchCourse_studentDetail({
        courseType: "1",
        studentId: this.$route.params.studentId,
        courseId: this.$route.params.courseId
      }).then(res => {
        console.log("学生详情：：：", res);
        this.studentInfo = res.data.data;
      });
      fetchCourse_previewDetail({
        courseId: this.$route.params.courseId,
        studentId: this.$route.params.studentId,
        courseType: 1
      }).then(res => {
        console.log("预习详情：：：", res);
        this.detailInfo = res.data.data;
      });
    },
    methods: {
      lookVideo(val) {
        // console.log(val);
        this.$refs.voice && this.$refs.voice.pause();
        this.audioPlay = false;

        // this.analysis = val;
        const { pathStr: src, resourceName: title } = val;
        this.videoSources = {
          src,
          title
        };

        this.dialogVideoVisible = true;
      },
      openPdf(item) {
        console.log(item);
        this.dialogPdfUrl = item.pdfUrl;
        this.dialogPdfVisible = true;
        this.$nextTick().then(() => {
          //  console.log(this.$refs.pdf);
          let txt = document.createElement("embed"); //创建文本节点
          txt.setAttribute("src", item.pdfUrl);
          txt.setAttribute("style", "width: 100%;height: 100%;");
          //把创建的文本节点追加到元素节点中
          this.$refs.pdf.appendChild(txt);
        });
      },
      previewAudioPlay() {
        let time = null;
        if (!this.audioPlay) {
          this.$refs.voice.play();
          this.audioPlay = true;
          this.$refs.voice.addEventListener(
            "ended",
            () => {
              this.audioPlay = false;
              time = null;
            },
            false
          );
        } else {
          this.audioPlay = false;
          this.$refs.voice.pause();
          time = null;
        }
      },
      lookAnalysis(val) {
        this.analysis = val;
        this.dialogAnalysisVisible = true;
      },
      audio_play(val) {
        this.$refs.voice && this.$refs.voice.pause();
        this.audioPlay = false;
        console.log(val);
        const {
          //originName: title,
          pathStr: src,
          thumbnailPathId: pic,
          resourceName: name
        } = val;
        this.music = {
          title: name,
          artist: "",
          src,
          pic,
          name
          // lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
        };
        this.dialogAudioVisible = true;
        // this.$nextTick(() => {
        //   this.$refs.audio.play();
        // });
        // console.log(this.$refs.audio);
      },
      videoClose() {
        this.dialogVideoVisible = false;
      },
      audioClose() {
        this.dialogAudioVisible = false;
      },
      togglePlay() {},
      playerStateChanged(e) {
        console.log("改变");
      },
      onPlayerCanplay(e) {
        console.log("可以");
      },
      playerReadied(e) {
        // console.log("ready");
        // var hls = e.tech({ IWillNotUseThisInPlugins: true }).hls;

        // e.tech_.hls.xhr.beforeRequest = function(options) {
        //   // console.log(options)
        //   return options;
        // };
        this.isReady = true;
      },
      onPlayerTimeupdate(e) {
        // console.log("时间", e.currentTime());
        if (this.trySee <= 0) return;
        if (e.currentTime() >= this.trySee * 60) {
          this.visible = true;
          // e.bigPlayButton.disable();
          e.exitFullscreen();
          e.pause();
        } else {
          e.bigPlayButton.enable();
        }
      },
      videoPlay(item, i) {
        // if (this.isPay) {
        //   this.visible = true;
        //   return;
        // }
        // if (this.isPlay && this.defaultVideo == i) {
        //   this.isPlay = false;
        //   this.$refs.videoPlayer.player.pause();
        // } else {
        //   this.defaultVideo = i;
        //   this.isPlay = true;
        //   this.trySee = item.trySee;
        //   this.playerOptions.sources[0].src = item.url;
        //   // this.$nextTick().then(() => {
        //   setTimeout(() => {
        //     this.$refs.videoPlayer.player.play();
        //   }, 100);
        // });
        // }
      },
      onPlayerPlay(e) {
        // if (this.isLogin) {
        this.isPlay = true;
        // } else {
        //   this.$router.push("/login");
        // }
      },
      onPlayerPause(e) {
        this.isPlay = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-image {
    background: #f7f7f7 !important;
  }
  .base-information {
    width: 100%;
    margin-bottom: 38px;
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
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 12px 0px rgba(202, 202, 202, 0.5);
      border-radius: 12px;
      display: flex;
      align-items: center;
      flex-direction: column;

      padding: 0 20px;

      .avatar {
        display: flex;
        justify-content: flex-start;
        height: 60px;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        width: 100%;
        color: rgba(75, 75, 75, 1);

        >>> .el-avatar {
          margin-right: 9px;
        }
      }
      .ev {
        border-top: #f0f0f0 1px solid;
        font-size: 14px;
        display: flex;
        justify-content: flex-start;
        width: 100%;
        padding: 10px 0;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(148, 148, 148, 1);
        line-height: 26px;
      }
    }
  }
  .content {
    margin-top: 20px;
    .common {
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;
      margin-bottom: 20px;

      padding: 0 20px;
      > h3 {
        height: 40px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(80, 90, 100, 1);
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
      }
    }
    .base {
      .content {
        // padding: 15px 0;
        //padding-bottom: 15px;
        > span {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(80, 90, 100, 1);
          line-height: 22px;
        }
        .voice {
          margin: 20px 0;
          display: flex;
          align-items: center;
          > span:not(.el-avatar) {
            display: flex;
            align-items: center;
            width: 315px;
            height: 36px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            background: rgba(29, 170, 253, 1);
            border-radius: 35px;
            position: relative;
            // padding-left: 30px;
            .svg-icon {
              width: 14px;
              height: 14px;
              margin-left: 11px;
              margin-right: 6px;
            }
            i {
              margin-left: 12px;
              margin-right: 6px;
              // margin-top: 2px;
              display: flex;
              img {
                height: 16px;
              }
            }
            &::before {
              content: "";
              width: 0;
              height: 0;
              border-width: 7px 14px 7px 0;
              border-style: solid;
              border-color: transparent #1daafd transparent transparent; /*透明 灰 透明 透明 */
              // margin: 40px auto;
              position: absolute;
              left: -7px;
            }
          }
          > img {
            height: 60px;
            width: 60px;
            margin-right: 15px;
          }
        }
        .office {
          display: flex;
          flex-wrap: wrap;
          //margin-right: -100px;
          .item {
            display: flex;
            width: (100% / 3);
            margin-top: 20px;
            margin-bottom: 35px;
            margin-right: 0px;
            cursor: pointer;
            align-items: center;
            .el-image {
              width: 70px;
              height: 70px;
            }
            &:last-child {
              margin-right: 0;
            }
            .svg-icon {
              width: 70px;
              height: 70px;
              margin-right: 20px;
            }
            img {
              width: 70px;
              height: 70px;
              margin-right: 20px;
              border-radius: 8px;
            }
            > div {
              display: flex;
              flex-direction: column;
              &:not(.el-image) {
                flex: 1;
              }
              .name {
                width: 100%;
                padding-right: 10px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(75, 75, 75, 1);
                line-height: 20px;
                margin-bottom: 9px;
                margin-top: 11px;
              }
              .size {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(168, 176, 185, 1);
                line-height: 22px;
              }
            }
          }
        }
        .commonStyle {
          padding-top: 20px;
          border-bottom: 2px solid #f0f0f0;
          display: flex;
          flex-wrap: wrap;
          &:last-child {
            padding-bottom: 0;
            border-bottom: none;
          }
          .el-image {
            margin-bottom: 20px;
          }
          .item {
            position: relative;
            cursor: pointer;
            width: 192px;
            height: 144px;
            margin-bottom: 20px;
            margin-right: 20px;
            .aplayer {
              margin: 0;
              width: 100%;
              height: 100%;
              box-shadow: none;

              // >>> .aplayer-body {
              //   width: 100%;
              //   height: 100%;
              //   .aplayer-pic {
              //     width: 100%;
              //     height: 100%;
              //     .aplayer-button {
              //       opacity: 0;
              //     }
              //   }
              //   .aplayer-info {
              //     display: none;
              //   }
              // }
            }
          }
          &.video {
            .item {
              width: 192px;
              height: 144px;
              position: relative;
              overflow: hidden;
              border-radius: 8px;
              > span {
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(61, 61, 61, 1);
                opacity: 0.66;
                height: 20px;
                width: 100%;
                position: absolute;
                bottom: 0;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
            }
          }
          .audio {
            padding-bottom: 0;
            width: 192px;
            height: 144px;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            img {
              width: 100%;
              // height: 100%;
            }
            > span {
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(61, 61, 61, 1);
              opacity: 0.66;
              height: 20px;
              width: 100%;
              position: absolute;
              bottom: 0;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }
            >>> .item {
              .aplayer {
                .aplayer-body {
                  height: 144px;
                  .aplayer-pic {
                    width: 192px;
                    height: 144px;
                    border-radius: 8px;
                    .aplayer-play {
                      height: 70px;
                      width: 70px;
                      margin: 0 -35px -35px 0;
                      opacity: 1;
                      background: #fff;
                      > button {
                        // display: none;

                        position: static;
                        height: 70px;
                        width: 70px;
                        background: url("../../../../assets/images/audio.png");
                        opacity: 1;
                        > svg {
                          display: none;
                        }
                      }
                    }
                  }
                  .aplayer-info {
                    height: 100%;
                    .aplayer-controller {
                      height: 50px;
                      display: flex;
                      align-items: flex-end;
                      padding-bottom: 10px;
                      .aplayer-bar-wrap {
                        .aplayer-bar {
                          height: 5px;
                          border-radius: 5px;
                          // overflow: hidden;
                          .aplayer-loaded {
                            height: 5px;
                            border-radius: 5px;
                          }
                          .aplayer-played {
                            height: 5px;
                            border-radius: 5px;
                            .aplayer-thumb {
                              margin-top: -4px;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                .aplayer-list {
                  height: auto !important;
                  > ol {
                    height: auto !important;
                    li {
                      height: 50px;
                      line-height: 50px;
                      .aplayer-list-cur {
                        top: 14px;
                      }
                      &.aplayer-list-light {
                      }
                    }
                  }
                }
              }
            }
          }

          i {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 70px;
            height: 70px;
            margin-left: -35px;
            margin-top: -35px;
            pointer-events: none;
          }
          .svg-icon {
            width: 100%;
            height: 100%;
          }
        }
        .el-image {
          width: 192px;
          height: 144px;
          background: rgba(216, 216, 216, 1);
          border-radius: 8px;
          margin-right: 20px;
        }
      }
    }
    .text {
      .text-content {
        padding-bottom: 17px;
        span {
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          line-height: 22px;
          display: flex;
          margin: 19px 0 15px;
        }
        > div {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(75, 75, 75, 1);
          line-height: 22px;
        }
      }
    }
    .data {
      ul.ppt {
        display: flex;
        flex-direction: column;
        padding: 20px 0;
        li {
          display: flex;
          margin-bottom: 35px;
          cursor: pointer;
          &:last-child {
            margin-bottom: 0;
          }
          .svg-icon {
            width: 70px;
            height: 70px;
            margin-right: 20px;
          }
          > div {
            display: flex;
            flex-direction: column;
            .name {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(75, 75, 75, 1);
              line-height: 20px;
              margin-bottom: 9px;
              margin-top: 11px;
            }
            .size {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(168, 176, 185, 1);
              line-height: 22px;
            }
          }
        }
      }
      .video {
        >>> .video-player {
          .vjs-big-play-button {
            height: 2em !important;
            width: 2em;
            border: 0;
            background: transparent;
            border-radius: 2em;
            background: url("../../../../assets/images/play-btn.png");
            &::before {
              display: none;
            }
            .vjs-icon-placeholder {
              &::before {
                display: none;
              }
            }
          }
        }
      }
    }
    .titles {
      ul {
        display: flex;
        flex-direction: column;
        padding: 15px 0;
        padding-top: 0;
        li {
          display: flex;
          flex-direction: column;
          padding-bottom: 20px;
          border-bottom: #f0f0f0 solid 1px;
          .svg-icon {
            width: 81px;
            height: 28px;
            margin-top: 15px;
          }
          &:last-child {
            border-bottom: 0;
          }
          .name {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(75, 75, 75, 1);
            line-height: 30px;
            margin-bottom: 20px;
            margin-top: 25px;
          }
          .content {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(75, 75, 75, 1);
            line-height: 40px;
            // display: flex;
            padding-left: 10px;

            ul {
              li {
                border-bottom: none;
              }
            }
            &.content-judge {
              ul {
                li {
                  .el-radio-group {
                    display: flex;
                  }
                }
              }
            }
          }
          .answer {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 22px;
            .rightAnswer {
              color: #76be45;
              margin-right: 26px;
              span {
                margin-left: 15px;
              }
            }
            .studentAnswer {
              color: #ff7070;
              span {
                margin-left: 15px;
              }
            }
          }

          .look {
            display: flex;
            justify-content: flex-end;
          }
          .look > span {
            width: 100px;
            height: 28px;
            background: linear-gradient(
              135deg,
              rgba(148, 241, 239, 1) 0%,
              rgba(0, 199, 247, 1) 100%
            );
            box-shadow: 0px 8px 10px 0px rgba(191, 248, 242, 0.71);
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            cursor: pointer;
            transition: background 0.3s;
            &:hover {
              background: linear-gradient(
                135deg,
                rgba(178, 246, 244, 1) 0%,
                rgba(72, 218, 253, 1) 100%
              );
            }
            &:active {
              background: linear-gradient(
                135deg,
                rgba(105, 223, 220, 1) 0%,
                rgba(0, 165, 204, 1) 100%
              );
            }
          }
        }
      }
    }
  }
  >>> .el-dialog__wrapper {
    .lookAnalysis {
      width: 680px;
      height: 400px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(136, 136, 136, 0.5);
      border-radius: 14px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-textarea {
          width: 100%;
          .el-textarea__inner {
            height: 280px;
            outline: none;
            resize: none;
            color: #666;
          }
        }
      }
    }
  }
</style>
