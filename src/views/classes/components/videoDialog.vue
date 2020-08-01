<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVideoVisible"
      custom-class="lookVideo"
      @close="videoClose"
    >
      <div class="video">
        <video-player
          ref="videoPlayer"
          class="video-player-box vjs-custom-skin"
          :style="{}"
          :options="playerOptions"
          :playsinline="true"
          custom-event-name="customstatechangedeventname"
          @ready="playerReadied"
          @pause="onPlayerPause($event)"
          @play="onPlayerPlay($event)"
          @canplay="onPlayerCanplay($event)"
          @timeupdate="onPlayerTimeupdate($event)"
          @statechanged="playerStateChanged($event)"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import "video.js/dist/video-js.css";
  import "vue-video-player/src/custom-theme.css";
  // import "videojs-contrib-hls";
  // import "video.js/dist/lang/zh-CN";
  import { videoPlayer } from "vue-video-player";
  export default {
    components: { videoPlayer },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      sources: {
        type: Object,
        default: {
          type: {
            type: String,
            default: "video/mp4"
          },
          src: "" // http://vod.wecho.com.cn/sv/185f83ac-17207e0d07a/185f83ac-17207e0d07a.mp4
        }
      }
    },
    data() {
      return {
        dialogVideoVisible: false,
        title: "观看视频",
        playerOptions: {
          // videojs options
          muted: false,
          language: "zh-CN",
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          preload: true,
          fluid: true,
          // flash: { hls: { withCredentials: false } },
          // html5: { hls: { withCredentials: false } },
          sources: [
            {
              // withCredentials: false,
              type: "video/mp4",
              src: ""
              //"http://vod.wecho.com.cn/sv/185f83ac-17207e0d07a/185f83ac-17207e0d07a.mp4"
            }
          ],
          poster: ""
        }
      };
    },
    watch: {
      visible(newVal) {
        // console.log(newVal);
        this.dialogVideoVisible = newVal;
        if (newVal) {
          this.$nextTick().then(() => {
            // console.log(this.$refs.videoPlayer);
            setTimeout(() => {
              this.$refs.videoPlayer.player.play();
            }, 100);
          });
        }
      },
      sources: {
        handler(newVal) {
          // this.$set(this.playerOptions, "sources", {
          //   ...newVal,
          //   type: "video/mp4"
          //   //src: ''
          // });
          this.playerOptions.sources[0].src = newVal.src;
          this.title = newVal.title || "观看视频";
        },
        immediate: true
      }
    },
    methods: {
      videoClose() {
        // console.log(this.$refs.videoPlayer);
        this.$emit("close");
        this.$nextTick().then(() => {
          this.$refs.videoPlayer.player.pause();
        });
      },
      playerStateChanged(e) {
        // console.log("改变");
      },
      onPlayerCanplay(e) {},
      playerReadied(e) {
        // console.log("ready");
        // var hls = e.tech({ IWillNotUseThisInPlugins: true }).hls;
        // e.tech_.hls.xhr.beforeRequest = function(options) {
        //   // console.log(options)
        //   return options;
        // };
        // this.isReady = true;
      },
      onPlayerTimeupdate(e) {
        // console.log("时间", e.currentTime());
        // if (this.trySee <= 0) return;
        // if (e.currentTime() >= this.trySee * 60) {
        //   this.visible = true;
        //   // e.bigPlayButton.disable();
        //   e.exitFullscreen();
        //   e.pause();
        // } else {
        //   e.bigPlayButton.enable();
        // }
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
        // this.isPlay = true;
        // } else {
        //   this.$router.push("/login");
        // }
      },
      onPlayerPause(e) {
        // this.isPlay = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  >>> .lookVideo {
    margin-bottom: 15vh;
    height: calc(100% - 30vh);
    .el-dialog__body {
      height: calc(100% - 54px);
      .video {
        height: 100%;
        .video-player {
          height: 100%;
          .video-js {
            height: 100%;
            &.vjs-fluid {
              padding-top: 0;
            }
            .vjs-tech {
              height: 100%;
            }
          }
          .vjs-big-play-button {
            height: 2em !important;
            width: 2em;
            border: 0;
            background: transparent;
            border-radius: 2em;
            margin-left: -1em;
            background: url("../../../assets/images/play-btn.png");
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
  }
</style>
