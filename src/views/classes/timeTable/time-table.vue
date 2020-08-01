<template>
  <div class="time-table main-view">
    <div v-if="classesInfo" class="base-information">
      <h2>班级基本信息</h2>
      <div class="information-title">
        <h3>
          <span>{{ classesInfo.professionName }}</span
          >{{ classesInfo.classesName }}
        </h3>
        <div>
          <div class="time">
            {{
              classesInfo.classesStartTime | parseTime("{y}-{m}-{d} {h}:{i}")
            }}
            <span>至</span>
            {{ classesInfo.classesEndTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </div>
          <span>班主任：{{ classesInfo.teacherInChargeName }}</span>
          <span>学生数量：{{ classesInfo.studentTotal }}</span>
        </div>
      </div>
    </div>
    <el-form
      :inline="true"
      :model="form"
      label-position="left"
      label-width="100px"
    >
      <!-- TODO 待验证-->
      <el-form-item class="letter_space" label="查  找">
        <el-input
          v-model="form.name"
          @change="search"
          placeholder="教师/课程"
        />
      </el-form-item>
    </el-form>
    <div class="tab">
      <span>显示方式</span>
      <ul class="nav">
        <li
          v-for="(item, index) in tab"
          :key="index"
          :class="{ active: index === tabIndex }"
          @click="tab_handler_click(index)"
          v-html="item"
        />
      </ul>
    </div>
    <time-table-vue
      ref="timeTable"
      :table-data="item || []"
      v-for="(item, i) in tableData"
      :profession="profession"
      :key="i"
      :index="i"
      :refresh="getClassesTimeTable"
      :type="temporalType"
      :rank-value="rankValue"
      @next="next"
      @pre="pre"
    />
  </div>
</template>

<script>
  import TimeTableVue from "@/components/TimeTable";

  import { fetchClasses_timeTable, fetchClasses_details } from "@/api/classes";

  export default {
    name: "TimeTable",
    components: { TimeTableVue },
    data() {
      return {
        form: {
          name: ""
        },
        rankValue: 0,
        temporalType: 1, // 周1，月2，全部0
        tab: ["周", "月", "全&nbsp;&nbsp;部"],
        tabIndex: 0, // tab active index
        tableData: [],
        classesInfo: "",
        profession: {}
      };
    },
    created() {
      this.getClassesBaseInfo();
      this.getClassesTimeTable();
    },
    methods: {
      tab_handler_click(index) {
        this.tabIndex = index;
        this.rankValue = 0;
        if (index == 1) {
          // 月
          this.temporalType = 2;
        } else if (index == 0) {
          // 周
          this.temporalType = 1;
        } else {
          // 全部
          this.temporalType = 0;
        }

        this.getClassesTimeTable();
      },
      async getClassesTimeTable(rankValue = this.rankValue) {
        const { classesId } = this.$route.params;
        await fetchClasses_timeTable({
          classesId,
          rankValue,
          temporalType: this.temporalType
        }).then(res => {
          if (res) {
            this.tableData = res.data.data.weekList;
            this.rankValue = res.data.data.rankValue;
          }
        });
      },
      pre(rankValue) {
        this.getClassesTimeTable(rankValue);
      },
      search() {
        _.map(this.$refs.timeTable, (o, i) => {
          let dom = o.$el.querySelectorAll(".search-content");
          _.map(dom, v => {
            if (
              _.includes(v.innerText, this.form.name.trim()) &&
              this.form.name.trim() != ""
            ) {
              //console.log(v.parentNode);
              v.parentNode.classList.add("active");
            } else {
              v.parentNode.classList.remove("active");
            }
          });
        });
      },
      next(rankValue) {
        // console.log(rankValue);
        this.getClassesTimeTable(rankValue);
      },

      async getClassesBaseInfo() {
        const { classesId } = this.$route.params;
        await fetchClasses_details({ id: classesId }).then(res => {
          if (res) {
            console.log(res);
            this.classesInfo = res.data.data;
            // this.professionId = res.data.data.professionId;
            this.profession = {
              professionId: res.data.data.professionId,
              professionName: res.data.data.professionName
            };
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .base-information {
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
    .information-title {
      height: 80px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 12px 0px rgba(202, 202, 202, 0.5);
      border-radius: 12px;
      width: 700px;
      padding: 16px;
      margin-bottom: 20px;
      > h3 {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(80, 90, 100, 1);
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        span {
          display: flex;
          min-width: 80px;
          padding: 10px;
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
      > div {
        display: flex;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(168, 176, 185, 1);
        line-height: 20px;
        .time {
          > span {
            margin: 0 17px;
          }
        }
        > span {
          &:nth-child(2) {
            margin: 0 65px;
          }
        }
      }
    }
  }
  .el-form {
    margin-bottom: 25px;
    margin: 30px 0;
  }
  .el-form-item {
    // width: 300px;
    margin-bottom: 0;
    display: flex;
    >>> .el-form-item__label {
      &::before {
        display: none;
      }
    }
    >>> .el-form-item__content {
      width: 300px;
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
    display: flex;
    > span {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(80, 90, 100, 1);
      width: 100px;
      display: flex;
      align-items: center;
      //justify-items: center;
    }
    > ul.nav {
      display: flex;
      padding: 0;
      li {
        width: 140px;
        height: 36px;
        margin-right: 12px;
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
  }
</style>
