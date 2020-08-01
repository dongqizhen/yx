<template>
  <div>
    <el-dialog
      :visible.sync="dialogAudioVisible"
      :title="title"
      custom-class="lookAudio"
      destroy-on-close
      @close="audioClose"
    >
      <aplayer
        ref="audio"
        repeat="repeat-one"
        theme="#0084FF"
        autoplay
        :music="music"
      />
    </el-dialog>
  </div>
</template>

<script>
  import aplayer from "vue-aplayer";
  export default {
    components: { aplayer },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      sources: {
        type: Object,
        default: {
          title: "",
          artist: "",
          src: "",
          pic: ""
        }
      }
    },
    data() {
      return {
        dialogAudioVisible: false,
        title: "音频",
        music: {
          title: "",
          artist: "",
          src: "", // https://s320.xiami.net/258/23258/2105437140/1814252644_1573676773631_4942.mp3?ccode=xiami_web_web&expire=86400&duration=210&psid=7666df987c8c70ff5420f9832de2daf0&ups_client_netip=59.108.166.96&ups_ts=1589793890&ups_userid=0&utid=rUkMF50jXRECATtspmDSEngh&vid=1814252644&fn=1814252644_1573676773631_4942.mp3&vkey=Bca17018173cc2605e1a2f81e922d2ea7
          pic: "" // http://y.gtimg.cn/music/photo_new/T002R300x300M00000305wU026VxBy_1.jpg?max_age=2592000
        }
      };
    },
    watch: {
      visible(newVal) {
        // console.log(newVal);
        this.dialogAudioVisible = newVal;
        if (newVal) {
          this.$nextTick().then(() => {
            setTimeout(() => {
              this.$refs.audio.play();
            }, 100);
          });
        } else {
          this.$nextTick().then(() => {
            setTimeout(() => {
              this.$refs.audio.pause();
            }, 100);
          });
        }
      },
      sources: {
        handler(newVal) {
          // console.log(newVal);
          this.music = newVal;
          this.title = newVal.name;
        },
        immediate: true
      }
    },
    methods: {
      audioClose() {
        // console.log(this.$refs.audio);
        // this.$refs.audio.pause();
        // this.music = {
        //   title: "",
        //   artist: "",
        //   src: "",
        //   pic: ""
        // };
        this.$emit("close");
        // this.dialogVideoVisible = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  >>> .lookAudio {
    .el-dialog__body {
      padding-top: 50px;
      padding-bottom: 50px;
    }
    .aplayer {
      box-shadow: none;
      .aplayer-body {
        height: 144px;
        .aplayer-pic {
          width: 192px;
          height: 144px;
          border-radius: 8px;
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center;
          //background-image: none;
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
              background: url("../../../assets/images/audio.png");
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
            .aplayer-time {
              .aplayer-icon.aplayer-icon-mode {
                display: none;
              }
            }
          }
          .aplayer-author {
            display: none;
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
</style>
