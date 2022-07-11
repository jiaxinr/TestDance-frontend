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

    <el-container v-if="initialCompleteFlag">
      <el-aside>
        <el-row class="tac">
          <el-menu
              default-active="4"
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
            <el-menu-item index="1" @click="gotoSide1">
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

            <el-menu-item index="4">
              <i class="el-icon-menu"></i>
              <span slot="title">低质量报告</span>
            </el-menu-item>
          </el-menu>
        </el-row>
      </el-aside>

      <el-main style="margin-top: 57px">
        <after-report-release-box :pid="Number(this.pid)"></after-report-release-box>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import AfterReportReleaseBox from "@/components/AfterReportReleaseBox";
import {completion_degree, getProjectById} from "@/api/project";

export default {
  name: "manageDetailP-side4",

  components: {
    navigationBar,
    AfterReportReleaseBox
  },

  data() {
    return {
      initialCompleteFlag: false,

      projectInfo: null,
      compleDegree:0,
    }
  },

  props: {
    pid: String
  },

  computed: {

  },

  methods: {
    gotoManage(){
      this.$router.push('/manageP-side1');
    },
    gotoSide1(){
      this.$router.push(`/manageDetailP-side1/${this.pid}`)
    },
    gotoSide2(){
      this.$router.push(`/manageDetailP-side2/${this.pid}`)
    },
    gotoSide3(){
      this.$router.push(`/manageDetailP-side3/${this.pid}`)
    },

  },

  async mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'WORKER' && this.$store.state.role !== 'ADMIN')) {
      await this.$router.push('/login');
    }
    this.projectInfo = await getProjectById(Number(this.pid));
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

.el-row {
  margin-bottom: 1.5em;
}

.el-card {
  height: 100%;
}

.card-header {
  padding: 1.5em;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.card-detail {
  padding: 1em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-detail-image {
  width: 100%;
  margin-top: 0.8em;
  height: 15vw;
  border-radius: 0.3em;
  /*justify-self: flex-end;*/
}

.card-detail > .card-detail-text {
  flex-grow: 1;
}

.card-detail-item {
  margin-bottom: 0.6em;
}
</style>