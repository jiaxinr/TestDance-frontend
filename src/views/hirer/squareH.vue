<template>
  <div>
    <navigation-bar></navigation-bar>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>

      <el-button type="primary" round v-if="this.$store.state.role==='HIERE'" @click="gotoRelease" style="float: right;margin-top: 8px;margin-right: 8px">
        <i class="el-icon-circle-plus" id="addTask">发布新任务</i>
      </el-button>
    <br>
    <div class="el-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>任务广场</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="align-center-70">

      <div class="carousel-container" v-if="this.imageList.length > 0">
        <div style="display: flex; justify-content: center"><el-image style="position: static;" v-if="this.taskSquareLogo" :src="this.taskSquareLogo"></el-image></div>
        <br>
        <el-carousel type="card" :interval="5000" trigger="click" :height="cardHeight">
          <el-carousel-item v-for="item in sloganList" :key="item">
            <el-card :body-style="{ padding: '2em' }" shadow="always" class="card" id="temp">
              <el-image :src="imageList[Math.floor(Math.random() * imageList.length)]"></el-image>
              <br>
              <h1 style="color: #F9F9F9" align="center">{{ item }}</h1>
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </div>

    <div style="margin-top: 10px; margin-bottom: 10px">
      任务状态：
      <el-radio-group v-model="stateRadio" size="small" @change="stateChange">
        <el-radio-button v-for="state in taskStates" :label="state.value" :key="state.value">{{state.text}}</el-radio-button>
      </el-radio-group>
    </div>
    <el-collapse v-model="activeNames"
                 style="position:relative;padding-bottom:10px;">
      <el-collapse-item name="1" >
        <template slot="title">
          <span style="margin-left: 0.5em;font-weight: bold">高级筛选</span>
        </template>
        <div style="margin-left: 0.5em">
        <b>系统类型：</b>
        <el-checkbox-group v-model="deviceList">
          <el-checkbox label=0>web</el-checkbox>
          <el-checkbox label=1>IOS</el-checkbox>
          <el-checkbox label=2>Android</el-checkbox>
          <el-checkbox label=3>小程序/公众号</el-checkbox>
          <el-checkbox label=4>windows客户端</el-checkbox>
          <el-checkbox label=5>macOS客户端</el-checkbox>
          <el-checkbox label=6>linux客户端</el-checkbox>
          <el-checkbox label=7>其他</el-checkbox>
        </el-checkbox-group>
        <br>
        <b>测试类型：</b>
        <el-checkbox-group v-model="typeList">
          <el-checkbox label=0>功能测试</el-checkbox>
          <el-checkbox label=1>安全性测试</el-checkbox>
          <el-checkbox label=2>兼容性测试</el-checkbox>
          <el-checkbox label=3>性能测试</el-checkbox>
        </el-checkbox-group>
        <br>
        </div>
<!--        <b>发布时间：</b>-->
<!--        <el-checkbox-group v-model="checkList">-->
<!--          <el-checkbox label="24小时内"></el-checkbox>-->
<!--          <el-checkbox label="3天内"></el-checkbox>-->
<!--          <el-checkbox label="1个月内"></el-checkbox>-->
<!--        </el-checkbox-group>-->
        <el-button type="primary" size="small" @click="handleProjectSelect" style="position: relative;left: 90%">确认</el-button>
      </el-collapse-item>
    </el-collapse>
    </div>

    <el-table
        ref="filterTable"
        :data="tableData.slice(pageCurrent * pageSize, (pageCurrent+1) * pageSize)"
        @row-click="gotoTaskDetail"
        style="width: 70%;text-align:center;margin: auto;border:10px">
      <el-table-column
          prop="date"
          label="发布日期"
          width="180"
          sortable
          column-key="date">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称">
      </el-table-column>
      <el-table-column
          prop="curr"
          label="已有人数"
          width="100">
      </el-table-column>
      <el-table-column
          prop="total"
          label="共需人数"
          width="100">
      </el-table-column>
      <el-table-column
          prop="kind"
          label="类型"
          width="150">
      </el-table-column>
      <el-table-column
          label="状态"
          width="100">
        <template slot-scope="scope">
          <el-tag size=""
                  :type="scope.row.status === '进行中' ? 'success' : 'info'"
                  disable-transitions>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    <el-table-column
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button style="float: right; padding: 8px 8px 8px;background-color:#D4E6F1" type="button" @click.native="toTaskDetail($event, scope.row.pid)">查看详细信息</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div display="inline-block" style="margin-top: 8px;color: #555555;position: absolute;right: 18%">
      共 {{ total }} 条，当前显示 {{ currentViewCount }} 条
    </div>
    <br><br>
    <el-pagination
        display="inline-block"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        style="float:right;margin-right: 15%; margin-bottom: 3em">
    </el-pagination>
  </div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {getProjectListByFilter} from "@/api/project";
