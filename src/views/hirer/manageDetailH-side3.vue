<template>
  <div>
    <navigation-bar></navigation-bar>

    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.$store.state.role==='HIRER'" :to="{ path:`/manageH-side1` }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item v-else :to="{ path:`/manageAdmin-side1` }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务管理详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-container v-if="initialCompleteFlag">
      <el-aside>
        <el-row class="tac">
          <el-menu
              default-active="3"
              class="el-menu-vertical"
              style="margin-top: 77px">
            <br>
            <h3 style="position: relative;text-align: center">{{ projectInfo.projectName }}</h3><br>
            <div style="text-align: center">
              <el-button round size="mini" type="primary" @click="gotoManage">切换项目</el-button>
<!--              todo 支持结束项目-->
              <el-button round size="mini" type="danger" @click="closeProj">结束项目</el-button>
              <br><br>
              <el-button round size="mini" type="warning" @click="updateScore">更新质量</el-button>
              <el-button round size="mini" type="warning" @click="aggreReport">报告融合</el-button>
            </div>
            <br><br>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="this.compleDegree"></el-progress>
            <el-divider></el-divider>
            <el-menu-item index="1" @click="gotoSide1">
              <i class="el-icon-menu"></i>
              <span slot="title">所有报告</span>
            </el-menu-item>

            <el-menu-item index="2" @click="gotoSide2">
              <i class="el-icon-menu"></i>
              <span slot="title">聚合报告</span>
            </el-menu-item>

            <el-menu-item index="3">
              <i class="el-icon-menu"></i>
              <span slot="title">报告可视化</span>
            </el-menu-item>
          </el-menu>
        </el-row>
      </el-aside>

      <el-main style="margin-top: 57px">
        <div class="main" style="display: flex; align-content: stretch">
          <div style="width: 40%; height: 100%">
            <h3 style="color: #313131">聚类报告相似关系</h3>
            <p style="color: #525252; font-size: 0.8rem">(数字表示聚类报告的根报告ID，单击可以查看详情)</p>
          <ProjectRootReportsGraph :pid="Number(this.pid)" v-on:click-report-node="showReportView">
          </ProjectRootReportsGraph></div>
          <div style="width: 60%; height: 600px">
          <ProjectTree :pid="Number(this.pid)" style="height: 100%" v-on:click-report-node="showReportView"></ProjectTree></div>
        </div>
        <br>
        <div class="main" style="display: flex; align-content: stretch">
          <div style="width: 40%; height: 100%">
            <h3 style="color: #313131">聚类可视化</h3>
            <cluster-spots :pid="Number(this.pid)"></cluster-spots>
          </div>
        </div>
      </el-main>

      <el-drawer
          title="相似报告详情"
          :visible.sync="showReportData.visible"
          direction="rtl"
          size="80%">
        <div class="similarReportContainer">
          <div class="similarReportView">
            <ReportView :report-props="showReportData" :key="showReportData.tid">
            </ReportView>
          </div>
          <ReportTree class="similarTreeView"
                      :tid="Number(showReportData.tid)"
                      :key="showReportData.tid"
                      v-on:click-report-node="refreshItem"></ReportTree>
        </div>
      </el-drawer>

    </el-container>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import ProjectRootReportsGraph from "@/components/tree/fullyConnectedGraph"
import ReportView from "@/components/ReportView";
import ReportTree from "@/components/tree/tree3";
import ProjectTree from "@/components/tree/ProjectTree";
import {closeProject, completion_degree, getProjectById} from "@/api/project";
import {aggregateReport, getAggregationReport, getReportById} from "@/api/report";
import {auditStateMap} from "@/main";
import {updateFinalScore} from "@/api/quality";

