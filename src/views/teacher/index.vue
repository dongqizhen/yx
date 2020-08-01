<template>
  <div class="teacher main-view">
    <!-- <div class="base-information">
      <h2>班级基本信息</h2>
      <div class="information-title">
        <h3><span>编导专业</span>2019暑期编导基础班</h3>
      </div>
    </div> -->
    <div class="filter">
      <h2>信息筛选</h2>
      <el-form :inline="true" :model="form" @keyup.enter.native="handleSubmit">
        <el-form-item>
          <el-input v-model="form.teacherName" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.fullTimeFlag"
            ref="select1"
            @change="handleSubmit"
            @visible-change="visibleChange(1, $event)"
            placeholder="类型"
          >
            <el-option label="兼职" value="0" />
            <el-option label="全职" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.deleteFlag"
            ref="select2"
            @change="handleSubmit"
            @visible-change="visibleChange(2, $event)"
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
          <span @click="addTeacher">添&nbsp;&nbsp;加</span>
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
                width="104"
                :class-name="getSortClass('id')"
              >
                <template slot-scope="{ row }">
                  <el-avatar :src="row.teacherPhotoStr" />
                </template>
              </el-table-column>
              <el-table-column label="姓名" width="300" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.teacherName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机" width="200" align="center">
                <template slot-scope="{ row }">
                  <span>
                    {{ row.telephone }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="类型" width="110px" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.fullTimeFlag ? "全职" : "兼职" }}</span>
                </template>
              </el-table-column>

              <el-table-column label="状态" class-name="status-col" width="100">
                <template slot-scope="{ row }">
                  <span :class="row.activateFlag && 'active'">{{
                    row.activateFlag ? "激活" : "未激活"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label=""
                align="center"
                min-width="230"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{ row, $index }">
                  <el-button
                    v-if="row.status != 'deleted'"
                    size="mini"
                    type="primary"
                    round
                    :class="row.deleteFlag == 1 ? 'associated' : 'del'"
                    @click="handleDelete(row, $index)"
                  >
                    {{ row.deleteFlag == 1 ? "重新关联" : "移除" }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    class="edit"
                    round
                    @click="handleUpdate(row)"
                  >
                    编辑
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
  import { fetchTeacher_List, deleteTheacher_list } from "@/api/teacher";

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
    name: "Teacher",
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
        form: {
          teacherName: "",
          fullTimeFlag: "",
          deleteFlag: null
        },
        switchVal: true,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          // 获取教师列表参数
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
        dialogPvVisible: false,
        pvData: [],
        downloadLoading: false
      };
    },
    created() {
      this.getList();
    },
    methods: {
      handleSubmit() {
        this.listQuery = { ...this.listQuery, ...this.form };
        this.getList();
      },
      visibleChange(i, v) {
        if (!v) {
          this.$refs["select" + i].blur();
        }
      },
      getList() {
        this.listLoading = true;
        // 获取教师列表
        fetchTeacher_List(this.listQuery).then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.amount;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 100);
        });
      },
      addTeacher() {
        this.$router.push("/teacher/add-teacher");
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },

      sortChange(data) {
        const { prop, order } = data;
        if (prop === "id") {
          this.sortByID(order);
        }
      },

      handleUpdate(row) {
        this.$router.push({
          path: "/teacher/add-teacher",
          query: { id: row.id }
        });
      },
      handleDelete(row, index) {
        console.log(row);
        if (!row.deleteFlag) {
          this.$confirm("您确定要移除此教师吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteTheacher_list({
                teacherId: row.teacherId,
                deleteFlag: !row.deleteFlag ? 1 : 0
              }).then(res => {
                if (res) {
                  this.$set(this.list, index, {
                    ...row,
                    ...{ deleteFlag: !row.deleteFlag }
                  });
                }
              });
            })
            .catch(() => {});

          return;
        }
        deleteTheacher_list({
          teacherId: row.teacherId,
          deleteFlag: !row.deleteFlag ? 1 : 0
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
  .teacher {
    display: flex;
    .base-information {
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
        height: 80px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 12px 0px rgba(202, 202, 202, 0.5);
        border-radius: 12px;
        min-width: 700px;
        padding: 16px;
        > h3 {
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(80, 90, 100, 1);
          display: flex;
          align-items: center;
          span {
            display: flex;
            width: 80px;
            height: 20px;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              rgba(220, 156, 255, 1) 0%,
              rgba(185, 85, 255, 1) 100%
            );
            margin-right: 6px;
            border-radius: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .information-wrapper {
      }
    }
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
              overflow: visible;
              .el-table__header {
                width: 100% !important;
                table-layout: inherit;
              }
              table {
                padding-top: 12px;
                thead {
                  &::before {
                    content: "";
                    width: 15px;
                    display: flex;
                    height: 36px;
                    position: absolute;
                    background-image: url("../../assets/images/blue.png");
                    background-size: 15px 36px;
                    right: -14px;
                  }
                }
              }
              tr {
                background: transparent;
                background: linear-gradient(
                  135deg,
                  rgba(90, 176, 255, 1) 0%,
                  rgba(0, 132, 255, 1) 100%
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
                }
              }
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
                    &.status-col {
                      .cell {
                        span:not(.active) {
                          font-weight: 400;
                          color: rgba(214, 214, 214, 1);
                        }
                      }
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
                    &:last-child {
                      .cell {
                        height: 50px;
                        display: flex !important;
                        align-items: center;
                        justify-content: flex-end;
                        > .edit {
                          margin-left: 48px;
                          margin-right: 23px;
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
