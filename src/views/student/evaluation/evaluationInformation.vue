<template>
  <div class="evaluation-information main-view">
    <div class="tabContainer">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-if="testRequirement"
          label="评测要求"
          name="first"
          v-html="testRequirement"
        >
        </el-tab-pane>
        <el-tab-pane v-else label="评测要求" name="first">
          <no-data></no-data>
        </el-tab-pane>

        <el-tab-pane label="评测提交" name="second">
          <div v-if="evaluationCommit">
            <div class="createTime">
              提交时间：
              {{ evaluationCommit.submitDate | parseTime("{y}-{m}-{d}") }}
            </div>
            <div class="annex">
              <h2>附件</h2>
              <div class="content">
                <!-- 视频 -->
                <div class="video commonStyle">
                  <div
                    v-for="item in evaluationCommit.videoList"
                    :key="item.savePathId"
                    class="item"
                    @click="lookVideo(item)"
                  >
                    <el-image
                      style="width: 192px; height: 144px;"
                      :src="item.thumbnailPathId"
                      fit="contain"
                    />
                    <span>
                      {{ item.duration | durationTrans() }}
                    </span>
                    <i><svg-icon icon-class="videoPlay" /></i>
                  </div>
                </div>
                <!-- 音频 -->
                <div class="audio commonStyle">
                  <div
                    v-for="(item, i) in evaluationCommit.audioList"
                    :key="item.pathId"
                    class="item"
                    @click="audio_play(item)"
                  >
                    <div class="audio">
                      <el-image
                        style="width: 192px; height: 144px;"
                        :src="item.thumbnailPathId"
                        fit="contain"
                      />
                      <span>
                        {{ item.duration | durationTrans() }}
                      </span>
                    </div>
                    <i><svg-icon icon-class="audioPlay" /></i>
                  </div>
                </div>
                <!-- 图片 -->
                <!-- <div class="image__preview"> -->
                <div class="commonStyle">
                  <el-image
                    v-for="item in evaluationCommit.photoList"
                    :key="item.pathId"
                    :src="item.pathStr"
                    fit="contain"
                    :preview-src-list="
                      preview_img_list(evaluationCommit.photoList)
                    "
                  />
                </div>
                <!-- </div> -->
              </div>
            </div>
            <div
              class="textContent"
              v-if="
                evaluationCommit.submitTitle || evaluationCommit.submitContent
              "
            >
              <h2>文本内容</h2>
              <div>
                <div>标题：{{ evaluationCommit.submitTitle }}</div>
                <div class="content">
                  内容：{{ evaluationCommit.submitContent }}
                </div>
              </div>
              <!-- <no-data v-else></no-data> -->
            </div>
          </div>
          <no-data v-else></no-data>
        </el-tab-pane>
        <el-tab-pane label="评测结果" name="third">
          <div class="tabContent" v-show="scoreList.length">
            <div class="canvasBox">
              <div
                class="radar"
                id="myChart"
                style="width: 500px; height: 400px;"
              ></div>
              <img
                class="avatar"
                :src="studentPhotoStr"
                v-if="studentPhotoStr"
              />
            </div>
            <div class="textContent">
              <h2>教师点评</h2>
              <div class="content" v-html="assessmentContent"></div>
            </div>
          </div>
          <no-data v-if="scoreList.length <= 0" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <video-dialog-vue
      :visible="dialogVideoVisible"
      :sources="videoSources"
      @close="dialogVideoVisible = false"
    />

    <audio-dialog-vue
      :visible="dialogAudioVisible"
      :sources="music"
      @close="dialogAudioVisible = false"
    />
  </div>
</template>

