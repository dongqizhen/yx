<template>
  <div class="evaluation-list main-view">
    <div class="table-container">
      <div class="content">
        <el-table
          :data="list"
          style="width: 100%"
          v-loading="listLoading"
          :show-header="false"
          @row-click="clickHandle"
        >
          <el-table-column label="评测名称" align="left" min-width="5">
            <template slot-scope="scope">
              <div>
                {{ scope.row.schoolEvaluationTitle }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" align="center" min-width="3">
            <template slot-scope="scope">
              <span>
                {{ scope.row.submitTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
              </span>
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
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import { getStuEvaluationList } from "@/api/student";
  export default {
    name: "EvaluationList",
    components: { Pagination },
    data() {
      return {
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          pageNumber: 1,
          pageSize: 10,
          studentId: this.$route.params.sid
        }
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      clickHandle(row, column, event) {
        this.$router.push({
          name: "EvaluationInformation",
          params: { id: row.schoolEvaluationId }
        });
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
  .table-container {
    padding: 1px 35px;
    border-radius: 16px;
    background-color: #fff;
    .el-table {
      &:before {
        display: none;
      }
      >>> tr {
        height: 120px;
        &:last-child {
          td {
            border-bottom: none;
          }
        }
        span {
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(168, 176, 185, 1);
          line-height: 20px;
        }
      }
    }
  }
</style>
