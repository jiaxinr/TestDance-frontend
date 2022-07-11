<template>
  <div>
    <navigation-bar></navigation-bar>
    <div>
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.$store.state.role==='HIRER'" :to="{ path:`/manageH-side1` }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ path:`/manageP-side1` }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.$store.state.role==='HIRER'" :to="{ path:`/manageDetailH-side1/${this.tid}`}">任务管理详情</el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ path:`/manageDetailP-side1/${this.tid}`}">任务管理详情</el-breadcrumb-item>
        <el-breadcrumb-item>相似报告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button round @click="gotoRelease" style="float: right;margin: 8px;">
      <i class="el-icon-circle-plus" id="changeTask">提交报告</i>
    </el-button>
    <div style="margin-top: 10px;margin-bottom: 10px">
      报告筛选：
      <el-radio-group v-model="stateRadio" size="small" @change="stateChange">
        <el-radio-button v-for="state in reportStates" :label="state.value" :key="state.value">{{state.text}}</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
        ref="filterTable"
        @row-click="gotoReport"
        :data="tableData.slice(pageCurrent * pageSize, (pageCurrent+1) * pageSize)"
        style="width: 100%;padding: 3px">
      <el-table-column
          prop="date"
          label="提交时间"
          sortable
          width="180"
          column-key="date">
      </el-table-column>
      <el-table-column
          prop="tid"
          label="编号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="280">
      </el-table-column>
      <el-table-column
          prop="status"
          label="审核状态"
          width="100">
      </el-table-column>
      <el-table-column
          prop="detail"
          name=""
          width="200">
      </el-table-column>
    </el-table>
    <div display="inline-block" style="margin-top: 8px;color: #555555">
      共 {{ total }} 条，当前显示 {{ currentViewCount }} 条
    </div>
    <el-pagination
        display="inline-block"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        style="float: right; margin-top: 8px">
    </el-pagination>

    <el-button type="info" plain class="btnBottom" @click="gotoOrigin">原始报告</el-button>
    <el-button type="info" plain class="btnBottom" @click="gotoSupp">补充说明报告</el-button>
  </div>

</template>

<script>
import navigationBar from "@/components/navigationBar";
import {getProjectById} from '@/api/project';
import {getReportListByPID, getReportListByPIDAndUID} from '@/api/report';
import {auditStateMap} from "@/main";

const reportState=[
  {
    text: '全部',
    value: -1
  },
  {
    text: '我提交的',
    value: 0
  },
]
export default {
  name: "reportSimilar",

  components:{
    navigationBar
  },

  props: {
    pid: String
  },

  data(){
    return {
      projectInfo: null,
      stateRadio:-1,
      reportStates:reportState,
      tableData:[],

      pageSize: 10,
      pageCurrent: 0,
      total: 0
    }
  },

  computed: {
    currentViewCount() {
      let res = 0;
      const max = (this.pageCurrent + 1) * this.pageSize;
      if (max > this.total) {
        res = this.total - this.pageCurrent * this.pageSize;
      } else {
        res = this.pageSize;
      }
      return res >= 0 ? res : 0;
    }
  },

  methods:{
    gotoReport(row){
      this.$router.push(`/reportManage/${row.tid}`)
    },
    gotoRelease(){
      this.$router.push(`/reportRelease/${this.pid}`)
    },
    gotoOrigin() {
      this.$router.push(`/reportManage/${this.tid}`)
    },
    gotoSupp() {
      this.$router.push(`/reportSupp/${this.tid}`)
    },
    handleCurrentChange(val) {
      this.pageCurrent = val - 1;
      console.log(val);
    },
    reportTransferAndAdd(report) {
      this.tableData.push({
        date: new Date(report.submitTime).formatting("yyyy-MM-dd"),
        tid: report.tid,
        name: report.bugName,
        status: auditStateMap[report.state]
      });
    },
    async stateChange() {
      let res = null;
      if (this.stateRadio == -1) {
        res = await getReportListByPID({
          page: 1,
          pid: this.pid,
          token: this.$store.state.token
        });
      } else {
        res = await getReportListByPIDAndUID({
          page: 1,
          pid: parseInt(this.pid),
          uid: this.$store.state.uid,
          token: this.$store.state.token
        })
      }
      console.log(res);
      this.total = res?.total;
      const reportListPage1 = res?.list;
      this.tableData.splice(0, this.tableData.length);
      reportListPage1?.forEach(report => this.reportTransferAndAdd(report));
    }

  },

  async mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'WORKER' && this.$store.state.role !== 'ADMIN')) {
      await this.$router.push('/login');
    }
    this.projectInfo = await getProjectById(this.pid);
    const res = await getReportListByPID({
      page: 1,
      pid: this.pid,
      token: this.$store.state.token
    });
    this.total = res.total;
    const reportListPage1 = res.list;
    reportListPage1.forEach(report => this.reportTransferAndAdd(report));
  }
}
</script>

<style scoped>
.detailContent{
  box-shadow:  0 2px 4px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .4);
  margin:5px;
  padding: 10px;
}
.btnBottom{
  display: inline;
  position: relative;
  left: 35%;
  font-size: 30px;

}
</style>