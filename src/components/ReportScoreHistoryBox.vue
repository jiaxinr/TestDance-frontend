<template>
  <div class="box-container">
    <div class="box-item">
      <div class="item-label">您的综合评分</div>
      <el-rate class="item-score" show-score v-model="myScore" disabled score-template="{value}"></el-rate>
    </div>
    <div class="box-item">
      <div class="item-label"><span class="label-text">您的短评</span></div>
      <el-input
        class="item-input"
        type="textarea"
        placeholder="请输入评价"
        v-model="myComment"
        disabled
    ></el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReportScoreHistoryBox",

  data() {
    return {
      myScore: 0,
      myComment: "",
    }
  },

  props: {
    score: Number,
    comment: String
  },

  mounted() {
    this.myScore = this.score;
    this.myComment = this.comment === '' ? '您暂时没有评价' : this.comment;
  }
}
</script>

<style scoped>
.box-container {
  width: 80%;
  margin: 1em auto;
}
.box-item {
  margin-top: 1em;
  display: flex;
}

.box-item .item-label {
  flex: 1 0 40%;
  display: flex;
  align-items: center;
}

.box-item .item-score {
  flex: 1 0 40%;
}

.box-item .item-input {
  flex: 1 0 60%;
}

.item-label .label-text {

}
</style>