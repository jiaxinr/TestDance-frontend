<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path:`/manageP-side1` }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务管理详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container v-if="this.initialCompleteFlag">
      <el-aside>
        <el-row class="tac">
          <el-menu
              default-active="1"
              class="el-menu-vertical"
              style="margin-top: 77px">
            <br>
            <h3 style="position: relative;text-align: center">{{ projectInfo.projectName }}</h3><br>
            <div style="text-align: center">
              <el-button round size="mini" type="primary" @click="gotoManage">切换项目</el-button>
            </div>
            <br><br>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="this.compleDegree"></el-progress>

            <el-divider></el-divider>
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">所有报告</span>
            </el-menu-item>

            <el-menu-item index="2" @click="gotoSide2">
              <i class="el-icon-menu"></i>
              <span slot="title">聚合报告</span>
            </el-menu-item>

            <el-menu-item index="3" @click="gotoSide3">
              <i class="el-icon-menu"></i>
              <span slot="title">报告可视化</span>
            </el-menu-item>

            <el-menu-item index="4" @click="gotoSide4">
              <i class="el-icon-menu"></i>
              <span slot="title">低质量报告</span>
            </el-menu-item>
          </el-menu>
        </el-row>
      </el-aside>
      <el-main>
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
              width="200">
          </el-table-column>
          <el-table-column
              prop="bugDescription"
              label="缺陷描述">
          </el-table-column>
          <el-table-column
              label="审核状态"
              width="150">
            <template slot-scope="scope">
              <el-tag size=""
                      :type="scope.row.status === '审核中' ? 'primary' : 'success'"
                      disable-transitions>{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="查看详情"
              width="150">
            <el-button type="primary" plain size="small">查看详情</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {completion_degree, getProjectById} from '@/api/project';
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
  name: "manageDetailP-side1",

  components:{
    navigationBar
  },

  props: {
    pid: String
  },

  data(){
    return {
      initialCompleteFlag: false,
      projectInfo: null,
      stateRadio:-1,
      reportStates:reportState,
      tableData:[],

      pageSize: 10,
      pageCurrent: 0,
      total: 0,
      compleDegree:0,
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
    gotoManage(){
      this.$router.push('/manageP-side1')
    },
    gotoReport(row){
      this.$router.push(`/reportManage/${row.tid}`)
    },
    gotoRelease(){
      this.$router.push(`/reportRelease/${this.pid}`)
    },
    gotoSide2(){
      this.$router.push(`/manageDetailP-side2/${this.pid}`)
    },
    gotoSide3(){
      this.$router.push(`/manageDetailP-side3/${this.pid}`)
    },
    gotoSide4(){
      this.$router.push(`/manageDetailP-side4/${this.pid}`)
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
        status: auditStateMap[report.state],
        bugDescription: report.bugDescription
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
    this.initialCompleteFlag = true;
    this.compleDegree=(await completion_degree(this.pid)*100).toFixed(2);
  }
}
</script>

<style scoped>

</style>