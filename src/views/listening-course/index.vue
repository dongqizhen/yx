<template>
  <div class="listening-course main-view">
    <div class="container">
      <h2>信息筛选</h2>
      <el-form
        :inline="true"
        :model="listQuery"
        @keyup.enter.native="handleSubmit"
      >
        <el-form-item>
          <el-input v-model="listQuery.videoName" placeholder="请输入课程名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            ref="select"
            clearable
            v-model="listQuery.professionId"
            placeholder="全部专业"
            @change="getList"
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in professionList"
              :key="item.id"
              :label="item.professionName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="table">
        <div class="title">
          <h2>试听课程</h2>
          <span @click="add">添&nbsp;&nbsp;加</span>
        </div>
        <div class="table-container">
          <el-table :data="list" style="width: 100%" v-loading="listLoading">
            <el-table-column label="试听课程" align="left" min-width="5">
              <template slot-scope="scope">
                <div>
                  <!-- <img
                    :src="scope.row.coverUrl"
                    @click="lookVideo(scope.row)"
                  /> -->

                  <el-image
                    lazy
                    :src="scope.row.coverUrl"
                    fit="contain"
                    @click="lookVideo(scope.row)"
                  ></el-image>

                  <div class="info">
                    <div class="course" @click="lookVideo(scope.row)">
                      <span>{{ scope.row.professionName }}</span>
                      <span>{{ scope.row.videoName }}</span>
                    </div>
                    <p>讲师：{{ scope.row.teacherName }}</p>
                    <p>{{ scope.row.videoDesc }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="排序" align="center" min-width="1">
              <template slot-scope="scope">
                <span>{{ scope.row.rankValue }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="3">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="edit"
                  round
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  round
                  class="del"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删&nbsp;&nbsp;除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNumber"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
      <video-dialog-vue
        :visible="dialogVideoVisible"
        :sources="videoSources"
        @close="videoClose"
      />
    </div>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import { fetchProfession_List } from "@/api/classes";
  import { getCourseList, deleteCourse } from "@/api/learningCourse";
  import videoDialogVue from "@/views/classes/components/videoDialog";
  export default {
    name: "ListeningCourse",
    components: { Pagination, videoDialogVue },
    data() {
      return {
        professionList: [], //专业列表
        total: 0,
        dialogVideoVisible: false,
        videoSources: {},
        list: [],
        listLoading: false,
        listQuery: {
          pageNumber: 1,
          pageSize: 10,
          videoName: null,
          professionId: null
        }
      };
    },
    created() {
      fetchProfession_List({}).then(res => {
        console.log("专业列表", res);
        this.professionList = res.data.data.list;
      });
      this.getList();
    },
    methods: {
      handleSubmit() {
        this.getList();
      },
      videoClose() {
        this.dialogVideoVisible = false;
      },
      lookVideo(val) {
        console.log(val);
        this.videoSources = {
          src: val.videoUrl,
          title: val.videoName
        };
        this.dialogVideoVisible = true;
      },
      visibleChange(value) {
        if (!value) {
          this.$refs.select.blur();
        }
      },
      add() {
        this.$router.push({ path: "/listening-course/addCourse" });
      },
      handleEdit(index, row) {
        this.$router.push({
          path: "/listening-course/addCourse",
          query: { info: JSON.stringify(row) }
        });
      },
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除此条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteCourse({ id: row.id }).then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      getList() {
        this.listLoading = true;
        getCourseList(this.listQuery).then(response => {
          console.log(response);
          this.list = response.data.data.list;
          this.total = response.data.data.amount;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 100);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .listening-course {
    .container {
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
      .el-form-item {
        &:first-child {
          width: 300px;
        }

        margin-bottom: 0;
        >>> .el-form-item__content {
          width: 100%;
          .el-input {
            > input {
              border-radius: 36px;
            }
          }
          .el-select {
            width: 150px;
          }
        }
      }
      .table {
        .title {
          display: flex;
          justify-content: space-between;
          margin-top: 55px;
          h2 {
            height: 25px;
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(80, 90, 100, 1);
            line-height: 25px;
            margin-top: 20px;
          }
          > span {
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
            //letter-spacing: 9px;
            font-weight: 400;
            cursor: pointer;
            opacity: 1;
            transition: opacity 0.4s;
            color: rgba(255, 255, 255, 1);
            margin-bottom: 24px;
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
        .table-container {
          .el-table {
            border-radius: 16px;
            padding: 2px 30px;
            &:before {
              display: none;
            }
            >>> .el-table__header {
              th {
                .cell {
                  font-size: 18px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(80, 90, 100, 1);
                }
              }
            }
            >>> .el-table__body {
              tr {
                &:last-child {
                  td {
                    border-bottom: none;
                  }
                }
                td {
                  &:first-child {
                    .cell {
                      width: 100%;
                      display: flex;
                      padding: 0;
                      > div {
                        width: 100%;
                        display: flex;
                      }
                      .el-image {
                        width: 117px;
                        height: 117px;
                        margin-right: 12px;
                        border-radius: 6px;
                        cursor: pointer;
                      }
                      .info {
                        width: calc(100% - 162px);
                      }
                      .course {
                        cursor: pointer;
                        span {
                          &:first-child {
                            background: linear-gradient(
                              135deg,
                              rgba(220, 156, 255, 1) 0%,
                              rgba(185, 85, 255, 1) 100%
                            );
                            border-radius: 20px;
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: rgba(255, 255, 255, 1);
                            line-height: 20px;
                            padding: 0 12px;
                            margin-right: 6px;
                          }
                          &:last-child {
                            height: 25px;
                            font-size: 18px;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                            color: rgba(80, 90, 100, 1);
                            line-height: 25px;
                          }
                        }
                      }
                      p {
                        margin: 20px 0 7px;
                        height: 22px;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(168, 176, 185, 1);
                        line-height: 22px;
                        width: 100%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
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
  }
</style>