<script>
  // 引入基本模板
  let echarts = require("echarts/lib/echarts");
  require("echarts/lib/chart/bar");
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  require("echarts/lib/chart/radar");

  import {
    getEvaluation_desc,
    getEvaluation_commit,
    getEvaluation_result,
  } from "@/api/student";

  import audioDialogVue from "@/views/classes/components/audioDialog";
  import videoDialogVue from "@/views/classes/components/videoDialog";

  export default {
    name: "EvaluationInformation",
    components: {
      audioDialogVue,
      videoDialogVue,
    },
    data() {
      return {
        dialogAudioVisible: false,
        dialogVideoVisible: false,
        activeName: "first",
        studentId: "",
        testRequirement: "",
        evaluationCommit: "",
        assessmentContent: "",
        studentPhotoStr: "",
        videoSources: {},
        scoreList: [], //评测结果
        music: {},
        radarOption: {
          title: {
            // text: "学生评测信息图"
          },
          tooltip: {
            padding: 15,
            confine: true,
          },
          radar: [
            {
              indicator: [
                // { examContent: "形象气质", max: 100 },
                // { examContent: "表达能力", max: 100 },
                // { examContent: "文学功底", max: 100 },
                // { examContent: "学习能力", max: 100 },
                // { examContent: "表演方法", max: 100 },
              ],
              center: ["50%", "50%"],
              radius: 120,
              splitNumber: 4,
              name: {
                formatter: function (value, indicator) {
                  return indicator.examContent;
                },
                textStyle: {
                  color: "#505A64",
                },
              },
              axisLine: {
                lineStyle: {
                  type: "dashed",
                  color: "#505A64",
                },
              },
              splitLine: {
                lineStyle: {
                  color: ["#505A64", "#fff", "#fff", "#fff"],
                },
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: "#fff",
                },
              },
              triggerEvent: true,
            },
          ],
          series: [
            {
              name: "学生评测信息图",
              type: "radar",
              symbol: "none",
              data: [
                {
                  value: [],
                  lineStyle: {
                    color: "rgba(255,255,255,0)",
                  },
                  areaStyle: {
                    opacity: 0.9,
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                      {
                        color: "#76BDFF",
                        offset: 0,
                      },
                      {
                        color: "#0066FF",
                        offset: 1,
                      },
                    ]),
                  },
                },
              ],
            },
          ],
        },
      };
    },
    computed: {
      preview_img_list() {
        return (val) => {
          return _.map(val, (o) => {
            return o.pathStr;
          });
        };
      },
    },
    created() {
      this.getEvaluationDesc();
      this.getEvaluationCommit();
      this.getEvaluationResult();
    },
    methods: {
      lookVideo(val) {
        console.log(val);
        const { pathStr: src, resourceName: title } = val;
        this.videoSources = {
          src,
          title,
        };
        this.dialogVideoVisible = true;
      },
      audio_play(val) {
        console.log(val);
        const {
          originName: title,
          pathStr: src,
          thumbnailPathId: pic,
          resourceName: name,
        } = val;
        this.music = {
          title,
          artist: "",
          src,
          pic,
          name,
        };
        this.dialogAudioVisible = true;
      },
      init() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById("myChart"));
        // 绘制图表
        myChart.setOption(this.radarOption);
        myChart.on("mouseover", (params) => {
          this.radarOption.radar[0].indicator.find((n, i) => {
            if (n.examContent == params.name) {
              this.radarOption.radar[0].indicator[i].color = "#2A94FF";
            } else {
              this.radarOption.radar[0].indicator[i].color = "#505A64";
            }
          });
          myChart.setOption(this.radarOption);
        });
      },
      async getEvaluationDesc() {
        await getEvaluation_desc({ id: this.$route.params.id }).then((res) => {
          console.log("评测要求：：：", res);
          if (res.data.data) this.testRequirement = res.data.data.testRequirement;
        });
      },
      async getEvaluationCommit() {
        await getEvaluation_commit({
          schoolEvaluationId: this.$route.params.id,
          studentId: this.$route.params.sid,
        }).then((res) => {
          console.log("评测提交：：：", res);
          this.evaluationCommit = res.data.data;
        });
      },
      async getEvaluationResult() {
        await getEvaluation_result({
          schoolEvaluationId: this.$route.params.id,
          studentId: this.$route.params.sid,
        }).then((res) => {
          console.log("评测结果：：：", res.data.data);
          if (res.data.data) {
            const { scoreList } = res.data.data;
            this.scoreList = scoreList;

            this.radarOption.radar[0].indicator = res.data.data.scoreList.map(
              (item) => {
                return { ...item, max: 100 };
              }
            );
            this.radarOption.series[0].data[0].value = res.data.data.scoreList.map(
              (item) => item.score
            );
            this.assessmentContent = res.data.data.assessmentContent;
            this.studentPhotoStr = res.data.data.student.studentPhotoStr;
            this.init();
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .evaluation-information {
    .tabContainer {
      margin-top: 20px;
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;
      .el-tabs {
        >>> .el-tabs__nav-wrap::after {
          background-color: #e8e8e8;
        }
        >>> .el-tabs__nav-scroll {
          .el-tabs__item {
            padding: 0 75px;
            &:nth-child(2) {
              padding-left: 34px;
            }
            &:last-child {
              padding-right: 0;
            }
          }
        }

        >>> .el-tabs__content {
          padding: 0 34px 20px;
          .createTime {
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(168, 176, 185, 1);
            line-height: 20px;
            margin-bottom: 8px;
          }
          h2 {
            height: 25px;
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(80, 90, 100, 1);
            line-height: 25px;
            margin-bottom: 10px;
          }
          .annex {
            margin-bottom: 30px;
            .commonStyle {
              padding-top: 20px;
              display: flex;
              flex-wrap: wrap;
              .item {
                position: relative;
                cursor: pointer;
                width: 192px;
                height: 144px;
                margin-bottom: 20px;
                margin-right: 20px;
                overflow: hidden;
                border-radius: 8px;
                background-color: #f7f7f7;
                span {
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
                i {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  width: 70px;
                  height: 70px;
                  margin-left: -35px;
                  margin-top: -35px;
                  pointer-events: none;
                  .svg-icon {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
              .el-image {
                width: 192px;
                height: 144px;
                background-color: #f7f7f7;
                margin-bottom: 20px;
                margin-right: 20px;
                overflow: hidden;
                border-radius: 8px;
                background-color: #f7f7f7;
              }
            }
          }
          .tabContent {
            display: flex;
            align-items: center;
            .canvasBox {
              width: 500px;
              height: 400px;
              position: relative;
              .avatar {
                width: 63px;
                height: 63px;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: -31.5px;
                margin-top: -31.5px;
                cursor: pointer;
              }
            }
            .textContent {
              flex: 1;
            }
          }
        }
      }
    }
  }
</style>
