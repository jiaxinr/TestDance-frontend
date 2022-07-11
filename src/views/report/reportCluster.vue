<template>
  <div>
    <navigation-bar></navigation-bar>

    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path:`/manageAdmin-side1` }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>任务管理详情 - 融合报告详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main style="display: flex">
    <div class="report-view-container">
      <report-cluster-view v-if="this.initialCompleted"
                           :report-props="this.encapsulateReport()"
                           style="margin: 5px;padding: 10px">
      </report-cluster-view>
    </div>
    <div class="report-tree-container">
      <ReportTree v-if="this.initialCompleted"
                  :tid="Number(tid)"
                  v-on:click-report-node="showReportView"></ReportTree>
    </div>
    </el-main>

    <el-drawer
        title="补充报告详情"
        :visible.sync="showReportData.visible"
        direction="rtl"
        size="80%">
      <div class="similarReportContainer">
        <div class="similarReportView">
          <ReportView :report-props="showReportData" :key="showReportData.tid" :special="showReportData.supplement">
          </ReportView>
        </div>
        <ReportTree class="similarTreeView"
                    :tid="Number(showReportData.tid)"
                    :key="showReportData.tid"
                    v-on:click-report-node="refreshItem"></ReportTree>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import reportClusterView from "@/components/reportClusterView";
import ReportTree from "@/components/tree/tree3";
import ReportView from "@/components/ReportView";
import MiddleUtil from "@/plugins/MiddleUtil";
import {getAggregationReport, getReportById} from "@/api/report";
import {getProjectById} from "@/api/project";
import {auditStateMap} from "@/main";
import {cloudsword} from "@/api/tree";

export default {
  name: "reportCluster",
  components: {
    navigationBar,
    reportClusterView,
    ReportTree,
    ReportView,
  },

  props: {
    tid: String,
    uid: String,
  },

  data() {
    return {
      initialCompleted: false,
      bugName: '',
      state: '',
      pid: 0,
      projectName: '',
      submitTime: 0,
      testDevice: '',
      author_uid: 0,
      author_name: '',
      bugDescription: '',
      bugProcedure: '',
      screenshotUrlList: [],
      deviceList: [],
      value: 0,
      reportCriticism: null,
      clusterNum:0,//聚合数量
      masterTid:0,
      wordCloudImageUrl: "",

      clusterVOList:[],

      supplementList: [],

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
        supplement: ""
      },
    }
  },

  async mounted() {
    if (this.$store.getters.isLogin === false) {
      await this.$router.push('/login');
    }
    await this.initial();
    this.initialCompleted = true;
    this.projectInfo = await getProjectById(this.pid);
    let _this=this;
    MiddleUtil.$on('showSupplementReportView',(e)=>{
      _this.showSpecialReportView(e);
    })
  },
  methods: {
    gotoSupp() {
      this.$router.push(`/reportSupp/${this.tid}`)
    },
    gotoSimilar() {
      this.$router.push(`/reportSimilar/${this.tid}`)
    },
    gotoAnotherReport(targetTid) {
      this.$router.push(`/reportManage/${targetTid}`);
    },
    encapsulateReport() {
      const res = {
        masterTid: this.masterTid,
        bugName: this.bugName,
        projectName: this.projectName,
        bugDescription: this.bugDescription,
        bugProcedure: this.bugProcedure,
        screenshotUrlList: this.screenshotUrlList,
        supplementList: this.supplementList,
        wordCloudImageUrl: this.wordCloudImageUrl,
        deviceList: this.deviceList,
      }
      return res;
    },
    async initial() {
      const rootReportInfo = await getReportById(this.tid, this.$store.state.token);
      this.pid = rootReportInfo['pid'];
      const testReportInfo = await getAggregationReport(this.pid);
      const projectInfo = await getProjectById(testReportInfo.pid);
      this.projectName = projectInfo['projectName'];
      // const authorInfo = await getUser(testReportInfo.uid, this.$store.state.token);
      this.pid = testReportInfo.pid;
      let clusterList = Array.from(testReportInfo['clusterVOList']);
      for (let i = 0; i < clusterList.length; i++) {
        const cluster = clusterList[i];
        if (this.tid == cluster['clusterId']) {
          this.masterTid = cluster['masterTid'];
          const masterReportInfo = await getReportById(this.masterTid, this.$store.state.token);
          this.bugName = masterReportInfo['bugName'];
          this.bugDescription = masterReportInfo['bugDescription'];
          this.bugProcedure = masterReportInfo['bugProcedure'];
          this.supplementList = cluster['sentenceList'];
          this.deviceList = cluster['deviceList'];
          this.screenshotUrlList = cluster['imageList'];
          this.wordCloudImageUrl = (await cloudsword(this.tid))['url'];
          break;
        }
      }

      return Promise.resolve();
    },
    showReportView(e) {
      if (e > 0) {
        console.log("showReportView:"+e);
        this.refreshItem(e);
      }
    },
    async showSpecialReportView(data) {
      const targetTid = data['tid'];
      const reportVO = await getReportById(targetTid, this.$store.state.token);
      const reportDetail = this.reportVOToDetail(reportVO);
      this.copyToShowData(reportDetail);
      this.showReportData.supplement = data['keyword'];
      this.$nextTick(() => {
        this.showReportData.visible = true;
      });
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
      console.log("VO:"+JSON.stringify(reportVO));
      const reportDetail = this.reportVOToDetail(reportVO);
      console.log("Detail:"+reportDetail);
      this.copyToShowData(reportDetail);
      console.log("1111111111111111")
      this.$nextTick(() => {
        this.showReportData.visible = true;
      });
    },
  }
}
</script>

<style scoped>
.report-view-container {
  width: 60%;
  margin: 1em auto;
}

.report-tree-container {
  width: 30%;
  margin: 1em auto;
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