<template>
  <div v-if="initialCompleted">
    <navigation-bar></navigation-bar>
    <div class="flex-container">
      <div class="report-edit-container">
        <v-app style="background: transparent;">
          <form class="projectForm">
            <br>
            <h1 style="text-align: center">创建新报告</h1>
            <v-card flat >
              <v-card-text>
                <v-container fluid>
                  <v-text-field label="缺陷名称"
                                :rules="rules1"
                                v-model="bugName"
                                @change="getSimilarReportList"></v-text-field>
                  <v-text-field label="测试设备详细信息"
                                :rules="rules1"
                                v-model="testDevice"
                                @change="getSimilarReportList"></v-text-field>
                  <v-text-field v-if="parentTid > 0"
                                label="fork 补充说明"
                                v-model="addInformation"></v-text-field>
                </v-container>
              </v-card-text>
            </v-card>

            <v-container fluid>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                      outlined
                      name="input-7-4"
                      label="缺陷具体情况说明"
                      value=""
                      v-model="bugDescription"
                      style="width: 150%"
                      @change="getSimilarReportList"
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                      outlined
                      name="input-7-4"
                      label="缺陷复现操作步骤"
                      value=""
                      v-model="bugProcedure"
                      style="width: 150%"
                      @change="getSimilarReportList"
                  ></v-textarea>
                </v-col>
              </v-row>
              <h4>相关截图：</h4>
              <br>
              <el-upload
                  v-if="active===0"
                  class="upload-demo"
                  drag
                  action="#"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :http-request="upload"
                  multiple v-model="TaskInfo.executeURL">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将相关截图拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </v-container>
            <el-button type="primary" style="position: relative;left: 85%" @click="ReleaseCheckAndSubmit">提交</el-button>
          </form>
        </v-app>
      </div>

      <div class="similar-list-container">
        <div class="similar-list-inner-container">

          <el-tooltip class="tip-item" effect="dark" content="点此查看已 fork 的父报告" placement="left">
            <el-button id="aside-starter"
                       type="primary" circle
                       @click="showParentDetailView">
              <i class="iconfont">&#xe656;</i>
            </el-button>
          </el-tooltip>

          <br>
          <h1 align="center">相似度较高聚类列表</h1>
          <el-table
              fit
              class="similar-list-table"
              ref="singleTable"
              :data="similarList.tableData"
              highlight-current-row
              empty-text="恭喜你，暂时还没有相似报告"
              @row-click="showReportDetailView">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                property="bugName"
                label="报告名称"
                width="150">
            </el-table-column>
            <el-table-column
                property="similarity"
                label="相似度"
                width="100">
            </el-table-column>
            <el-table-column
                property="bugDescription"
                label="缺陷描述">
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
              <template>
                <el-button size="mini">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br><br><br><br><br>
          <h4 class="center">请仔细对照以下七点标准报告要求来编写您自己的报告</h4>
          <br>
          <h4 class="center">这些都会影响您的报告质量与最终报酬哦~</h4>
          <br><br>
          <el-image :src="standard_image_url"></el-image>
        </div>
        <el-image class="background-image-container"
                  :src="backgroundImg"></el-image>
      </div>

      <el-drawer
          v-if="parentTid > 0"
          title=" Fork 父报告详情"
          :visible.sync="parentReportData.visible"
          direction="rtl"
          size="80%">
        <div class="similarReportContainer">
          <div class="similarReportView">
            <ReportView :report-props="parentReportData" ref="parentReportView">
            </ReportView>
            <el-button type="primary" round disabled
                       style="display: block; margin: 0 auto"> 已 Fork 此报告 </el-button>
          </div>
          <ReportTree class="similarTreeView"
                      :tid="Number(parentReportData.tid)"
                      v-on:click-report-node="refreshItem"></ReportTree>
        </div>
      </el-drawer>

      <el-drawer
          title="相似报告详情"
          :visible.sync="showReportData.visible"
          direction="rtl"
          size="80%">
        <div class="similarReportContainer">
          <div class="similarReportView">
            <ReportView :report-props="showReportData" :key="showReportData.tid">
            </ReportView>
            <el-button type="primary" round
                       @click="forkSimilarReport(showReportData)"
                       style="display: block; margin: 0 auto"> Fork报告 </el-button>
          </div>
          <ReportTree class="similarTreeView"
                      :tid="Number(showReportData.tid)"
                      :key="showReportData.tid"
                      v-on:click-report-node="refreshItem"></ReportTree>
        </div>
      </el-drawer>

    </div>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import ReportView from "@/components/ReportView";
