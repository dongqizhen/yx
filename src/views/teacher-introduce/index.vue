<template>
  <div class="teacher-introduce main-view">
    <div class="container">
      <div class="table">
        <div class="title">
          <h2>师资介绍</h2>
          <span @click="add">添&nbsp;&nbsp;加</span>
        </div>
        <div class="table-container">
          <el-table :data="list" style="width: 100%" v-loading="listLoading">
            <el-table-column label="教师信息" align="left" min-width="5">
              <template slot-scope="scope">
                <!-- <img :src="scope.row.photoUrl" /> -->
                <el-image
                  lazy
                  :src="scope.row.photoUrl"
                  fit="contain"
                ></el-image>
                <div class="info">
                  <p>讲师：{{ scope.row.name }}</p>
                  <ul>
                    <li
                      v-for="item in scope.row.professionDetailList"
                      :key="item.id"
                    >
                      {{ item.professionName }}
                    </li>
                  </ul>
                  <p><span>头衔：</span>{{ scope.row.title }}</p>
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
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.pageNumber"
            :limit.sync="listQuery.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTeacherList, deleteTeacher } from "@/api/teacherIntroduce";
  import Pagination from "@/components/Pagination";
  export default {
    name: "TeacherIntroduce",
    components: { Pagination },
    data() {
      return {
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          pageNumber: 1,
          pageSize: 10
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      add() {
        this.$router.push({ path: "/teacher-introduce/addTeacher" });
      },
      handleEdit(index, row) {
        this.$router.push({
          path: "/teacher-introduce/addTeacher",
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
            deleteTeacher({ id: row.id }).then(res => {
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
        getTeacherList(this.listQuery).then(response => {
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
  .teacher-introduce {
    .container {
      .table {
        .title {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          h2 {
            height: 25px;
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(80, 90, 100, 1);
            line-height: 25px;
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
                      .el-image {
                        width: 117px;
                        height: 117px;
                        margin-right: 12px;
                        border-radius: 6px;
                      }
                      .info {
                        width: calc(100% - 162px);
                        p {
                          font-size: 16px;
                          font-family: PingFangSC-Semibold, PingFang SC;
                          font-weight: 600;
                          color: rgba(80, 90, 100, 1);
                          margin-top: 0;
                          &:last-child {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: rgba(80, 90, 100, 1);
                            line-height: 24px;
                          }
                        }
                        > ul {
                          display: flex;
                          margin-bottom: 18px;
                          li {
                            display: flex;
                            height: 16px;
                            background: rgba(238, 238, 238, 1);
                            border-radius: 8px;
                            justify-content: center;
                            align-items: center;
                            font-size: 10px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: rgba(132, 141, 150, 1);
                            padding: 0 8px;
                            min-width: 40px;
                            margin-right: 6px;
                          }
                        }
                      }
                      .course {
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
                        &:last-child {
                          overflow: hidden;
                          height: auto;
                          line-height: 24px;
                          text-overflow: ellipsis; // text-overflow css3的属性，当文本溢出时，显示省略号
                          display: -webkit-box;
                          -webkit-line-clamp: 2; // 设置两行文字溢出
                          -webkit-box-orient: vertical;
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
  }
</style>
