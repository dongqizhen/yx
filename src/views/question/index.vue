<template>
  <div class="art-source-question main-view">
    <div class="question-container">
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
        <span @click="add">添加题目</span>
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
                    v-model="listParams.keyWord"
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
              <el-table-column label="题干" align="left" min-width="3">
                <template slot-scope="scope">
                  <div class="question-title">
                    {{ scope.$index + 1 }}.{{ scope.row.stem }}
                  </div>
                  <div class="select-question" v-if="scope.row.type == 1">
                    <ul>
                      <li
                        v-for="(item, index) in scope.row.optionList"
                        :key="index"
                      >
                        {{ String.fromCharCode(65 + index) }}.{{ item.item }}
                      </li>
                    </ul>
                  </div>
                  <div class="judge-question" v-else>
                    <div>
                      <ul>
                        <li>
                          <el-radio-group>
                            <el-radio label="1">正确</el-radio>
                            <el-radio label="2">错误</el-radio>
                          </el-radio-group>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="answer-Apply">
                    <div class="answer">
                      正确答案：{{
                        scope.row.type == 1
                          ? scope.row.answer == 0
                            ? "A"
                            : scope.row.answer == 1
                            ? "B"
                            : scope.row.answer == 2
                            ? "C"
                            : scope.row.answer == 3
                            ? "D"
                            : scope.row.answer == 4
                            ? "E"
                            : "F"
                          : scope.row.answer == 1
                          ? "错误"
                          : "正确"
                      }}
                    </div>
                    <div class="apply">
                      <span
                        v-for="item in scope.row.sceneLabels"
                        :key="item.code"
                      >
                        {{ item.name }}
                      </span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="状态" align="center" min-width="1">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.freeze"
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
                    @click="lookAnswer(scope.$index, scope.row)"
                  >
                    解 析
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
            <el-dialog
              title="答案解析"
              :visible.sync="dialogFormVisible"
              custom-class="add_or_edit_profession"
            >
              <el-input type="textarea" v-model="analysis" disabled></el-input>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import Menu from "@/components/Menu";
  import { getList } from "@/api/artResources/profession";
  import { getSubjectList } from "@/api/artResources/subject";
  import { getChapterList } from "@/api/artResources/chapter";
  import {
    getQuestionList,
    questionFreeze,
    deleteQuestion
  } from "@/api/artResources/question";
  export default {
    name: "QuestionManage",
    components: { Pagination, Menu },
    data() {
      return {
        dialogFormVisible: false,
        professionList: [],
        professionId: "",
        subjectList: [],
        subjectId: "",
        catalogList: [],
        catalogId: "",
        resourceType: 0,
        sceneLabel: 0,
        resourceTypeList: [
          { id: 0, name: "全部" },
          { id: 1, name: "选择题" },
          { id: 2, name: "判断题" }
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
        analysis: "",
        total: 0,
        listParams: {
          pageNumber: 1,
          pageSize: 10,
          sceneLabel: 0,
          catalogId: 0, //目录Id
          keyWord: null, //题干查询关键字
          freezeFlag: null, //冻结状态 0正常 1冻结
          type: null, //试题类型 1选择题 2判断题
          createTimeSort: 1 //传1是倒序（最新的在最上面），不传是正序
        }
      };
    },
    beforeRouteEnter(to, from, next) {
      if (from.name == "AddQuestion") {
        to.meta.fromAdd = true;
      } else {
        to.meta.fromAdd = false;
      }
      next();
    },
    created() {
      getList({}).then(res => {
        console.log("专业列表::：", res);
        this.professionList = res.data.data.list;
        this.professionId = this.professionList[0].id;
        this.listParams.professionId = this.professionId;
        this.reqSubjectList(this.professionId);
      });
    },
    methods: {
      handleSubmit() {
        this.listParams.pageNumber = 1;
        this.getResourceList();
      },
      switchChange(index, row) {
        questionFreeze({ id: row.id, freeze: row.freeze }).then(res => {});
      },
      getResourceList() {
        this.listLoading = true;
        getQuestionList(this.listParams).then(res => {
          this.list = res.data.data.list;
          this.total = res.data.data.amount;
          this.listLoading = false;
        });
      },
      handleClickType(item) {
        this.resourceType = item.id;
        this.listParams.type = item.id;
        this.getResourceList();
      },
      handleSceneLabel(item) {
        // console.log(item);
        this.sceneLabel = item.id;
        this.listParams.sceneLabel = item.id;
        this.getResourceList();
      },
      handleSelect(key, keyPath) {
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
          console.log("科目列表::：", res);
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
            this.catalogId = null;
            this.listParams.catalogId = null;
          } else {
            this.listParams.catalogId = null;
          }
          this.getResourceList();
        });
      },
      add() {
        // this.$router.push("/artResources/addQuestion");
        this.$router.push("/artResources/question/addQuestion");
      },
      lookAnswer(index, row) {
        if (row.analysis.trim()) {
          this.dialogFormVisible = true;
          this.analysis = row.analysis;
        } else {
          this.$message.warning("暂无答案解析");
        }
      },
      handleEdit(index, row) {
        this.$router.push({
          path: "/artResources/question/addQuestion",
          query: { id: row.id }
        });
      },
      handleDelete(index, row) {
        this.$confirm("您确定删除此条数据吗?", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "deleteDialog",
          type: "warning"
        })
          .then(() => {
            deleteQuestion({ id: row.id }).then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 2000
              });
              this.getResourceList();
            });
          })
          .catch(() => {
            console.log(res);
            this.$message({
              type: "info",
              message: "删除不成功",
              duration: 2000
            });
          });
      },
      renderContent(h, { node, data, store }) {
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
  .art-source-question {
    .question-container {
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
              &:last-child {
                td {
                  border-bottom: none;
                }
              }
              td {
                &:last-child {
                  > .cell {
                    display: flex;
                    //align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    //height: 60px;
                  }
                }
                > .cell {
                  font-size: 16px;
                  // display: flex;
                  // align-items: center;
                  // justify-content: center;
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
                }
                .question-title {
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 600;
                  color: rgba(75, 75, 75, 1);
                  line-height: 30px;
                  margin-bottom: 20px;
                }
                .select-question {
                  ul {
                    li {
                      margin-bottom: 20px;
                    }
                  }
                }
                .judge-question {
                  ul {
                    li {
                      margin-bottom: 20px;
                      .el-radio-group {
                        display: flex;
                      }
                    }
                  }
                }
                .answer-Apply {
                  display: flex;
                  .apply {
                    display: flex;
                    margin-left: 20px;
                    height: 35px;
                    align-items: center;
                    span {
                      margin-right: 10px;
                      font-size: 14px;
                      color: #fff;
                      width: 50px;
                      height: 20px;

                      line-height: 20px;
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
                .answer {
                  width: 130px;
                  display: flex;
                  justify-content: center;
                  padding: 6px;
                  border-radius: 20px;
                  background-color: #2a94ff;
                  color: #fff;
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
                      margin-left: 0px;
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

  >>> .el-dialog__wrapper {
    .add_or_edit_profession {
      width: 450px;
      height: 300px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(136, 136, 136, 0.5);
      border-radius: 14px;
      .el-dialog__body {
        padding-bottom: 0;
        .el-textarea {
          width: 100%;
          .el-textarea__inner {
            height: 180px;
            outline: none;
            resize: none;
            color: #666;
          }
        }
      }
    }
  }
</style>
