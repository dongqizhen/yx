<template>
  <div class="art-source-resources main-view">
    <div class="resources-container">
      <div class="nav">
        <h2>专业</h2>
        <ul>
          <li
            v-for="item in professionList"
            :key="item.id"
            :class="{ active: professionId == item.id }"
            @click="clickProfession(item.id)"
          >
            {{ item.professionName }}
          </li>
        </ul>
      </div>
      <div class="nav">
        <h2>模块</h2>
        <ul>
          <li
            v-for="item in subjectList"
            :key="item.id"
            :class="{ active: subjectId == item.id }"
            @click="clickSubject(item.id)"
          >
            {{ item.subjectName }}
          </li>
        </ul>
      </div>
      <!-- <div class="add-btn">
        <span @click="add">添加资源</span>
      </div> -->
      <div class="content-box">
        <div class="left-menu">
          <h2>按章节目录选择</h2>
          <div class="directory-structure">
            <el-tree
              :data="catalogList"
              node-key="id"
              ref="tree"
              highlight-current
              @current-change="handleSelect"
              :render-content="renderContent"
              :props="{ children: 'children', label: 'catalogName' }"
            >
            </el-tree>
          </div>
        </div>
        <div class="right-content">
          <div class="type">
            <h2>类型：</h2>
            <ul>
              <li
                v-for="item in resourceTypeList"
                :key="item.id"
                @click="handleClickType(item)"
                :class="{ active: resourceType == item.id }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="type">
            <h2>场景：</h2>
            <ul>
              <li
                v-for="item in sceneLabelList"
                :key="item.id"
                @click="handleSceneLabel(item)"
                :class="{ active: sceneLabel == item.id }"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="search-pagination">
            <div class="search-box">
              <el-form
                ref="form"
                :model="listParams"
                @keyup.enter.native="handleSubmit"
              >
                <el-form-item>
                  <el-input
                    v-model="listParams.keyword"
                    placeholder="请输入资源关键字查询"
                  >
                    <i
                      class="el-icon-search el-input__icon"
                      slot="suffix"
                      @click="handleSubmit"
                    >
                    </i>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="table-container">
            <el-table :data="list" style="width: 100%" v-loading="listLoading">
              <el-table-column label="缩略图" align="left" min-width="3">
                <template slot-scope="scope">
                  <span @click="handlePreview(scope.$index, scope.row)">
                    <el-image :src="scope.row.sourceIcon" fit="contain" />
                    <div class="text">
                      <div>{{ scope.row.resourceName }}</div>
                      <div class="apply">
                        <span
                          v-for="item in scope.row.sceneLabels"
                          :key="item.code"
                        >
                          {{ item.name }}
                        </span>
                      </div>
                    </div>
                    <!-- <i></i> -->
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="状态" align="center" min-width="1">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.freezeFlag"
                    :width="50"
                    :active-value="0"
                    :inactive-value="1"
                    active-color="rgba(22,139,255,1)"
                    inactive-color="rgba(213,213,213,1)"
                    @change="switchChange(scope.$index, scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="操作" align="center" min-width="4">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    class="analyze"
                    round
                    @click="handleDownload(scope.$index, scope.row)"
                  >
                    下 载
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    class="edit"
                    round
                    @click="handleEdit(scope.$index, scope.row)"
                  >
                    编 辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    class="del"
                    @click="handleDelete(scope.$index, scope.row)"
                  >
                    删 除
                  </el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listParams.pageNumber"
              :limit.sync="listParams.pageSize"
              @pagination="getResourceList"
            />
          </div>
        </div>
      </div>

      <video-dialog
        :visible="dialogVideoVisible"
        :sources="videoSources"
        @close="videoClose"
      />

      <audio-dialog
        :visible.sync="dialogAudioVisible"
        :sources="music"
        @close="audioClose"
      />

      <image-dialog
        :urlList="srcList"
        :showViewer="dialogImageVisible"
        @close="dialogImageVisible = false"
      />

      <pdf-dialog
        :pdfUrl="dialogPdfUrl"
        :visible.sync="dialogPdfVisible"
        @close="dialogPdfVisible = false"
      />
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import Pagination from "@/components/Pagination";
  import AudioDialog from "@/views/classes/components/audioDialog";
  import VideoDialog from "@/views/classes/components/videoDialog";
  import PdfDialog from "@/components/PdfDialog";
  import ImageDialog from "@/components/ImageDialog";
  import { getList } from "@/api/artResources/profession";
  import { getSubjectList } from "@/api/artResources/subject";
  import { getChapterList } from "@/api/artResources/chapter";
  import { getPdfAddress } from "@/api/uploadFileTransformStatus";
  import {
    getResourceList,
    deleteResource,
    resourceFreeze
  } from "@/api/artResources/resources";

  // TODO;
  // const proxyUrl = "http://192.168.2.222:3001"; //dev
  //const proxyUrl = "http://192.168.2.224:3001"; //test
  export default {
    name: "Resources",
    components: { Pagination, AudioDialog, VideoDialog, PdfDialog, ImageDialog },
    data() {
      return {
        // downloadUrl:
        //   process.env.NODE_ENV !== "production"
        //     ? proxyUrl
        //     : "http://" + location.host,
        dialogImageVisible: false,
        dialogVideoVisible: false,
        dialogAudioVisible: false,
        dialogPdfVisible: false,
        dialogPdfUrl: "",
        professionList: [],
        professionId: "",
        subjectList: [],
        subjectId: "",
        catalogList: [],
        catalogId: "",
        resourceType: 0,
        sceneLabel: 0,
        music: {},
        videoSources: {},
        srcList: [],
        resourceTypeList: [
          { id: 0, name: "全部" },
          { id: 1, name: "视频" },
          { id: 2, name: "音频" },
          { id: 3, name: "图片" },
          { id: 4, name: "文本" }
        ],
        sceneLabelList: [
          { id: 0, name: "全部" },
          { id: 1, name: "课前" },
          { id: 2, name: "课中" },
          { id: 3, name: "课后" }
        ],
        list: [],
        loading: false,
        listLoading: false,
        total: 0,
        listParams: {
          pageNumber: 1,
          pageSize: 10,
          subjectId: null,
          professionId: null,
          catalogId: null,
          keyword: null,
          resourceType: null,
          sceneLabel: 0
        }
      };
    },
    computed: {
      sceneLabels(info) {
        // return
      }
    },
    beforeRouteEnter(to, from, next) {
      // if (from.name == "AddResource") {
      //   to.meta.fromAdd = true;
      // } else {
      //   to.meta.fromAdd = false;
      // }
      next();
    },
    created() {
      getList({}).then(res => {
        // console.log("专业列表::：", res);
        this.professionList = res.data.data.list;
        this.professionId = this.professionList[0].id;
        this.listParams.professionId = this.professionId;
        this.reqSubjectList(this.professionId);
      });
    },
    methods: {
      videoClose() {
        this.dialogVideoVisible = false;
      },
      audioClose() {
        this.dialogAudioVisible = false;
      },
      handleSubmit() {
        // console.log(this.listParams);
        this.listParams.pageNumber = 1;
        this.getResourceList();
      },
      switchChange(index, row) {
        resourceFreeze({ id: row.id }).then(res => {});
      },
      getResourceList() {
        // console.log(this.listParams);
        this.listLoading = true;
        getResourceList(this.listParams).then(res => {
          console.log(res);
          this.list = _.filter(res.data.data.list, { freezeFlag: 0 });
          this.total = res.data.data.amount;
          this.listLoading = false;
        });
      },
      handleClickType(item) {
        // console.log(item);
        this.resourceType = item.id;
        this.listParams.resourceType = item.id;
        this.getResourceList();
      },
      handleSceneLabel(item) {
        // console.log(item);
        this.sceneLabel = item.id;
        this.listParams.sceneLabel = item.id;
        this.getResourceList();
      },
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
        this.catalogId = key.id;
        this.listParams.catalogId = key.id;
        this.getResourceList();
      },
      clickProfession(id) {
        this.reqSubjectList(id);
      },
      clickSubject(id) {
        this.subjectId = id;
        this.listParams.subjectId = this.subjectId;
        this.getCatalogList(id);
      },
      reqSubjectList(professionId) {
        getSubjectList({ professionId: professionId }).then(res => {
          // console.log("科目列表::：", res);
          if (res.data.data.list.length) {
            this.professionId = professionId;
            this.listParams.professionId = professionId;
            this.subjectList = res.data.data.list;
            this.subjectId = this.subjectList[0].id;
            this.listParams.subjectId = this.subjectId;
            this.getCatalogList(this.subjectId);
          } else {
            this.$message({
              type: "warning",
              message: "此专业暂无模块",
              duration: 2000
            });
          }
        });
      },
      getCatalogList(subjectId) {
        getChapterList({
          subjectId: subjectId,
          professionId: this.professionId
        }).then(res => {
          // console.log("资源管理页面的目录结构：：：", res);
          this.catalogList = res.data.data.list;
          if (this.catalogList.length) {
            // this.catalogId = this.catalogList[0].id;
            // this.listParams.catalogId = this.catalogList[0].id;
            this.catalogId = "";
            this.listParams.catalogId = null;
          } else {
            this.listParams.catalogId = null;
          }
          this.getResourceList();
        });
      },
      add() {
        // this.$router.push("/artResources/addResource");
        this.$router.push("/artResources/resources/addResource");
      },
      handlePreview(index, row) {
        // console.log(index, row);
        if (row.resourceType == 1) {
          //视频
          this.videoSources = {
            src: row.savePathUrl,
            title: row.resourceName
          };
          this.dialogVideoVisible = true;
        } else if (row.resourceType == 2) {
          //音频
          this.music = {
            title: row.originName,
            src: row.savePathUrl,
            pic: row.sourceIcon,
            name: row.resourceName
          };
          this.dialogAudioVisible = true;
        } else if (row.resourceType == 3) {
          //图片
          this.srcList[0] = row.savePathUrl;
          this.dialogImageVisible = true;
        } else {
          //pdf
          getPdfAddress({ id: row.id }).then(res => {
            // console.log("获取的转化pdf：：：", res);
            if (res.data.data.transformStatus == 1) {
              this.$nextTick().then(() => {
                this.dialogPdfUrl = res.data.data.pdfUrl;
                this.dialogPdfVisible = true;
              });
            } else {
              this.$message.warning("文件暂未转换成功，请稍后重试");
              return;
            }
          });
        }
      },
      handleDownload(index, row) {
        console.log(row);
        if (row.resourceType == 3 || row.resourceType == 4) {
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = `${this.downloadUrl}/echo-art/publicResource/download?id=${row.id}`;
          a.download = "";
          a.click();
        } else {
          window.location.href =
            row.savePathUrl + "?response-content-disposition=attachment";
        }
      },
      downloadIamge(imgsrc, name) {
        const loading = this.$loading({
          lock: true,
          text: "正在导出,加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        //下载图片地址和图片名
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          loading.close();
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

          var a = document.createElement("a"); // 生成一个a元素
          var event = new MouseEvent("click"); // 创建一个单击事件
          a.download = name || "photo"; // 设置图片名称
          a.href = url; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = imgsrc;
      },
      handleEdit(index, row) {
        // console.log(index, row);
        this.$router.push({
          path: "/artResources/resources/addResource",
          query: { id: row.id }
        });
      },
      handleDelete(index, row) {
        // console.log(index, row);
        this.$confirm("您确定删除此条数据吗?", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "deleteDialog",
          type: "warning"
        })
          .then(() => {
            deleteResource({ id: row.id }).then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.$delete(this.list, index);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      renderContent(h, { node, data, store }) {
        // console.log(node, data, store);
        return (
          <span class="custom-tree-node">
            <span title={node.label}>
              {data.index} {node.label}
            </span>
          </span>
        );
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .art-source-resources {
    .resources-container {
      .nav {
        display: flex;
        h2 {
          width: 106px;
          letter-spacing: 36px;
          margin-right: 10px;
          font-weight: 600;
          color: #505a64;
          margin-top: 9px;
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          li {
            width: 180px;
            height: 36px;
            border-radius: 25px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            margin-right: 10px;
            background: rgba(255, 255, 255, 1);
            border-radius: 25px;
            border: 1px solid rgba(211, 211, 211, 1);
            color: #505a64;
            cursor: pointer;
            &.active {
              color: rgba(255, 255, 255, 1);
              background: rgba(42, 148, 255, 1);
              border-color: rgba(42, 148, 255, 1);
            }
          }
        }
      }
      .add-btn {
        display: flex;
        justify-content: flex-end;
        span {
          display: flex;
          width: 110px;
          height: 30px;
          background: linear-gradient(
            135deg,
            rgba(81, 195, 255, 1) 0%,
            rgba(42, 148, 255, 1) 100%
          );
          box-shadow: 0px 6px 10px 0px rgba(94, 181, 255, 0.5);
          border-radius: 20px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          justify-content: center;
          align-items: center;
          font-weight: 400;
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.4s;
          color: rgba(255, 255, 255, 1);
          margin-bottom: 10px;
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
      .content-box {
        display: flex;
        flex: 1;
        margin-top: 20px;
        .left-menu {
          width: 220px;
          // max-height: 400px;
          padding: 14px;
          background: #fff;
          border-radius: 12px;
          margin-right: 20px;
          h2 {
            width: 100%;
            height: 25px;
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(42, 148, 255, 1);
            line-height: 25px;
            margin-bottom: 10px;
          }
          .directory-structure {
            // max-height: 336px;
            overflow: auto;
            scrollbar-width: none; // firefox下滚动条不显示
            -ms-overflow-style: none; // IE下滚动条不显示
            //设置侧边栏滚动条不显示 chrome
            &::-webkit-scrollbar {
              display: none;
            }
          }
          /deep/ .el-tree {
            > .el-tree-node {
              .el-tree-node__label {
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              .el-tree-node__content {
                margin-bottom: 15px;
                .custom-tree-node {
                  width: 100%;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  // span {
                  //   width: 100%;
                  //   white-space: nowrap;
                  //   text-overflow: ellipsis;
                  //   overflow: hidden;
                  // }
                }
                .el-tree-node__label {
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  // font-weight: 600;
                  color: rgba(78, 78, 78, 1);
                  line-height: 22px;
                  height: 22px;
                }
              }
              .el-tree-node__children {
                .el-tree-node__label {
                  font-weight: 400;
                }
              }
            }
          }
        }
        .right-content {
          flex: 1;
          .type {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            h2 {
              margin-right: 10px;
              font-weight: 600;
              color: #505a64;
            }
            ul {
              display: flex;
              li {
                width: 80px;
                height: 30px;
                background: rgba(255, 255, 255, 1);
                border-radius: 25px;
                border: 1px solid rgba(211, 211, 211, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                cursor: pointer;
                &.active {
                  background: rgba(42, 148, 255, 1);
                  color: #fff;
                  border-color: rgba(42, 148, 255, 1);
                }
              }
            }
          }
          .search-pagination {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            margin-top: 50px;
            .search-box {
              width: 300px;
              .el-form-item {
                margin-bottom: 0;
              }
              .el-input {
                height: 36px;
                background: rgba(255, 255, 255, 1);
                border-radius: 20px;
                >>> input {
                  border-radius: 20px;
                }

                >>> .el-input__suffix {
                  right: 10px;
                  .el-input__inner {
                    padding-right: 40px;
                  }
                  .el-icon-search {
                    &:before {
                      font-size: 19px;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .table-container {
        background-color: #fff;
        width: 100%;
        min-width: 766px;
        padding: 0 25px;
        border-radius: 12px;
        >>> .el-table {
          &::before {
            height: 0;
          }
          thead {
            th {
              > .cell {
                font-size: 18px;
                padding: 0;
                font-weight: 600;
                color: rgba(80, 90, 100, 1);
              }
            }
          }
          tbody {
            tr {
              height: 100px;
              td {
                .text {
                  display: flex;
                  height: 68px;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: space-between;
                  .apply {
                    display: flex;
                    align-items: center;
                    span {
                      margin-right: 10px;
                      font-size: 14px;
                      color: #fff;
                      width: 50px;
                      height: 20px;
                      background: linear-gradient(
                        134deg,
                        rgba(209, 209, 209, 1) 0%,
                        rgba(171, 171, 171, 1) 100%
                      );
                      border-radius: 25px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }
                  }
                }

                &:first-child {
                  > .cell {
                    justify-content: flex-start;
                  }
                }
                &:last-child {
                  > .cell {
                    height: 80px;
                    .el-image {
                      background: #f7f7f7;
                      border-radius: 8px;
                      margin-right: 10px;
                      cursor: pointer;
                    }
                  }
                }
                > .cell {
                  font-size: 16px;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  > span {
                    display: flex;
                    align-items: center;
                    // i {
                    //   flex: 1;
                    //   font-style: normal;
                    //   overflow: hidden;
                    //   white-space: nowrap;
                    //   text-overflow: ellipsis;
                    // }
                  }
                  .svg-icon {
                    width: 68px;
                    height: 69px;
                    margin-right: 20px;
                  }
                  .el-image {
                    background: #f7f7f7;
                    border-radius: 8px;
                    margin-right: 10px;
                    cursor: pointer;
                    width: 68px;
                    height: 68px;
                    img {
                    }
                  }
                }
                .el-button {
                  font-size: 14px;
                  height: 28px;
                }
                .el-switch {
                  height: 28px;
                  &.is-checked {
                    /deep/ .el-switch__core {
                      height: 100%;
                      border-radius: 20px;
                      &::after {
                        height: 24px;
                        width: 24px;
                        margin-left: -24px;
                      }
                    }
                  }
                  /deep/ .el-switch__core {
                    height: 100%;
                    border-radius: 20px;
                    &::after {
                      height: 24px;
                      width: 24px;
                      margin-left: 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
