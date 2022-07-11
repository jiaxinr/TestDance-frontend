<template>
  <div class="main">
    <h3>该项目还有这些测试报告评分较低，邀请您参与这些报告的协作，可以收获额外的薪酬与积分奖励喔 ~</h3>
    <br><br>
    <el-row type="flex"
            justify="space-around"
            v-for="rowIndex in this.rowCount"
            :key="rowIndex">
      <el-col :span="7"
              v-for="columnIndex in getSpecialRowColumnCount(rowIndex)"
              :key="(rowIndex-1)*columnCount + columnIndex">
        <el-card :body-style="cardBodyStyleObj"
                 shadow="hover"
                 @click.native="gotoReportDetailView((rowIndex-1)*columnCount + columnIndex - 1)">
          <div class="card-header"
               style="display: flex; justify-content: space-between; align-items: center">
            <p>低质量报告 {{ (rowIndex-1)*columnCount + columnIndex }} </p>
            <el-rate
                v-model="badReportList[(rowIndex-1)*columnCount + columnIndex - 1]['score']"
                disabled
                show-score
                text-color="#000"
                score-template="{value}">
            </el-rate>
          </div>
          <div class="card-detail">
            <h4 class="card-detail-item">
              {{ badReportList[(rowIndex-1)*columnCount + columnIndex - 1]['bugName'] }}
            </h4>
            <p style="font-size: 0.8em;"
               class="card-detail-item card-detail-text">
              {{ badReportList[(rowIndex-1)*columnCount + columnIndex - 1]['bugDescription'] }}
            </p>
            <el-image class="card-detail-item card-detail-image"
                      fit="cover"
                      :src="getRootReportImage((rowIndex-1)*columnCount + columnIndex - 1)">
            </el-image>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {imageList} from "@/main";
import {getProjectById} from "@/api/project";
import {getBadReportsByPid, getReportQuality} from "@/api/report";

export default {
  name: "AfterReportReleaseBox",

  props: {
    pid: Number
  },

  data() {
    return {
      columnCount: 3,

      badReportList: [],

      cardBodyStyleObj: {
        padding: '0px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
      },

      projectInfo: {},

    }
  },

  computed: {
    rowCount() {
      return Math.ceil(this.badReportList.length / this.columnCount)
    }
  },

  methods: {
    getSpecialRowColumnCount(rowIndex) {
      if (rowIndex*this.columnCount > this.badReportList.length) {
        return this.badReportList.length - (rowIndex-1)*this.columnCount;
      } else {
        return this.columnCount;
      }
    },

    getRootReportImage(index) {
      const reportImageList = this.badReportList[index]['screenshotUrlList'];
      if (reportImageList !== undefined && reportImageList !== null && reportImageList.length > 0) {
        return reportImageList[0];
      } else {
        return imageList[Math.floor(Math.random() * imageList.length)];
      }
    },

    gotoReportDetailView(index) {
      const tid = this.badReportList[index]['tid'];
      this.$router.push(`/reportManage/${tid}`);
    },
  },

  async mounted() {
    this.projectInfo = await getProjectById(Number(this.pid));
    const res = await getBadReportsByPid(Number(this.pid), this.$store.state.uid, this.$store.state.token);
    for (const item of res) {
      const reportQuality = await getReportQuality(item.tid, this.$store.state.token);
      item['score'] = Number(((reportQuality.autoScore + reportQuality.checkScore + reportQuality.validity) / 3).toFixed(2));
      this.badReportList.push(item);
    }
    this.initialCompleteFlag = true;
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