export default {
  name: "manageDetailH-side3",

  components: {
    navigationBar,
    ProjectRootReportsGraph,
    ReportView,
    ReportTree,
    ProjectTree
  },

  data() {
    return {
      initialCompleteFlag: false,

      projectInfo: null,
      tableData:[],

      showReportData: {
        author_name: "",
        bugDescription: "",
        bugName: "",
        bugProcedure: "",
        pid: 0,
        projectName: "",
        screenshotUrlList: [],
        state: "",
        submitTime: 0,
        testDevice: "",
        tid: 0,
        uid: 0,
        visible: false,
      },
      compleDegree:0,
    }
  },

  props: {
    pid: String
  },

  methods: {
    gotoManage(){
      if (this.$store.state.role==='HIRER') {
        this.$router.push('/manageH-side1');
      }else{
        this.$router.push('/manageAdmin-side1')
      }
    },
    gotoSide1(){
      this.$router.push(`/manageDetailH-side1/${this.pid}`)
    },
    gotoSide2(){
      this.$router.push(`/manageDetailH-side2/${this.pid}`)
    },
    updateScore() {
      if (this.tableData.length===0){
        this.$message({
          message: '暂无内容可更新',
          type: 'warning'
        });
      }else {
        updateFinalScore(this.pid);
        this.$message({
          message: '更新成功',
          type: 'success'
        });
      }
    },
    async aggreReport() {
      await aggregateReport(this.pid, this.$store.state.uid);
      let tmp=await getAggregationReport(this.pid);
      this.$message({
        message: '正在融合，稍后将通知融合结果',
        type: 'success'
      });
      if (tmp.clusterNum===0){
        this.aggregationFlag=false;
      }else {
        this.aggregationFlag=true;
      }
    },

    showReportView(e) {
      if (e > 0) {
        this.refreshItem(e);
      }
    },

    reportVOToDetail(reportVO) {
      return {
        tid: reportVO['tid'],
        uid: reportVO['uid'],
        pid: reportVO['pid'],
        bugName: reportVO['bugName'],
        testDevice: reportVO['testDevice'],
        state: auditStateMap[Number(reportVO['state'])],
        submitTime: reportVO['submitTime'],
        bugDescription: reportVO['bugDescription'],
        bugProcedure: reportVO['bugProcedure'],
        screenshotUrlList: reportVO['screenshotUrlList'],
        projectName: this.projectInfo.name,
        visible: false,
        author_name: "保密",
      }
    },

    copyToShowData(reportDetail) {
      this.showReportData.tid = reportDetail.tid;
      this.showReportData.uid = reportDetail.uid;
      this.showReportData.pid = reportDetail.pid;
      this.showReportData.bugName = reportDetail.bugName;
      this.showReportData.testDevice = reportDetail.testDevice;
      this.showReportData.state = reportDetail.state;
      this.showReportData.submitTime = reportDetail.submitTime;
      this.showReportData.bugDescription = reportDetail.bugDescription;
      this.showReportData.bugProcedure = reportDetail.bugProcedure;
      this.showReportData.screenshotUrlList = reportDetail.screenshotUrlList;
      this.showReportData.projectName = reportDetail.projectName;
      this.showReportData.visible = false;
      this.showReportData.author_name = "保密";
    },

    async refreshItem(targetTid) {
      const reportVO = await getReportById(targetTid, this.$store.state.token);
      const reportDetail = this.reportVOToDetail(reportVO);
      this.copyToShowData(reportDetail);
      this.$nextTick(() => {
        this.showReportData.visible = true;
      });
    },
    closeProj(){
      closeProject(this.pid);
      this.$message({
        message: '已结束项目',
        type: 'success'
      });
    },
  },

  async mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'HIRER' && this.$store.state.role !== 'ADMIN')) {
      await this.$router.push('/login');
    }
    this.projectInfo = await getProjectById(this.pid);

    this.initialCompleteFlag = true;
    this.compleDegree=(await completion_degree(this.pid)*100).toFixed(2);
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  background-color: white;
  padding: 2em;
}

.similarReportContainer {
  display: flex;
  height: 100%;
}

.similarReportContainer .similarReportView {
  flex: 0 0 60%;
}

.similarReportContainer .similarTreeView {
  flex: 1 0 40%;
}
</style>