import ReportTree from "@/components/tree/tree3";
import AfterReportReleaseBox from "@/components/AfterReportReleaseBox";
import {createReport, getReportById} from "@/api/report";
import {getSimReportList} from "@/api/tree";
import {auditStateMap} from "@/main";
import {getProjectById} from "@/api/project";
import backgroundImg from "/public/Hirerring.png";

export default {
  name: "reportRelease",

  components:{
    navigationBar,
    ReportView,
    ReportTree,
    // eslint-disable-next-line vue/no-unused-components
    AfterReportReleaseBox
  },

  props: {
    pid: String,
  },

  data() {
    return {
      initialCompleted: false,

      standard_image_url : require('@/assets/report_standard.jpg'),

      parentReportData: {
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

      backgroundImg: backgroundImg,

      parentTid: 0,
      addInformation: "",

      active: 0,
      TaskInfo:{
        name: '',
        executeURL: '',
        requirementURL: '',
        desc: '',
        startTime: '',
        endTime: '',
        laborNum: '',
        TaskType: '',
      },
      bugName:'',
      testDevice:'',
      bugDescription:'',
      bugProcedure:'',
      imgURLList:[],
      rules1: [
        value => !!value || '不能为空',
      ],

      similarList: {
        rawList: [],

        tableData: [],
        currentRow: null
      }
    }
  },
  methods:{
    ReleaseCheckAndSubmit() {
      const emptyStrRegexp = /^\s*$/;
      if (this.bugName === null || this.bugName.search(emptyStrRegexp) >= 0) {
        this.$message({
          message: "缺陷名称不能为空",
          type: "warning"
        });
      } else if (this.testDevice === null || this.testDevice.search(emptyStrRegexp) >= 0) {
        this.$message({
          message: "测试设备详细信息不能为空",
          type: "warning"
        });
      } else if (this.bugDescription === null || this.bugDescription.search(emptyStrRegexp) >= 0) {
        this.$message({
          message: "缺陷具体情况说明不能为空",
          type: "warning"
        });
      } else if (this.bugProcedure === null || this.bugProcedure.search(emptyStrRegexp) >= 0) {
        this.$message({
          message: "缺陷名称不能为空",
          type: "warning"
        });
      } else if (this.parentTid === 0 && (this.similarList.tableData !== null && this.similarList.tableData.length > 0)) {
        this.$confirm('您的报告与已有的报告非常相似，系统可能已经存在您所提交报告的bug聚类。您可以进一步fork已有报告进行协作。您确定依然作为新报告提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          this.handleRelease();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交, 欢迎进行协作'
          });
        })
      } else if (this.parentTid !== 0 && (this.similarList.tableData === null || this.similarList.tableData.length === 0)) {
        this.$confirm('您的报告与Fork的父报告相似度较低，您依然坚持Fork提交吗？(如果系统判定无关联将会降低信誉分喔~)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: "warning"
        }).then(() => {
          this.handleRelease();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交, 可以不用Fork重新提交喔'
          });
        })
      } else if (this.parentTid !== 0 && this.similarList.tableData !== null) {
        const most_similar_degree = parseFloat(this.similarList.tableData[0]['similarity']);
        if (most_similar_degree < 50) {
          this.$confirm('您的报告与Fork的父报告相似度较低，您依然坚持Fork提交吗？(如果系统判定无关联将会降低信誉分喔~)', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
          }).then(() => {
            this.handleRelease();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交, 可以不用Fork重新提交喔'
            });
          })
        } else if (most_similar_degree > 99) {
          this.$confirm('您的报告与Fork的父报告相似度过于高了，您依然坚持Fork提交吗？(如果系统判定没有增加新的信息将会降低信誉分喔~)', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
          }).then(() => {
            this.handleRelease();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交, 可以尝试更详细地描述您的报告'
            });
          })
        } else if(this.similarList.tableData.length > 1 && parseFloat(this.similarList.tableData[1]['similarity']) > 70) {
          this.$confirm('您的报告与其他聚簇报告相似度过于高了，您依然坚持提交吗？(如果系统判定没有恶意提交将会降低信誉分喔~)', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
          }).then(() => {
            this.handleRelease();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交, 可以尝试更详细地描述您的报告'
            });
          })
        } else {
          this.handleRelease();
        }
      } else {
        this.handleRelease();
      }
    },

    afterReleaseCollaboration() {
      this.$msgbox({
        title: '报告协作',
        // message: h(AfterReportReleaseBox, {}, ''),
        message: "感谢您为该项目贡献力量！您的报告正在系统审核中，审核结果将会通知您！该项目还有测试报告评分较低，是否参与这些报告的协作？可以收获额外的薪酬与积分奖励喔 ~ ",
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '欢迎协作'
        });
        this.$router.push(`/manageDetailP-side4/${this.pid}`);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消协作'
        });
        this.$router.push(`/manageDetailP-side3/${this.pid}`);
      });
    },

    handleRelease(){
      createReport({
        uid:this.$store.state.uid,
        pid:Number(this.pid),
        bugName: this.bugName,
        testDevice: this.testDevice,
        state: 0,
        submitTime: new Date(Date.now()),
        bugDescription: this.bugDescription,
        bugProcedure: this.bugProcedure,
        screenshotUrlList: this.imgURLList,
        token: this.$store.state.token,
        parentTid: this.parentTid,
      }).then(() => {
        this.$message({
          message: '感谢您为该项目贡献力量！您的报告正在系统审核中，审核结果将会通知您！',
          type: 'success'
        });
        this.afterReleaseCollaboration();
      }).catch(()=>{
        this.$message({
          message: '感谢您为该项目贡献力量！您的报告正在系统审核中，审核结果将会通知您！',
          type: 'success'
        });
        this.afterReleaseCollaboration();
      });
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },

    beforeAvatarUpload(file) {
      // const isPNG = file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      // if (!isPNG) {
      //   this.$message.error('上传头像图片只能是 PNG 格式!')
      // }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      // return isPNG && isLt2M
      return isLt10M
    },

    upload(res) {
      if (res.file) {
        const COS = require('cos-js-sdk-v5')
        // 填写自己腾讯云cos中的key和id (密钥)
        const cos = new COS({
          SecretId: 'AKIDDUVFjwsXw4vVpsd7KHxMUMxHK6bpmSs1', // 身份识别ID
          SecretKey: 'tVrwkHXWEenfGadPu85mhLhmb9E8nCLE' // 身份秘钥
        })
        // 执行上传操作
        cos.putObject({
          Bucket: 'seiii-1304456726', /* 存储桶 */
          Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => { // 上传进度
            console.log(JSON.stringify(progressData))
          }
        }, (err, data) => {
          console.log(err || data)
          // 上传成功之后
          if (data.statusCode === 200) {
            this.imageUrl = `https:${data.Location}`
            console.log(this.imageUrl)
            this.imgURLList.push(this.imageUrl);
          }
        })
      }
    },

    showParentDetailView() {
      if (this.parentTid > 0) {
        this.parentReportData.visible = true;
      } else {
        this.$message({
          message: "父报告不存在，你还没有 fork 过任何报告喔",
          type: "warning"
        });
      }
    },

    showReportDetailView(row) {
      this.similarList.currentRow = row;
      row.visible = true;
      this.copyToShowData(row);
      this.showReportData.visible = true;
    },

    async getSimilarReportList() {
      const requestBody = {
        tid: -1,
        uid: this.$store.state.uid ?? -1,
        pid: (Number)(this.pid) ?? -1,
        bugName: this.bugName ?? '',
        testDevice: this.testDevice ?? '',
        state: -1,
        submitTime: 0,
        bugDescription: this.bugDescription ?? '',
        bugProcedure: this.bugProcedure ?? '',
        screenshotUrlList: this.imgURLList ?? [],
        token: this.$store.state.token
      };
      const res = await getSimReportList(requestBody);
      this.similarList.tableData = [];
      for (const similarityReport of res) {
        this.similarList.tableData.push({
          tid: similarityReport['reportVO']['tid'],
          uid: similarityReport['reportVO']['uid'],
          pid: similarityReport['reportVO']['pid'],
          bugName: similarityReport['reportVO']['bugName'],
          testDevice: similarityReport['reportVO']['testDevice'],
          state: auditStateMap[Number(similarityReport['reportVO']['state'])],
          submitTime: similarityReport['reportVO']['submitTime'],
          bugDescription: similarityReport['reportVO']['bugDescription'],
          bugProcedure: similarityReport['reportVO']['bugProcedure'],
          screenshotUrlList: similarityReport['reportVO']['screenshotUrlList'],
          similarity: (similarityReport['similarity']*100).toFixed(2) + "%",
          projectName: this.TaskInfo.name,
          visible: false,
          author_name: "保密",
        });
      }
      return res;
    },

    forkSimilarReport(reportInfo) {
      this.bugName = reportInfo.bugName;
      this.testDevice = reportInfo.testDevice;
      this.bugDescription = reportInfo.bugDescription;
      this.bugProcedure = reportInfo.bugProcedure;
      this.parentTid = Number(reportInfo.tid);
      this.copyToParentData(reportInfo);
      this.showReportData.visible = false;
      this.$notify({
        title: 'Fork 成功',
        message: '现在您可以基于父报告进行补充了! 点击相似报告列表右上角的图标，可以查看已 fork 的父报告详情、协作关系~',
        type: 'success'
      });
    },

    async refreshItem(targetTid) {
      const reportVO = await getReportById(targetTid, this.$store.state.token);
      const reportDetail = this.reportVOToDetail(reportVO);
      this.copyToShowData(reportDetail);
      this.$nextTick(() => {
        this.parentReportData.visible = false;
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
        projectName: this.TaskInfo.name,
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

    copyToParentData(reportDetail) {
      this.parentReportData.tid = reportDetail.tid;
      this.parentReportData.uid = reportDetail.uid;
      this.parentReportData.pid = reportDetail.pid;
      this.parentReportData.bugName = reportDetail.bugName;
      this.parentReportData.testDevice = reportDetail.testDevice;
      this.parentReportData.state = reportDetail.state;
      this.parentReportData.submitTime = reportDetail.submitTime;
      this.parentReportData.bugDescription = reportDetail.bugDescription;
      this.parentReportData.bugProcedure = reportDetail.bugProcedure;
      this.parentReportData.screenshotUrlList = reportDetail.screenshotUrlList;
      this.parentReportData.projectName = reportDetail.projectName;
      this.parentReportData.visible = false;
      this.parentReportData.author_name = "保密";
    }

  },

  async mounted() {
    if (this.$store.getters.isLogin === false) {
      await this.$router.push('/login');
    }
    this.TaskInfo.name = (await getProjectById(Number(this.pid))).projectName;
    const forkParentTid = this.$route.query['forkParentTid'];
    if (forkParentTid !== undefined && forkParentTid !== null) {
      const parentTid = Number(forkParentTid);
      const parentReportVO = await getReportById(parentTid, this.$store.state.token);
      this.forkSimilarReport(this.reportVOToDetail(parentReportVO));
    }
    this.initialCompleted = true;
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'iconfont';  /* Project id 3294562 */
  src: url('//at.alicdn.com/t/font_3294562_dkzn7s54qd9.woff2?t=1648745176378') format('woff2'),
  url('//at.alicdn.com/t/font_3294562_dkzn7s54qd9.woff?t=1648745176378') format('woff'),
  url('//at.alicdn.com/t/font_3294562_dkzn7s54qd9.ttf?t=1648745176378') format('truetype');
}

.iconfont {
  font-family:"iconfont" !important;
  font-size:1rem; font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.projectForm{
  width: 90%;
  margin: 2em 3% 4em 7%;
  background: #fff;
  padding: 80px 40px;
  border-radius: 10px;
}

.flex-container {
  display: flex;
}

.report-edit-container {
  flex: 1 0 50%;
}

.similar-list-container {
  position: relative;
  flex: 1 0 50%;
}

.similar-list-inner-container {
  position: relative;
  width: 90%;
  margin: 2em 7% 4em 3%;
  background: #fff;
  padding: 80px 40px;
  border-radius: 10px;
}

.similar-list-table {
  margin-top: 2em;
  width: 100%;
}

.background-image-container {
  position: absolute;
  bottom: 2em;
  z-index: -10;
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

#aside-starter{
  position: absolute;
  top: 3em;
  right: 3em;
  z-index: 100;
  color: white;
}

.tip-item {
  margin: 4px;
}

.center {
  text-align: center;
}
</style>