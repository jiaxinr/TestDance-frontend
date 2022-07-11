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
              default-active="2"
              class="el-menu-vertical"
              style="margin-top: 77px">
            <br>
            <h3 style="position: relative;text-align: center">{{ projectInfo.projectName }}</h3><br>
            <div style="text-align: center">
              <el-button round size="mini" type="primary" @click="gotoManage">切换项目</el-button>
              <!--            todo 支持结束项目-->
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

            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">聚合报告</span>
            </el-menu-item>

            <el-menu-item index="3" @click="gotoSide3">
              <i class="el-icon-menu"></i>
              <span slot="title">报告可视化</span>
            </el-menu-item>
          </el-menu>
        </el-row>
        <div v-if="aggregationFlag">
          <!--        todo 问后端要接口-->
          <div style="color: gray;float: right">（右侧数字代表该聚类的主报告id）</div>
          <tree1 :pid="Number(pid)"></tree1>
        </div>
        <div v-else>
          请先点击上方按钮“报告融合”以获取聚类信息（如融合后未及时刷新，请稍后再试）
        </div>
      </el-aside>

      <el-main style="margin-top: 57px">
        <div class="main" v-if="aggregationFlag">
          <h1>聚类报告列表</h1>
          <br><br>
          <el-row type="flex" justify="space-around" v-for="rowIndex in this.rowCount" :key="rowIndex">
            <el-col :span="7" v-for="columnIndex in getSpecialRowColumnCount(rowIndex)"
                    :key="(rowIndex-1)*columnCount + columnIndex">
              <el-card :body-style="cardBodyStyleObj" shadow="hover"
                       @click.native="gotoReportDetailView((rowIndex-1)*columnCount + columnIndex - 1)">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
                  <p>聚类 {{ (rowIndex - 1) * columnCount + columnIndex }} </p>
                  <p style="font-size: 0.8em;padding-right: 2em">聚合报告数
                    {{ rootReportList[(rowIndex - 1) * columnCount + columnIndex - 1]['num'] }}</p>
                </div>
                <div class="card-detail">
                  <h4 class="card-detail-item">
                    主报告标题：
                    {{ rootReportList[(rowIndex - 1) * columnCount + columnIndex - 1]['reportVO']['bugName'] }}
                  </h4>
                  <p style="font-size: 0.8em;" class="card-detail-item card-detail-text">
                    关键词：
                    {{ topic[(rowIndex - 1) * columnCount + columnIndex - 1] }}
                  </p>
                  <el-image
                      v-if="urlCompleteFlag"
                      class="card-detail-item card-detail-image" fit="contain"
                      :src="rootReportList[(rowIndex-1)*columnCount + columnIndex - 1]['reportVO']['wordcloudUrl']">
                  </el-image>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="main" v-else>
          <h1>聚类报告列表</h1>
          <br><br>
          <el-row type="flex" justify="space-around" v-for="rowIndex in this.rowCount" :key="rowIndex">
            <el-col :span="7" v-for="columnIndex in getSpecialRowColumnCount(rowIndex)" :key="(rowIndex-1)*columnCount + columnIndex">
              <el-card :body-style="cardBodyStyleObj" shadow="hover" @click.native="gotoReportDetailView2((rowIndex-1)*columnCount + columnIndex - 1)">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
                  <p>聚类 {{ (rowIndex-1)*columnCount + columnIndex }} </p>
                  <p style="font-size: 0.8em;padding-right: 2em">聚合报告数 {{ rootReportList[(rowIndex-1)*columnCount + columnIndex - 1]['num'] }}</p>
                </div>
                <div class="card-detail">
                  <h4 class="card-detail-item">{{ rootReportList[(rowIndex-1)*columnCount + columnIndex - 1]['reportVO']['bugName'] }}</h4>
                  <p style="font-size: 0.8em;" class="card-detail-item card-detail-text">{{ rootReportList[(rowIndex-1)*columnCount + columnIndex - 1]['reportVO']['bugDescription'] }}</p>
                  <el-image class="card-detail-item card-detail-image" fit="cover" :src="getRootReportImage2()"></el-image>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import tree1 from "@/components/tree/tree1";
