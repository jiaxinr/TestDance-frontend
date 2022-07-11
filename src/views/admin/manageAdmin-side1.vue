<template>
<div>
  <navigation-bar></navigation-bar>
  <div class="el-breadcrumb">
    <br>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理 - 所有项目</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-container>
    <el-aside>
      <el-row class="tac" style="margin-top: 77px">
        <el-menu ref="menu"
                 router
                 default-active="/manageAdmin-side1"
                 class="el-menu-vertical-demo">
          <el-menu-item index="/manageAdmin-side1">
            <i class="el-icon-menu"></i>
            <span slot="title">所有项目</span>
          </el-menu-item>

          <el-menu-item index="/manageAdmin-side2">
            <i class="el-icon-menu"></i>
            <span slot="title">推荐系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-row>
    </el-aside>
    <el-main>
      <div style="margin-top: 10px;margin-bottom: 10px">
        任务状态：
        <el-radio-group v-model="stateRadio" size="small" @change="stateChange">
          <el-radio-button v-for="state in taskStates" :label="state.value" :key="state.value">{{state.text}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table
          @row-click="gotoDetailManage"
          ref="filterTable"
          :data="tableData.slice(pageCurrent * pageSize, (pageCurrent+1) * pageSize)"
          style="width: 100%;padding: 3px">
        <el-table-column
            prop="date"
            label="日期"
            sortable
            width="180"
            column-key="date">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            width="280">
        </el-table-column>
        <el-table-column
            prop="curr"
            label="已有人数"
            width="120">
        </el-table-column>
        <el-table-column
            prop="total"
            label="共需人数"
            width="120">
        </el-table-column>
        <el-table-column
            prop="kind"
            label="类型"
            width="200">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="200">
        </el-table-column>
        <el-table-column
            prop="detail"
            name=""
            width="200">
        </el-table-column>
      </el-table>
      <div display="inline-block" style="margin-top: 8px;color: #555555">
        共 {{ total }} 条，当前显示 {{ currentViewCount }} 条
      </div>
      <el-pagination
          display="inline-block"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          style="float: right; margin-top: 8px">
      </el-pagination>
    </el-main>
<!--    <el-main>-->
<!--      <h2>SET SET SET</h2>-->
<!--    </el-main>-->
  </el-container>
</div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {getProjectListByFilter} from "@/api/project";
import {stateMap, testTypeMap} from "@/main";

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

export default {
  name: "manageAdmin-side1",

  components: {navigationBar},

  data() {
    return {
      taskStates: taskState,
      stateRadio:-1,
      tableData: [],
      pageSize: 10,
      pageCurrent: 0,
      total: 0,
      deviceList: ["0", "1", "2", "3", "4", "5", "6", "7"],
      typeList: ["0", "1", "2", "3"]
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
    }
  },

  methods: {
    gotoDetailManage(row) {
      const pid = row.pid;
      this.$router.push(`./manageDetailA-side1/${pid}`)
    },

    handleCurrentChange(val) {
      this.pageCurrent = val - 1;
      console.log(val);
    },

    async stateChange() {
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
      });
    }
  },

  async mounted() {
    if (this.$store.getters.isLogin === false || this.$store.state.role !== 'ADMIN') {
      await this.$router.push('/login');
    }
    const res = await getProjectListByFilter(this.deviceList, this.typeList, this.stateRadio, 1);
    this.total = res.total;
    const projectListPage1 = res.list;
    projectListPage1.forEach(project => this.projectTransferAndAdd(project));
  }
}
</script>

<style scoped>

</style>