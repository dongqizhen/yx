<template>
  <div class="student main-view">
    <div class="filter">
      <h2>信息筛选</h2>
      <el-form :inline="true" :model="form" @keyup.enter.native="handleSubmit">
        <el-form-item>
          <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.professionId"
            filterable
            placeholder="全部专业"
            ref="select1"
            clearable
            @change="handleSubmit(1)"
            @visible-change="visibleChange(1, $event)"
          >
            <el-option
              v-for="item in professionList"
              :key="item.id"
              :label="item.professionName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select
            @visible-change="visibleChange(2, $event)"
            v-model="form.classId"
            filterable
            clearable
            @change="handleSubmit"
            ref="select2"
            placeholder="全部班级"
          >
            <el-option
              v-for="item in classesList"
              :key="item.id"
              :label="item.classesName"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-select
            v-model="form.userType"
            placeholder="全部账号"
            clearable
            ref="select3"
            @change="handleSubmit"
            @visible-change="visibleChange(3, $event)"
          >
            <el-option label="全部账号" :value="null" />
            <el-option label="正式用户" value="0" />
            <el-option label="试听用户" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.activateFlag"
            @visible-change="visibleChange(4, $event)"
            ref="select4"
            clearable
            @change="handleSubmit"
            placeholder="全部状态"
          >
            <el-option label="全部状态" :value="null" />
            <el-option label="未激活" value="0" />
            <el-option label="激活" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.deleteFlag"
            @visible-change="visibleChange(5, $event)"
            ref="select5"
            clearable
            @change="handleSubmit"
            placeholder="全部关系"
          >
            <el-option label="全部关系" :value="null" />
            <el-option label="正常" value="0" />
            <el-option label="已移除" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="tab">
        <!-- nav -->
        <div class="classes-container">
          <span @click="add">添&nbsp;&nbsp;加</span>
          <div class="app-container">
            <el-table
              :key="tableKey"
              v-loading="listLoading"
              :data="list"
              fit
              highlight-current-row
              style="width: 100%;"
              @sort-change="sortChange"
            >
              <el-table-column
                label=""
                prop="id"
                :sortable="false"
                align="center"
                width="110"
                :class-name="getSortClass('id')"
              >
                <template slot-scope="{ row }">
                  <el-avatar
                    :src="
                      row.studentPhotoStr ||
                        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                    "
                  />
                </template>
              </el-table-column>
              <el-table-column label="姓名" align="center" width="100">
                <template slot-scope="{ row }">
                  <span>{{ row.studentName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机" width="160" align="center">
                <template slot-scope="{ row }">
                  <span>
                    {{ row.studentPhone }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="班级" width="170" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.className }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="激活状态"
                class-name="status-col"
                width="100"
              >
                <template slot-scope="{ row }">
                  <span :class="row.activateFlag && 'active'">{{
                    row.activateFlag ? "激活" : "未激活"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="关系" class-name="relation" width="120">
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="row.status != 'deleted'"
                    size="mini"
                    type="primary"
                    round
                    :class="row.deleteFlag ? 'associated' : 'del'"
                    @click="handleDelete(row, $index)"
                  >
                    {{ !row.deleteFlag ? "移除" : "重新关联" }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                label=""
                align="center"
                min-width="250"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="primary"
                    size="mini"
                    class="edit"
                    round
                    @click="handleUpdate(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="row.status != 'deleted' && row.classId != null"
                    size="mini"
                    type="primary"
                    round
                    class="report"
                    @click="handleToDetails(row, $index)"
                  >
                    学情报告
                  </el-button>
                  <el-button
                    v-if="row.status != 'deleted'"
                    size="mini"
                    type="primary"
                    round
                    class="purple"
                    @click="handleToEvaluation(row, $index)"
                  >
                    评测信息
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    fetchList,
    fetchPv,
    createArticle,
    updateArticle
  } from "@/api/article";
  import waves from "@/directive/waves"; // waves directive
  import { parseTime } from "@/utils";
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

  import { fetchStudent_List, deleteStudent_list } from "@/api/student";
  import { fetchProfession_List, fetchClasses_List } from "@/api/classes";

  const calendarTypeOptions = [
    { key: "CN", display_name: "China" },
    { key: "US", display_name: "USA" },
    { key: "JP", display_name: "Japan" },
    { key: "EU", display_name: "Eurozone" }
  ];

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name;
    return acc;
  }, {});

  export default {
    name: "Student",
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: "success",
          draft: "info",
          deleted: "danger"
        };
        return statusMap[status];
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type];
      }
    },
    data() {
      return {
        professionList: [], // 专业列表
        classesList: [], // 班级列表
        form: {
          studentName: "",
          professionId: "",
          classId: "",
          userType: "",
          activateFlag: "",
          deleteFlag: ""
        },
        switchVal: true,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [
          { label: "ID Ascending", key: "+id" },
          { label: "ID Descending", key: "-id" }
        ],
        statusOptions: ["published", "draft", "deleted"],
        showReviewer: false,
        pvData: [],
        downloadLoading: false
      };
    },
    created() {
      this.getList();
      fetchProfession_List({})
        .then(res => {
          console.log("获取专业列表：：", res);
          this.professionList = res.data.data.list;
        })
        .then(() => {
          this.getClassesList();
        });
    },
    methods: {
      handleSelect(value) {
        console.log(value);
        this.getClassesList({
          schoolId: "",
          keyWord: "",
          pageSize: "100",
          pageNumber: "1",
          status: "",
          professionId: this.form.professionId
        });
      },
      visibleChange(i, v) {
        if (!v) {
          this.$refs["select" + i].blur();
        }
      },
      handleSubmit(i) {
        if (i == 1) {
          this.handleSelect();
        }
        this.listQuery = { ...this.listQuery, ...this.form };
        console.log(this.listQuery);
        this.getList();
      },
      getList() {
        this.listLoading = true;
        fetchStudent_List(this.listQuery).then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.amount;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 100);
        });
      },
      getClassesList(params) {
        fetchClasses_List(params).then(res => {
          console.log("获取班级列表：：", res);
          this.classesList = res.data.data.list;
          if (this.classesList.length == 0) {
            this.form.classId = "";
          }
        });
      },
      add() {
        this.$router.push("/student/add-student");
      },
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: "操作Success",
          type: "success"
        });
        row.status = status;
      },
      sortChange(data) {
        const { prop, order } = data;
        if (prop === "id") {
          this.sortByID(order);
        }
      },
      handleToDetails(row) {
        console.log(row);
        this.$router.push({
          name: "learnDetails",
          params: { studentId: row.id, classesId: row.classId }
        });
      },
      handleToEvaluation(row) {
        console.log(row);
        this.$router.push({
          path: `/student/evaluation-information/${row.id}/index`
        });
      },
      handleUpdate(row) {
        this.$router.push({
          path: "/student/add-student",
          query: { id: row.id }
        });
      },
      handleDelete(row, index) {
        console.log(row);
        if (!row.deleteFlag) {
          this.$confirm("您确定要移除此学生吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            deleteStudent_list({
              studentId: row.studentId,
              deleteFlag: row.deleteFlag ? 0 : 1
            }).then(res => {
              if (res) {
                this.$set(this.list, index, {
                  ...row,
                  ...{ deleteFlag: !row.deleteFlag }
                });
              }
            });
          });
          return;
        }
        deleteStudent_list({
          studentId: row.studentId,
          deleteFlag: row.deleteFlag ? 0 : 1
        }).then(res => {
          if (res) {
            this.$set(this.list, index, {
              ...row,
              ...{ deleteFlag: !row.deleteFlag }
            });
          }
        });
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData;
          this.dialogPvVisible = true;
        });
      },
      handleDownload() {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = ["timestamp", "title", "type", "importance", "status"];
          const filterVal = [
            "timestamp",
            "title",
            "type",
            "importance",
            "status"
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "table-list"
          });
          this.downloadLoading = false;
        });
      },
      formatJson(filterVal) {
        return this.list.map(v =>
          filterVal.map(j => {
            if (j === "timestamp") {
              return parseTime(v[j]);
            } else {
              return v[j];
            }
          })
        );
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort;
        return sort === `+${key}` ? "ascending" : "descending";
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .student {
    display: flex;

    .filter {
      width: 100%;
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
      .el-form {
        // margin-bottom: 25px;
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
              // border: 1px solid rgba(234, 234, 234, 1);
            }
            // &.is-focus {
            //   .el-input__inner {
            //     border-width: 2px;
            //   }
            // }
          }
          .el-select {
            width: 150px;
          }
        }
      }
      .tab {
        margin-top: 20px;
        .classes-container {
          display: flex;
          //justify-content: flex-end;
          flex-direction: column;
          align-items: flex-end;
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
          .app-container {
            width: 100%;
            padding: 0;
            .el-table {
              border: none;
              background: rgba(255, 255, 255, 1);
              border-radius: 12px;
              // padding: 0px 35px 2px;
              overflow: visible;
              padding-bottom: 2px;
              &::before {
                display: none;
              }
            }
            >>> .el-table__header-wrapper {
              width: 100% !important;
              overflow: visible !important;
              .el-table__header {
                width: 100% !important;
                table-layout: inherit;
              }
              table {
                padding-top: 12px;
                position: relative;
                thead {
                  &::before {
                    content: "";
                    width: 15px;
                    display: flex;
                    height: 36px;
                    position: absolute;
                    background-image: url("../../assets/images/yel.png");
                    background-size: 15px 36px;
                    right: -12px;
                  }
                }
              }
              tr {
                background: transparent;
                background: linear-gradient(
                  135deg,
                  rgba(255, 203, 80, 1) 0%,
                  rgba(255, 169, 68, 1) 100%
                );

                th {
                  border-bottom: 0;
                  background: transparent;
                  padding: 0;
                  .cell {
                    height: 36px;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                  }
                  &:last-child {
                    .cell {
                      // background-position: calc(100% + 10px) 0;
                      // background-repeat: no-repeat;
                    }
                  }
                }
              }
            }
            .el-table {
            }
            >>> .el-table__body-wrapper {
              // padding: 0 35px;
              width: 100% !important;

              .el-table__body {
                width: 100% !important;
                table-layout: inherit;
                .el-table__row {
                  height: 110px;
                  //margin: 0 35px;
                  > td {
                    .cell {
                      font-size: 18px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: rgba(80, 90, 100, 1);
                    }
                    &:first-child {
                      .cell {
                        padding-left: 40px;
                        .el-avatar {
                          height: 60px;
                          width: 60px;
                        }
                      }
                    }
                    &.small-padding {
                      .cell {
                        padding-right: 30px;
                      }
                    }
                    &.status-col {
                      .cell {
                        span:not(.active) {
                          font-weight: 400;
                          color: rgba(214, 214, 214, 1);
                        }
                      }
                    }
                    &.relation {
                      .cell {
                        justify-content: center !important;
                      }
                    }
                    &:last-child,
                    &.relation {
                      .cell {
                        height: 50px;
                        display: flex !important;
                        align-items: center;
                        justify-content: flex-end;
                        > .edit {
                          margin-left: 48px;
                          // margin-right: 23px;
                        }
                      }
                    }
                  }
                  &:last-child {
                    > td {
                      border-bottom: 0;
                    }
                  }
                }
              }
              > table {
                //width: 100% !important;
              }
            }
            >>> .el-dialog__wrapper {
              .add_or_edit_teacher_info {
                .el-dialog__body {
                  width: 100%;
                  .el-form {
                    .el-form-item {
                      width: 100%;
                      margin-bottom: 40px;
                      display: flex;
                      align-items: center;
                      position: relative;
                      &:not(.is-required) {
                        .el-form-item__label {
                          &::before {
                            display: none;
                          }
                        }
                      }
                      .el-form-item__label {
                        font-size: 18px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: rgba(80, 90, 100, 1);
                        &::before {
                          content: "";
                          width: 6px;
                          height: 6px;
                          position: absolute;
                          left: 70px;
                          top: 8px;
                          background: rgba(255, 112, 112, 1);
                          // display: block;
                          border-radius: 6px;
                        }
                      }
                      .el-form-item__content {
                        display: flex;
                        align-items: center;
                        margin-left: 0 !important;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        .el-input {
                          width: 300px;
                        }
                        .el-radio-group {
                          display: flex;
                        }
                        .el-radio {
                          display: flex;
                          align-items: center;
                          .el-radio__input {
                            height: 30px;
                            width: 30px;
                            border: 1px solid rgba(234, 234, 234, 1);
                            border-radius: 30px;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            &:not(.is-checked) {
                              .el-radio__inner {
                                display: none;
                              }
                            }
                            .el-radio__inner {
                              width: 18px;
                              height: 18px;
                              border-radius: 18px;
                              background: linear-gradient(
                                135deg,
                                rgba(81, 195, 255, 1) 0%,
                                rgba(42, 148, 255, 1) 100%
                              );
                              box-shadow: 0px 0px 4px 0px rgba(94, 181, 255, 0.5);
                              &::after {
                                display: none;
                              }
                            }
                          }
                          &.is-checked {
                            .el-radio__label {
                              color: #1890ff;
                            }
                          }
                          .el-radio__label {
                            font-size: 20px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: rgba(80, 90, 100, 1);
                          }
                        }
                        .el-form-item__error {
                          position: static;
                          padding-top: 0;
                          margin-left: 12px;
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
