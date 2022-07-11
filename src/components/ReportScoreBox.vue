<template>
<div class="box-container">
  <div class="box-item">
    <div class="item-label">描述是否准确无歧义</div><el-rate class="item-score" v-model="accuracy"></el-rate>
  </div>
  <div class="box-item">
    <div class="item-label">描述是否简洁精炼</div><el-rate class="item-score" v-model="conciseness"></el-rate>
  </div>
  <div class="box-item">
    <div class="item-label">是否有清晰步骤词</div><el-rate class="item-score" v-model="stepword"></el-rate>
  </div>
  <div class="box-item">
    <div class="item-label">整体综合评分</div><el-rate class="item-score" v-model="overall"></el-rate>
  </div>
  <div class="box-item">
    <div class="item-label"><span class="label-text">短评(可选)</span></div><el-input
      class="item-input"
      type="text"
      placeholder="请输入评价"
      v-model="comment"
      maxlength="30"
      show-word-limit
  ></el-input>
  </div>
</div>
</template>

<script>
export default {
  name: "ReportScoreBox",

  data() {
    return {
      accuracy: 0,
      conciseness: 0,
      stepword: 0,
      overall: 0,
      comment: "",
    }
  },

  computed: {
    score() {
      return this.accuracy*0.2 + this.conciseness*0.2 + this.stepword*0.1 + this.overall*0.5;
    }
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