import {closeProject, completion_degree, getProjectById} from "@/api/project";
import {cloudsword, getReportRoots, topicwords} from "@/api/tree";
import {updateFinalScore} from "@/api/quality";
import {aggregateReport, getAggregationReport} from "@/api/report";
import {imageList} from "@/main";

export default {
  name: "manageDetailH-side2",

  components: {
    navigationBar,
    tree1,
  },

  data() {
    return {
      initialCompleteFlag: false,

      columnCount: 3,

      rootReportList: [],
      tableData:[],

      cardBodyStyleObj: {
        padding: '0px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
      },

      projectInfo: null,
      compleDegree: 0,
      topic: [],
      urlCompleteFlag: false,
      aggregationFlag:false,
    }
  },

  props: {
    pid: String
  },

  computed: {
    rowCount() {
      return Math.ceil(this.rootReportList.length / this.columnCount)
    }
  },

  methods: {
    gotoManage() {
      if (this.$store.state.role === 'HIRER') {
        this.$router.push('/manageH-side1');
      } else {
        this.$router.push('/manageAdmin-side1')
      }
    },
    gotoSide1() {
      this.$router.push(`/manageDetailH-side1/${this.pid}`)
    },
    gotoSide3() {
      this.$router.push(`/manageDetailH-side3/${this.pid}`)
    },
    gotoReportDetailView(index) {
      const tid = this.rootReportList[index]['reportVO']['tid'];
      this.$router.push(`/reportCluster/${tid}`);
    },
    getSpecialRowColumnCount(rowIndex) {
      if (rowIndex * this.columnCount > this.rootReportList.length) {
        return this.rootReportList.length - (rowIndex - 1) * this.columnCount;
      } else {
        return this.columnCount;
      }
    },

    async getRootReportImage(index) {
      //console.log("index is:" + index);
      const img = await cloudsword(index);
      //console.log("url:"+img['url']);
      return img['url'];
    },
    closeProj() {
      closeProject(this.pid);
      this.$message({
        message: '已结束项目',
        type: 'success'
      });
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
    getRootReportList() {
      return this.rootReportList;
    },
    gotoReportDetailView2(index) {
      const tid = this.rootReportList[index]['reportVO']['tid'];
      this.$router.push(`/reportManage/${tid}`);
    },
    getRootReportImage2() {
      return imageList[Math.floor(Math.random() * imageList.length)];
    },

  },

  async mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'HIRER' && this.$store.state.role !== 'ADMIN')) {
      await this.$router.push('/login');
    }
    let tmp=await getAggregationReport(this.pid);
    if (tmp.clusterNum===0){
      this.aggregationFlag=false;
    }else {
      this.aggregationFlag=true;
    }
    this.projectInfo = await getProjectById(Number(this.pid));
    const res = await getReportRoots(Number(this.pid), this.$store.state.token);
    res.forEach((item) => this.rootReportList.push(item));
    for (let i = 0; i < this.rootReportList.length; i++) {
      this.topic.push(await topicwords(this.rootReportList[i]['reportVO']['tid']));
    }
    //this.topic.push(topicwords(this.rootReportList[(rowIndex-1)*columnCount + columnIndex - 1]['reportVO']['tid']));
    this.initialCompleteFlag = true;
    this.compleDegree = (await completion_degree(this.pid) * 100).toFixed(2);

    new Promise((resolve) => {
      const allRootCount = this.rootReportList.length;
      let completeCount = 0;
      this.rootReportList.forEach(async (rootReport, index, array) => {
        let url = await this.getRootReportImage(rootReport['reportVO']['tid']);
        array[index]['reportVO']['wordcloudUrl'] = url;
        completeCount += 1;
        if (completeCount === allRootCount) {
          resolve();
        }
      })
    }).then(() => {
      this.urlCompleteFlag = true;
    })
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