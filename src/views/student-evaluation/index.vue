<template>
  <div class="student-evaluation main-view">
    <div class="teacher">
      <h2>测评教师设置</h2>
      <div class="selectTeacher">
        <h4>
          参与考核教师才收到学员提交的评审内容，及给学员进行评测结果的反馈！
        </h4>
        <div class="teacherList">
          <ul>
            <li v-for="item in checkedTeacherShowList" :key="item.id">
              <div>
                <img :src="item.teacherPhotoStr" />
                <span>{{ item.teacherName }}</span>
              </div>
              <span @click="deleteCheckedTeacher(item)">
                <svg-icon icon-class="deleteTeacher"></svg-icon>
              </span>
            </li>
          </ul>
          <div class="addBtn">
            <span @click="addTeacher">添加考核教师</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tab">
      <h2>评测列表</h2>
      <el-button
        class="release"
        type="primary"
        @click="$router.push({ path: '/student-evaluation/releaseEvaluation' })"
      >
        发布评测
      </el-button>
    </div>
    <div class="tableContainer">
      <el-table :data="list" style="width: 100%" v-loading="listLoading">
        <el-table-column label="评测名称" align="left" min-width="5">
          <template slot-scope="scope">
            <div>
              {{ scope.row.testTitle }}
            </div>
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
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNumber"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogVisible" title="添加老师" lock-scroll>
      <el-checkbox-group v-model="checkedTeacherList">
        <el-checkbox
          v-for="item in teacherList"
          :key="item.id"
          :label="item.id"
        >
          <img :src="item.teacherPhotoStr" />
          <span>{{ item.teacherName }}</span>
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="custom_submit_button" @click="sure">
          确&nbsp;&nbsp;定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import { fetchTeacher_ListByStatus } from "@/api/teacher";
  import {
    getStuEvaluationTeachers,
    updateStuEvaluationTeachers,
    getStuEvaluationList,
    deleteEvaluation
  } from "@/api/stuEvaluation";

  export default {
    components: { Pagination },
    data() {
      return {
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          pageNumber: 1,
          pageSize: 10
        },
        teacherIds: [],
        teacherList: [],
        checkedTeacherList: [],
        dialogVisible: false
      };
    },
    mounted() {
      fetchTeacher_ListByStatus()
        .then(res => {
          this.teacherList = res.data.data;
        })
        .then(() => {
          this.getStuEvaluationTeacherList();
        });
      this.getList();
    },
    computed: {
      checkedTeacherShowList() {
        return this.teacherIds.map(o => {
          return this.teacherList.filter(item => {
            if (item.id == o) {
              return item;
            }
          })[0];
        });
      }
    },
    methods: {
      sure() {
        this.dialogVisible = false;
        this.teacherIds = this.checkedTeacherList;
        this.updateStuEvaluationTeacherList();
      },
      addTeacher() {
        this.dialogVisible = true;
        this.checkedTeacherList = this.teacherIds;
      },
      deleteCheckedTeacher(item) {
        this.teacherIds = this.teacherIds.filter(o => o != item.id);
        this.updateStuEvaluationTeacherList();
      },
      handleEdit(index, row) {
        this.$router.push({
          path: "/student-evaluation/releaseEvaluation",
          query: { id: row.schoolEvaluationId }
        });
      },
      handleDelete(index, row) {
        this.$confirm("此操作将删除该评测, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteEvaluation({ id: row.schoolEvaluationId }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          });
        });
      },
      async getStuEvaluationTeacherList() {
        await getStuEvaluationTeachers().then(res => {
          this.teacherIds = res.data.data.map(item => item.id);
        });
      },
      async updateStuEvaluationTeacherList() {
        await updateStuEvaluationTeachers({
          teacherIds: this.teacherIds
        }).then(res => {});
      },
      async getList() {
        this.listLoading = true;
        await getStuEvaluationList(this.listQuery).then(response => {
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
  .student-evaluation {
    h2 {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(80, 90, 100, 1);
      line-height: 25px;
      margin-bottom: 18px;
    }
    .teacher {
      margin-bottom: 25px;
      .selectTeacher {
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        padding: 18px;
        h4 {
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(80, 90, 100, 1);
          line-height: 20px;
          margin-bottom: 10px;
        }
        ul {
          display: flex;
          li {
            width: 170px;
            height: 54px;
            background: rgba(255, 255, 255, 1);
            border-radius: 27px;
            border: 1px solid rgba(238, 238, 238, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px;
            margin-right: 22px;
            > div {
              display: flex;
              align-items: center;
              img {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                margin-right: 8px;
              }
              span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(80, 90, 100, 1);
                line-height: 20px;
              }
            }

            > span {
              cursor: pointer;
              // padding: 0 6px;
              display: flex;
              justify-content: center;

              align-items: center;
              height: 16px;
              width: 16px;
              border-radius: 8px;
              .svg-icon {
                width: 10px;
                height: 10px;
              }
              &:hover {
                background: #f0f0f0;
              }
            }
          }
        }
        .addBtn {
          display: flex;
          justify-content: flex-end;
          span {
            width: 140px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              rgba(81, 195, 255, 1) 0%,
              rgba(42, 148, 255, 1) 100%
            );
            box-shadow: 0px 6px 10px 0px rgba(94, 181, 255, 0.5);
            border-radius: 20px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            cursor: pointer;
          }
        }
      }
    }
    .tab {
      display: flex;
      justify-content: space-between;
      .release {
        height: 30px;
        background: linear-gradient(
          135deg,
          rgba(81, 195, 255, 1) 0%,
          rgba(42, 148, 255, 1) 100%
        );
        box-shadow: 0px 6px 10px 0px rgba(94, 181, 255, 0.5);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 6px;
      }
    }
    .tableContainer {
      padding: 1px 35px;
      border-radius: 16px;
      background-color: #fff;
      .el-table {
        >>> thead {
          tr {
            height: 56px;
          }
        }
        >>> tr {
          height: 120px;
          &:last-child {
            td {
              border-bottom: none;
            }
          }
          td {
            &:last-child {
              .cell {
                height: 46px;
                line-height: 46px;
              }
            }
          }
        }
      }
    }
    .el-dialog__wrapper {
      >>> .el-dialog__body {
        .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          margin-right: -100px;
          .el-checkbox {
            display: flex;
            align-items: center;
            position: relative;
            margin-bottom: 30px;
            width: 136px;
            margin-right: 100px;
            .el-checkbox__input {
              // position: absolute;
              // right: -16px;
              .el-checkbox__inner {
                width: 16px;
                height: 16px;
                border-radius: 8px;
              }
              &.is-checked {
                .el-checkbox__inner {
                  background-color: #fff;
                  &::after {
                    width: 10px;
                    height: 10px;
                    background-color: #1890ff;
                    border-radius: 5px;
                    position: absolute;
                    transform: rotate(0deg) scale(1);
                    top: 2px;
                    left: 2px;
                    border: none;
                    transition: transform 0s ease-in 0s,
                      -webkit-transform 0s ease-in 0s;
                  }
                }
              }
            }
            .el-checkbox__label {
              display: flex;
              align-items: center;
              img {
                width: 46px;
                height: 46px;
                margin-right: 8px;
                border-radius: 23px;
              }
              span {
                margin-right: 16px;
              }
            }
          }
        }
      }
      >>> .el-dialog__footer {
        .dialog-footer {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>




