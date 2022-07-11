<template>
<div class="view-container">
  <br>
  <el-descriptions :column="2" :size="size" border style="width: 80%; margin: 2em auto;">
    <template slot="title">
      <h2>报告详情</h2>
    </template>
    <template slot="extra">
      <div class="extra-container">
        <div class="like-container">
          <el-image
              @click="activeLike"
              class="like-icon"
              :class="like_active_class"
              :src="this.likeUrl"
              fit="fill"></el-image>
          <div class="like-count">{{ likeCount }}</div>
        </div>
        <div class="like-container">
          <el-image
              @click="activeUnlike"
              class="like-icon"
              :class="unlike_active_class"
              :src="this.unlikeUrl"
              fit="fill"></el-image>
          <div class="like-count">{{ unlikeCount }}</div>
        </div>
        <div class="extra-report-score">
        综合评分
        <el-rate
            v-model="report.score"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
        </el-rate>
        </div>
        <div class="extra-my-score">
          <el-button type="primary" @click="submitScores">我要评分</el-button>
        </div>
      </div>
    </template>

    <el-descriptions-item span="2">
      <template slot="label">
        <h3 style="display: inline-block"><i class="el-icon-star-on"></i> 报告名称</h3>
      </template>
      <h3>{{ report.bugName }}</h3>
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-document"></i>
        报告ID
      </template>
      {{ report.tid }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        报告撰写者
      </template>
      {{ report.author_name }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-time"></i>
        提交时间
      </template>
      {{ (new Date(report.submitTime)).formatting("yyyy-MM-dd") }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-s-check"></i>
        审核状态
      </template>
      <el-tag size=""
              :type="report.state === '审核中' ? 'primary' : 'success'">
        {{ report.state }}</el-tag>
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-paperclip"></i>
        所属任务
      </template>
      {{ report.projectName }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile"></i>
        测试设备
      </template>
      {{ report.testDevice }}
    </el-descriptions-item>

    <el-descriptions-item span="2">
      <template slot="label">
        <i class="el-icon-data-board"></i>
        缺陷情况说明
      </template>
      <p class="special-scan-scope">{{ report.bugDescription }}</p>
    </el-descriptions-item>

    <el-descriptions-item span="2">
      <template slot="label">
        <i class="el-icon-search"></i>
        缺陷复现操作步骤
      </template>
      <p class="special-scan-scope">{{ report.bugProcedure }}</p>
    </el-descriptions-item>

    <el-descriptions-item span="2">
      <template slot="label">
        <i class="el-icon-picture"></i>
        截图列表
      </template>
      <el-image
          v-if="report.screenshotUrlList.length > 0"
          style="width: 200px; height: 200px"
          :src="report['screenshotUrlList'][0]"
          fit="contain"
          :preview-src-list="report.screenshotUrlList">
      </el-image>
    </el-descriptions-item>

  </el-descriptions>
  <slot></slot>
</div>
</template>

<script>
import ReportScoreBox from "@/components/ReportScoreBox";
import likeUrl from "/public/like.png"
import unlikeUrl from "/public/unlike.png"
// eslint-disable-next-line no-unused-vars
import likeActiveUrl from "/public/like_active.png"
// eslint-disable-next-line no-unused-vars
import unlikeActiveUrl from "/public/unlike_active.png"
import {
  getReportQuality,
  getUserReportBehavior,
  // eslint-disable-next-line no-unused-vars
  submitUserReportScoreAndComment, updateUserReportForkState,
  updateUserReportLikeState
} from "@/api/report";
import ReportScoreHistoryBox from "@/components/ReportScoreHistoryBox";

export default {
  name: "ReportView",

  components: {
    // eslint-disable-next-line vue/no-unused-components
    ReportScoreBox,
    // eslint-disable-next-line vue/no-unused-components
    ReportScoreHistoryBox
  },

  data() {
    return {
      userBehavior: {},
      likeCount: 0,
      unlikeCount: 0,
      viewerLikeState: 0,
      like_active_class: null,
      unlike_active_class: null,
      report: {
        bugName: this.reportProps.bugName,
        tid: Number(this.reportProps.tid),
        author_name: this.reportProps.author_name,
        submitTime: this.reportProps.submitTime,
        state: this.reportProps.state,
        projectName: this.reportProps.projectName,
        testDevice: this.reportProps.testDevice,
        bugDescription: this.reportProps.bugDescription,
        bugProcedure: this.reportProps.bugProcedure,
        screenshotUrlList: this.reportProps.screenshotUrlList,
        score: this.reportProps.score
      }
    }
  },

  computed: {
    likeUrl() {
      return this.viewerLikeState === 1 ? likeActiveUrl : likeUrl;
    },

    unlikeUrl() {
      return this.viewerLikeState === 2 ? unlikeActiveUrl : unlikeUrl;
    },
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
    updateLikeState() {
      const finalIsLike = this.viewerLikeState === 2 ? -1 : this.viewerLikeState;
      if (finalIsLike !== this.userBehavior.isLike) {
        console.log(finalIsLike);
        console.log(this.userBehavior);
        updateUserReportLikeState({
          uid: this.$store.state.uid,
          tid: this.report.tid,
          token: this.$store.state.token,
          isLike: finalIsLike,
          oldFork: this.userBehavior.fork
        });
      }
    },

    activeLike() {
      const oldLikeState = this.viewerLikeState;
      if (oldLikeState === 1) {
        this.viewerLikeState = 0;
        this.likeCount -= 1;
      } else if (oldLikeState === 2) {
        this.unlikeCount -= 1;
        this.viewerLikeState = 1;
        this.likeCount += 1;
      } else if (oldLikeState === 0){
        this.viewerLikeState = 1;
        this.likeCount += 1;
      }
      this.like_active_class = 'active1';
      setTimeout(()=>{
        this.like_active_class = 'active2';
      }, 200);

      this.updateLikeState();
    },

    activeUnlike() {
      const oldLikeState = this.viewerLikeState;
      if (oldLikeState === 2) {
        this.viewerLikeState = 0;
        this.unlikeCount -= 1;
      } else if (oldLikeState === 1) {
        this.likeCount -= 1;
        this.viewerLikeState = 2;
        this.unlikeCount += 1;
      } else if (oldLikeState === 0){
        this.viewerLikeState = 2;
        this.unlikeCount += 1;
      }
      this.unlike_active_class = 'active1';
      setTimeout(()=>{
        this.unlike_active_class = 'active2';
      }, 200);

      this.updateLikeState();
    },

    submitScores() {
      const h = this.$createElement;
      console.dir(this.userBehavior)
      if (this.userBehavior.score === null || this.userBehavior.score == 0) {
        this.$msgbox({
          title: '我要评分',
          message: h(ReportScoreBox, {ref: 'scoreBox'}, ''),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              await submitUserReportScoreAndComment({
                uid: this.$store.state.uid,
                tid: Number(this.report.tid),
                token: this.$store.state.token,
                comment: this.$refs.scoreBox['comment'],
                score: this.$refs.scoreBox['score']
              });
              instance.confirmButtonLoading = false;
              done();
            } else {
              done();
            }
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '评分成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      } else {
        this.$msgbox({
          title: '我的评分',
          message: h(ReportScoreHistoryBox,
              {ref: 'scoreBox', props: {score: this.userBehavior.score, comment: this.userBehavior.comment}}, ''),
          confirmButtonText: '确定',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = false;
              done();
            } else {
              done();
            }
          }
        })
      }
    },

    async forkReport() {
      return await updateUserReportForkState({
        uid: this.$store.state.uid,
        tid: this.report.tid,
        token: this.$store.state.token,
        oldIsLike: this.userBehavior.isLike,
        fork: 1
      })
    }
  },

  mounted: async function () {
    const userBehavior = await getUserReportBehavior({
      uid: this.$store.state.uid,
      token: this.$store.state.token,
      tid: this.report.tid
    });
    this.viewerLikeState = userBehavior['isLike'] === -1 ? 2 : userBehavior['isLike'];
    this.userBehavior = userBehavior;
    const reportQuality = await getReportQuality(this.report.tid, this.$store.state.token);
    // console.dir(reportQuality);
    this.report.score = Number((reportQuality.score).toFixed(2));
    this.likeCount = reportQuality.likeNum;
    this.unlikeCount = reportQuality.dislikeNum;
    if (this.$attrs.special !== undefined && this.$attrs.special !== null && this.$attrs.special !== "" && typeof this.$attrs.special === "string") {
      const specialText = this.$attrs.special;
      const regexp = new RegExp(`${specialText}`, "g");
      let special_scan_scope_list = Array.from(document.getElementsByClassName("special-scan-scope"));
      special_scan_scope_list.forEach(node => {
        node.innerHTML = node.innerHTML.replace(regexp, "<span style=\"color: red;\">" + specialText + "</span>")
      })
      console.log(document.getElementsByClassName("special-scan-scope"));
    }
  },

  beforeDestroy() {
    const finalIsLike = this.viewerLikeState === 2 ? -1 : this.viewerLikeState;
    if (finalIsLike !== this.userBehavior.isLike) {
      console.log(finalIsLike);
      console.log(this.userBehavior);
      updateUserReportLikeState({
        uid: this.$store.state.uid,
        tid: this.report.tid,
        token: this.$store.state.token,
        isLike: finalIsLike,
        oldFork: this.userBehavior.fork
      });
    }
  }
}
</script>

<style scoped>
.view-container {
  background-color: white;
  border-radius: 0.5em;
  padding: 1em;
}
.extra-container {
  display: flex;
  justify-content: space-between;
}
.extra-report-score{
  flex: auto;
}
.extra-my-score {
  margin-left: 2em;
  flex: auto;
}
.like-container {
  display: flex;
  font-size: 1rem;
}
.like-container .like-count{
  width: 35px;
  height: 35px;
  line-height: 40px;
  padding-left: 5px;
}
.like-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}
.active1 {
  transition: transform 200ms;
  transform: scale(1.5) rotate(12deg);
}
.active2 {
  transition: transform 200ms;
  transform: scale(1) rotate(0deg);
}

</style>