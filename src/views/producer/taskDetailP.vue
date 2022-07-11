<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/squareP`}">任务广场</el-breadcrumb-item>
        <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--    <el-container>-->
    <!--      <el-aside width="200px"><side-Bar></side-Bar></el-aside>-->
    <!--      <el-main>-->
    <el-card class="box-card" style="margin: 10px 50px;border-radius: 12px">
      <div slot="header" class="clearfix" style="margin-bottom: 20px">
        <span style="font-size: 20px"><h2>{{ this.projectName }}</h2></span><br>
        <button v-if="projectState === 1"
                style="padding: 8px 8px 8px;background-color:#D4E6F1;margin-top: 10px">
          该项目已经结束
        </button>
        <button v-else-if="isParticipate"
                style="padding: 8px 8px 8px;background-color:#D4E6F1;margin-top: 10px"
                @click="gotoManageDetail">
          管理任务
        </button>
        <button v-else
                style="padding: 8px 8px 8px;background-color:#D4E6F1;margin-top: 10px"
                @click="participateTask">
          报名任务
        </button>

        <div class="circle">
          <el-progress :show-text="false" :width="75" :stroke-width="8" type="circle"
                       :percentage="parseInt(this.workerRate * 100)">
          </el-progress>
          <div class="circleCenter">
            <div>{{ parseInt(this.workerRate * 100) }}%</div>
          </div>
        </div>
        <div style="position: relative;left: 80%">现有人数/所需人数：{{ this.workerCurrent }}/{{ this.workerLimit }}</div>

      </div>
      <div style="display: inline-block;font-family:STZhongsong">
        类型：{{ testType }}
      </div>
      <div style="display: inline-block;position: absolute;left: 350px;font-family:STZhongsong">
        任务发布时间：{{ (new Date(releaseTime)).formatting('yyyy-MM-dd') }}
      </div>
      <br>
      <div style="display: inline-block;font-family:STZhongsong">
        设备：{{ testDevice }}
      </div>
      <div style="display: inline-block;position:absolute;left: 350px;font-family:STZhongsong">
        任务截止时间：{{ (new Date(endTime)).formatting('yyyy-MM-dd') }}
      </div>
      <br>
      <div style="display: inline-block;font-family:STZhongsong">
        积分/等级要求：{{ gradeRequirement === 0 ? '暂无要求' : `不小于${gradeRequirement}级` }}
      </div>
      <div style="display: inline-block;position:absolute;left: 350px;font-family:STZhongsong">
        报酬单价：{{ reward }}元
      </div>
    </el-card>

    <el-card class="box-card" style="margin: 25px 50px;border-radius: 12px">
      <div slot="header" class="clearfix">
        <span><h2>任务详情</h2></span>
      </div>
      <el-divider content-position="left"><h3>简介：</h3></el-divider>
      <div class="detailContent">{{ (introduction === null || introduction === '') ? '暂无简介' : introduction }}</div>
      <el-divider content-position="left"><h3>备注：</h3></el-divider>
      <div class="detailContent">{{ (testRemark === null || testRemark === '') ? '暂无备注' : testRemark }}</div>
      <el-divider content-position="left"><h3>待测应用地址：</h3></el-divider>
      <div class="detailContent">
        {{ (projectAddress === null || projectAddress === '') ? '暂无待测应用地址' : projectAddress }}
      </div>
      <el-divider content-position="left"><h3>待测应用可执行文件：</h3></el-divider>
      <a :href="executeFileUrl" download="2">点击下载应用可执行文件</a>
      <el-divider content-position="left"><h3>需求描述文件：</h3></el-divider>
      <a v-if="(descriptionFileUrl!==null)" :href="descriptionFileUrl">点击下载需求描述文件</a>
      <a v-else>该项目没有需求描述文件</a>
    </el-card>
    <!--      </el-main>-->
    <!--  </el-container>-->
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {getProjectById, participateProject, checkParticipateState} from '@/api/project'
import {deviceMap, testTypeMap} from '@/main'
//import SideBar from "@/components/sideBar";
export default {
  name: "taskDetailP",
  // components: {SideBar},
  components: {
    navigationBar,
  },
  props: {
    pid: String
  },
  data() {
    return {
      isParticipate: false,
      projectName: '',
      projectState: 0,
      testType: '',
      testDevice: '',
      gradeRequirement: 0,
      releaseTime: 0,
      endTime: 0,
      reward: 0,
      workerLimit: 0,
      workerCurrent: 0,
      introduction: '',
      testRemark: '',
      projectAddress: '',
      executeFileUrl: '',
      descriptionFileUrl: ''
    }
  },

  methods: {
    gotoManageDetail() {
      this.$router.push(`/manageDetailP-side1/${this.pid}`);
    },
    async participateTask() {
      if (this.$store.getters.isLogin === true) {
        await participateProject(this.$store.state.uid, this.pid, this.$store.state.token);
        this.isParticipate = 1;
        this.$message({
          message: '报名成功！请按时完成任务！',
          type: 'success'
        });
        await this.$router.push(`/manageDetailP-side1/${this.pid}`);
      } else {
        await this.$router.push('/login');
      }
    },
    downloadEX() {
      window.location.href = this.executeFileUrl;
    },
    downloadEvt(url, fileName = '123321') {
      const el = document.createElement('a');
      el.style.display = 'none';
      el.setAttribute('target', '_blank');
      /**
       * download的属性是HTML5新增的属性
       * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
       * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
       * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
       */
      fileName && el.setAttribute('download', fileName);
      el.href = url;
      console.log(el);
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    }
  },

  computed: {
    workerRate() {
      const rate = this.workerCurrent / this.workerLimit;
      return rate > 1 ? 1 : rate;
    }
  },

  async mounted() {
    const projectInfo = await getProjectById(this.pid);
    this.projectName = projectInfo.projectName;
    this.projectState = projectInfo.state;
    this.testType = testTypeMap[projectInfo.testType];
    this.testDevice = deviceMap[projectInfo.testDevice];
    this.gradeRequirement = projectInfo.gradeRequirement;
    this.releaseTime = projectInfo.releaseTime;
    this.endTime = projectInfo.endTime;
    this.reward = projectInfo.reward;
    this.workerLimit = projectInfo.workerLimit;
    this.workerCurrent = projectInfo.workerCurrent;
    this.introduction = projectInfo.introduction;
    this.testRemark = projectInfo.testRemark;
    this.projectAddress = projectInfo.projectAddress;
    this.executeFileUrl = projectInfo.excuteFileUrl;
    this.descriptionFileUrl = projectInfo.descriptionFileUrl;
    if (this.$store.getters.isLogin) {
      const uid = this.$store.state.uid;
      const pid = this.pid;
      const token = this.$store.state.token
      const isParticipate = (await checkParticipateState(uid, pid, token)).success;
      this.isParticipate = isParticipate;
    } else {
      this.isParticipate = false;
    }
  }
}
</script>

<style scoped>
.circle {
  position: relative;
  left: 85%;
  bottom: 80px;
  margin-bottom: -70px;
  text-align: center;
  width: 2px;
}

.circleCenter {
  position: absolute;
  top: 26px;
  left: 23px;
}

.detailContent {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .4);
  margin: 5px;
  padding: 10px;
}

.el-card__header {
  padding: 18px 20px 0;
}

.clearfix {
  padding-bottom: 0;
}

</style>