import {stateMap, testTypeMap, imageList} from "@/main";
import taskSquareLogo from "/public/taskSquareLogo.png"

const taskState=[
  {
    text: '全部',
    value: -1
  },
  {
    text: '进行中',
    value: 0
  },
  {
    text: '已结束',
    value: 1
  }
]

const sloganList = [
    "开放、进阶、智能",
    "工人群体智能汇聚",
    "测试结果评价机制",
    "测试结果聚合优化",
    "现代化、自动化",
    "Think Different",
    "更高、更快、更强",
    "人人都是试金石",
    "强得很",
    "自我再飞跃"
];

export default {
  name: "squareH",

  components:{
    navigationBar,
  },

  data(){
    return{
      value1:false,
      stateRadio:-1,
      activeNames:[''],
      deviceList: ["0", "1", "2", "3", "4", "5", "6", "7"],
      typeList: ["0", "1", "2", "3"],
      taskStates:taskState,
      tableData:[],
      pageSize: 10,
      pageCurrent: 0,
      total: 0,
      imageList: [],
      taskSquareLogo: taskSquareLogo,
      sloganList: sloganList
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
    },

    cardHeight() {
      return "470px";
    }
  },

  methods:{
    handleChange(val){
      console.log(val);
    },
    gotoRelease(){
      this.$router.push('./taskRelease');
    },
    toTaskDetail(e, pid) {
      this.$router.push(`/taskDetailH/${pid}`)
    },
    gotoTaskDetail(row) {
      this.$router.push(`/taskDetailH/${row.pid}`);
    },
    handleCurrentChange(val) {
      this.pageCurrent = val - 1;
      console.log(val);
    },
    async stateChange(state) {
      const res = await getProjectListByFilter(this.deviceList, this.typeList, state, 1);
      this.total = res.total;
      const projectListPage1 = res.list;
      this.tableData.splice(0, this.tableData.length);
      projectListPage1.forEach(project => this.projectTransferAndAdd(project));
    },
    async handleProjectSelect() {
      const res = await getProjectListByFilter(this.deviceList, this.typeList, this.stateRadio, 1);
      this.total = res.total;
      const projectListPage1 = res.list;
      this.tableData.splice(0, this.tableData.length);
      projectListPage1.forEach(project => this.projectTransferAndAdd(project));
    },
    projectTransferAndAdd(project) {
      this.tableData.push({
        pid: project.pid,
        date: (new Date(project.releaseTime)).formatting("yyyy-MM-dd"),
        name: project.projectName,
        curr: project.workerCurrent,
        total: project.workerLimit,
        kind: testTypeMap[project.testType],
        status: stateMap[project.state],
        // detail: <el-button style="float: right; padding: 8px 8px 8px;background-color:#D4E6F1" type="button">查看详细信息</el-button>
      });
    }
  },

  async mounted() {
    if (this.$store.getters.isLogin === false || (this.$store.state.role !== 'HIRER' && this.$store.state.role !== 'ADMIN')) {
      await this.$router.push('/login');
    }
    const res = await getProjectListByFilter(this.deviceList, this.typeList, this.stateRadio, 1);
    this.total = res.total;
    const projectListPage1 = res.list;
    projectListPage1.forEach(project => this.projectTransferAndAdd(project));
    this.imageList = imageList;
  }
}
</script>

<style scoped>
#addTask {
  font-size: 20px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.carousel-container {
  padding: 0 3em 1em 3em;
  background-color: white;
  border-radius: 0.5em;
}

.card {
  /*background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);*/
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
.el-collapse >>> .el-collapse-item {background-color: #D4E6F1 !important}
.el-collapse-item >>> .el-collapse-item__header {background-color: #fff !important}
.el-collapse-item >>> .el-collapse-item__wrap {background-color: #fff !important}
</style>