<template>
<div>
  <navigation-bar></navigation-bar>
  <el-main style="display: flex">

    <div class="report-view-container">
      <ReportView v-if="this.initialCompleted"
                  :report-props="this.encapsulateReport()">
        <el-button type="primary" round
                   @click="forkToNewReport"
                   style="color:white; display: block; margin: 0 auto"> Fork 报告 </el-button>
      </ReportView>
    </div>
    <div class="report-tree-container">
      <ReportTree v-if="this.initialCompleted"
                  :tid="Number(tid)"
                  v-on:click-report-node="gotoAnotherReport"></ReportTree>
    </div>
  </el-main>


</div>

</template>

<script>
import navigationBar from "@/components/navigationBar";
import ReportView from "@/components/ReportView";
import ReportTree from "@/components/tree/tree3";
import {getReportById} from '@/api/report';
import {getProjectById} from '@/api/project';
import {getUser} from '@/api/user';
import {auditStateMap, deviceMap} from '@/main'

export default {
  name: "reportManage",

  components: {
    navigationBar,
    ReportView,
    ReportTree
  },

  props: {
    tid: String
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
      value: 0,
      reportCriticism:null,
    }
  },

  async mounted() {
    if (this.$store.getters.isLogin === false) {
      await this.$router.push('/login');
    }
    await this.initial();
    this.initialCompleted = true;
  },
  methods:{
    gotoSupp(){
      this.$router.push(`/reportSupp/${this.tid}`)
    },
    gotoSimilar(){
      this.$router.push(`/reportSimilar/${this.tid}`)
    },
    gotoAnotherReport(targetTid){
      this.$router.push(`/reportManage/${targetTid}`);
    },
    encapsulateReport() {
      const res = {
        bugName: this.bugName,
        tid: this.tid,
        author_name: this.author_name,
        submitTime: this.submitTime,
        state: this.state,
        projectName: this.projectName,
        testDevice: this.testDevice,
        bugDescription: this.bugDescription,
        bugProcedure: this.bugProcedure,
        screenshotUrlList: this.screenshotUrlList,
        score: this.value
      }
      return res;
    },
    async initial() {
      const token = this.$store.state.token;
      const testReportInfo = await getReportById(this.tid, token);
      const projectInfo = await getProjectById(testReportInfo.pid);
      const authorInfo = await getUser(testReportInfo.uid, this.$store.state.token);
      this.bugName = testReportInfo.bugName;
      this.state = auditStateMap[testReportInfo.state];
      this.pid = testReportInfo.pid;
      this.projectName = projectInfo.projectName;
      this.submitTime = testReportInfo.submitTime;
      const device = testReportInfo.testDevice;
      this.testDevice = (device === null || device === '') ? deviceMap[projectInfo.testDevice] : device;
      this.author_uid = testReportInfo.uid;
      this.author_name = authorInfo.uname;
      this.bugDescription = testReportInfo.bugDescription;
      this.bugProcedure = testReportInfo.bugProcedure;
      this.screenshotUrlList = testReportInfo.screenshotUrlList;
      return Promise.resolve();
    },

    forkToNewReport() {
      this.$router.push({ path: `/reportRelease/${this.pid}`, query: {forkParentTid: this.tid}});
    }
  }
}
</script>

<style lang="scss" scoped>
.report-view-container {
  width: 60%;
  margin: 1em auto;
}

.report-tree-container {
  width: 30%;
  margin: 1em auto;
}

.btnBottom{
  display: inline;
  position: relative;
  left: 35%;
  font-size: 30px;
}

</style>