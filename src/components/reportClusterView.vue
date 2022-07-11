<template>
  <div>
<!--    <report-cluster v-show="false" ref="reportCluster"></report-cluster>-->
    <div class="view-container">
      <br>
      <el-descriptions :column="2" :size="size" border style="width: 88%; margin: 2em auto;">
        <template slot="title">
          <h1><span style="color: darkred;top: -18px;position: relative">融合后</span><span
              style="top: -18px;position: relative;font-size:22px">报告详情</span></h1>
        </template>

        <el-descriptions-item span="2">
          <template slot="label">
            <h3 style="display: inline-block"><i class="el-icon-star-on"></i> 报告名称</h3>
          </template>
          <h3>{{ report.bugName }}</h3>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            主报告ID（点击ID以跳转）
          </template>
          <p id="hoverHand" @click="gotoReportManage(report.masterTid)">
            {{ report.masterTid }}
          </p>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-paperclip"></i>
            所属任务
          </template>
          {{ report.projectName }}
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-mobile"></i>
            测试设备列表
          </template>
          <p v-for="(device, index) in report.deviceList" :key="index">{{device}}</p>
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-picture"></i>
            融合聚类词云图
          </template>
          <el-image
              style="width: 200px; height: 200px"
              :src="report.wordCloudImageUrl"
              fit="contain">
          </el-image>
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-data-board"></i>
            缺陷情况说明
          </template>
          {{ report.bugDescription }}
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-search"></i>
            缺陷复现操作步骤
          </template>
          {{ report.bugProcedure }}
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-picture"></i>
            截图列表
          </template>
          <el-image
              v-for="(url, index) in report['screenshotUrlList']"
              :key="index"
              style="width: 200px; height: 200px"
              :src="url"
              fit="contain"
              :preview-src-list="report.screenshotUrlList">
          </el-image>
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-magic-stick"></i>
            补充点（点击跳转查看详细信息）
          </template>
          <div v-for="(supplement, index) in report.supplementList" :key="index">{{"第"+(index+1)+"个补充要点"}}
            <div class="hoverHand"  @click="showReportDetail({'tid':sentence.tid, 'keyword': sentence.content})" v-for="(sentence, index) in supplement" :key="index">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{(index+1) + ". " + sentence.content}}</div>
            <br>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <slot></slot>
    </div>
  </div>
</template>

<script>
// import reportCluster from "../views/report/reportCluster";
import MiddleUtil from "@/plugins/MiddleUtil";

export default {
  name: "reportClusterView",
  components: {
    // reportCluster,
  },
  data() {
    return {
      report: {
        bugName: this.reportProps.bugName,
        masterTid: Number(this.reportProps.masterTid),
        deviceList: this.reportProps.deviceList,
        projectName: this.reportProps.projectName,
        bugDescription: this.reportProps.bugDescription,
        bugProcedure: this.reportProps.bugProcedure,
        screenshotUrlList: this.reportProps.screenshotUrlList,
        supplementList: this.reportProps.supplementList,
        wordCloudImageUrl: this.reportProps.wordCloudImageUrl
      }
    }
  },

  props: {
    reportProps: Object,
    size: {
      type: String,
      required: false,
      default: "medium"
    }
  },

  methods: {
    async mounted() {
    },
    gotoReportManage(tid) {
      this.$router.push(`/reportManage/${tid}`)
    },
    showReportDetail(data) {
      MiddleUtil.$emit('showSupplementReportView',data);
    },


  }
}
</script>

<style scoped>
.view-container {
  background-color: #fde1e1;
  border-radius: 0.5em;
  padding: 1em;
}

.hoverHand:hover {
  cursor: pointer
}
</style>