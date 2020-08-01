<template>
  <div class="classes main-view">
    <div class="filter">
      <h2>信息筛选</h2>
      <el-form v-model="listQuery" :inline="true">
        <el-form-item>
          <el-input
            v-model="listQuery.keyWord"
            placeholder="请输入班级名称"
            @change="getList"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.status"
            placeholder="请选择状态"
            @blur="blur"
            ref="select"
            @change="getList"
            @visible-change="visibleChange"
          >
            <el-option label="全部" value="" />
            <el-option label="未开始" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="已结束" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="tab">
        <!-- nav  -->
        <ul class="nav" style="marginBottom:20px">
          <li
            v-for="(item, index) in tab"
            :key="item.id"
            :class="{ active: index === tabIndex }"
            @click="tab_handler_click(item, index)"
          >
            {{ item.professionName }}
          </li>
        </ul>
        <div class="classes-container">
          <span @click="add">添&nbsp;&nbsp;加</span>
          <div v-loading="loading">
            <div v-if="classesList.length">
              <ul class="classes-wrapper">
                <li v-for="(item, i) in classesList" :key="item.id">
                  <div class="left">
                    <h3>
                      <span>{{ item.professionName }}</span>
                      {{ item.classesName }}
                    </h3>
                    <span class="teacher">
                      班主任：{{ item.teacherInChargeName }}
                    </span>
                    <div class="time">
                      {{
                        item.classesStartTime | parseTime("{y}-{m}-{d} {h}:{i}")
                      }}
                      <span>至</span>
                      {{
                        item.classesEndTime | parseTime("{y}-{m}-{d} {h}:{i}")
                      }}
                    </div>
                    <span class="status">
                      <span>{{
                        !item.status
                          ? "未开始"
                          : item.status == 1
                          ? "进行中"
                          : "已结束"
                      }}</span>

                      <svg-icon
                        :icon-class="
                          !item.status
                            ? 'start'
                            : item.status == 1
                            ? 'ongoing'
                            : 'end'
                        "
                      />
                    </span>
                  </div>
                  <div class="center">
                    <!-- 课程表 -->
                    <router-link
                      :to="{
                        name: 'TimeTable',
                        params: { classesId: item.id }
                      }"
                    >
                      <span>{{
                        item.currentCourseFinishedTotal +
                          "/" +
                          item.currentCourseTotal
                      }}</span>
                    </router-link>
                    <!-- 教师管理 -->
                    <router-link
                      :to="{ name: 'Teachers', params: { classesId: item.id } }"
                      ><span>{{ item.currentTeacherTotal }}</span></router-link
                    >
                    <!-- 学生管理 -->
                    <router-link
                      :to="{ name: 'Students', params: { classesId: item.id } }"
                      ><span>{{ item.currentStudentTotal }}</span></router-link
                    >
                  </div>
                  <div class="right">
                    <div class="operation-wrapper">
                      <span @click="add(item)">编&nbsp;&nbsp;辑</span>
                      <span @click="deleteClasses(item)">删&nbsp;&nbsp;除</span>
                    </div>
                    <!-- <el-switch
                      v-model="item.showFlag"
                      :width="67"
                      active-color="rgba(22,139,255,1)"
                      active-text="展示"
                      inactive-text="关闭"
                      inactive-color="rgba(213,213,213,1)"
                      @change="switchChange(item)"
                    /> -->
                  </div>
                </li>
              </ul>
              <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="listQuery.pageNumber"
                :limit.sync="listQuery.pageSize"
                @pagination="getList"
              />
            </div>
            <no-data v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    fetchClasses_List,
    changeClasses_status,
    delete_classes,
    fetchProfession_List
  } from "@/api/classes";
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
  export default {
    name: "Classes",
    components: { Pagination },
    data() {
      return {
        loading: false,
        total: 0,
        switchVal: true,
        tab: [{ professionName: "全部专业", id: "" }],
        tabIndex: 0, // tab active index
        classesList: [], // 班级列表
        listQuery: {
          pageNumber: 1,
          pageSize: 10,
          professionId: "",
          status: null,
          keyWord: ""
        }
      };
    },
    created() {
      fetchProfession_List().then(res => {
        console.log(res);
        if (res) {
          const { list } = res.data.data;
          this.tab = [...this.tab, ...list];
        }
      });
      this.getList();
    },
    methods: {
      tab_handler_click(item, index) {
        this.tabIndex = index;
        this.listQuery.professionId = item.id;
        this.getList();
      },
      switchChange({ id, showFlag }, flag) {
        // console.log(item, flag);
        changeClasses_status({ id, showFlag });
      },
      visibleChange(v) {
        if (!v) {
          this.$refs.select.blur();
        }
      },
      deleteClasses({ id }) {
        this.$confirm("此操作将永久删除此条数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delete_classes({ id }).then(res => {
              if (res) {
                // 每删除一条数据 ，计算当前页是否有数据，没有则返回第一页
                if ((this.total - 1) % this.listQuery.pageSize == 0) {
                  this.listQuery.pageNumber = 1;
                }

                this.getList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
          })
          .catch(() => {});
      },
      add({ id }) {
        this.$router.push({
          path: "/classes/add-classes",
          query: {
            id
          }
        });
      },
      blur() {
        // console.log(22);
      },
      async getList() {
        this.loading = true;
        await fetchClasses_List(this.listQuery)
          .then(res => {
            const { list, amount } = res.data.data;
            this.classesList = list;
            this.total = amount;
          })
          .then(() => {
            setTimeout(() => {
              this.loading = false;
            }, 100);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .classes {
    .filter {
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
        margin-bottom: 25px;
      }
      .el-form-item {
        width: 300px;
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
            width: 100%;
          }
        }
      }
      .tab {
        > ul.nav {
          display: flex;
          padding: 0;
          flex-wrap: wrap;
          margin-bottom: 8px !important;
          li {
            width: 140px;
            height: 36px;
            margin-right: 12px;
            margin-bottom: 12px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(80, 90, 100, 1);
            border: 1px solid rgba(211, 211, 211, 1);
            transition: background 0.5s;
            &.active {
              background: rgba(42, 148, 255, 1);
              border: 1px solid rgba(42, 148, 255, 1);
              color: rgba(255, 255, 255, 1);
            }
          }
        }
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
          > div {
            width: 100%;
          }
          .classes-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            > li {
              height: 160px;
              display: flex;
              background: rgba(255, 255, 255, 1);
              box-shadow: $boxShadow;
              border-radius: 12px;
              padding: 0 28px;
              justify-content: space-between;
              margin-bottom: 23px;
              > .left {
                padding-top: 70px;
                position: relative;
                width: auto;
                // margin-right: 10px;
                > h3 {
                  display: flex;
                  font-size: 16px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(80, 90, 100, 1);
                  align-items: center;
                  > span {
                    min-width: 80px;
                    height: 20px;
                    padding: 0 10px;
                    display: flex;
                    margin-right: 6px;
                    background: linear-gradient(
                      135deg,
                      rgba(220, 156, 255, 1) 0%,
                      rgba(185, 85, 255, 1) 100%
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                  }
                }
                .teacher {
                  display: flex;
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(168, 176, 185, 1);
                  line-height: 20px;
                  margin-top: 10px;
                  margin-bottom: 5px;
                }
                .time {
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(168, 176, 185, 1);
                  line-height: 20px;
                  > span {
                    margin: 0 17px;
                  }
                }
                .status {
                  display: flex;
                  position: absolute;
                  top: -7px;
                  > span {
                    position: absolute;
                    font-size: 12px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 1);
                    left: 9px;
                    top: 16px;
                    line-height: 17px;
                  }
                  .svg-icon {
                    height: 56px;
                    width: 60px;
                  }
                }
              }
              .center {
                flex: 1;
                max-width: 630px;
                //min-width: 600px;
                display: flex;
                margin-right: 10px;
                justify-content: center;
                // justify-content: space-around;
                > a {
                  display: flex;
                  flex: 1;
                  margin-left: 10px;
                  max-width: 200px;
                  opacity: 1;
                  justify-content: flex-end;
                  align-items: center;
                  transition: opacity 0.3s;
                  background: url("../../assets/images/timetable.png") no-repeat
                    center;
                  background-size: 100% auto;
                  &:nth-child(2) {
                    background: url("../../assets/images/teach.png") no-repeat
                      center;
                    background-size: 100% auto;
                  }
                  &:nth-child(3) {
                    background: url("../../assets/images/stu.png") no-repeat
                      center;
                    background-size: 100% auto;
                  }
                  &:hover {
                    opacity: 0.8;
                  }
                  > span {
                    font-size: 24px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 1);
                    line-height: 33px;
                    margin-right: 15px;
                    margin-top: 15px;
                  }
                }
              }
              .right {
                display: flex;
                align-items: center;
                .operation-wrapper {
                  display: flex;
                  margin-right: 2em;
                  > span {
                    display: flex;
                    width: 100px;
                    height: 28px;
                    background: linear-gradient(
                      130deg,
                      rgba(90, 176, 255, 1) 0%,
                      rgba(0, 132, 255, 1) 100%
                    );
                    box-shadow: 0px 4px 10px 0px rgba(94, 195, 255, 0.71);
                    border-radius: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    cursor: pointer;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    justify-content: center;
                    align-items: center;
                    &:hover {
                      &:first-child {
                        background: linear-gradient(
                          130deg,
                          rgba(131, 196, 255, 1) 0%,
                          rgba(73, 168, 255, 1) 100%
                        );
                      }
                      &:last-child {
                        background: rgba(252, 147, 147, 1);
                      }
                    }
                    &:active {
                      &:first-child {
                        background: linear-gradient(
                          130deg,
                          rgba(28, 147, 255, 1) 0%,
                          rgba(0, 122, 234, 1) 100%
                        );
                      }
                      &:last-child {
                        background: rgba(206, 45, 45, 1);
                      }
                    }
                    &:last-child {
                      background: rgba(250, 110, 110, 1);
                      box-shadow: 0px 6px 10px 0px rgba(255, 163, 163, 0.5);
                      margin-left: 2em;
                    }
                  }
                }
                .el-switch {
                  height: 28px;
                  &.is-checked >>> .el-switch__core {
                    height: 100%;
                    border-radius: 20px;
                    &::after {
                      height: 24px;
                      width: 24px;
                      margin-left: -25px;
                    }
                  }
                  >>> .el-switch__label {
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    > span {
                      font-size: 12px !important;
                      color: rgba(168, 176, 185, 1);
                      &:not([aria-hidden="true"]) {
                        color: rgba(22, 139, 255, 1);
                      }
                    }
                    &:not(.is-active) {
                      // display: none;
                    }
                  }
                  >>> .el-switch__core {
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
</style>
