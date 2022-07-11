<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="el-breadcrumb">
      <br>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>社区服务 | 为你推荐</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="ctn" style="display: inline-block">
      <a href="./community-side1" class="button b-green"><i class="el-icon-medal-1"></i> 为你推荐</a>
    </div>
    <div class="ctn" style="display: inline-block">
      <a href="./community-side2" class="button b-green"><i class="el-icon-s-opportunity"></i> 潜力协作</a>
    </div>
    <div class="ctn" style="display: inline-block">
      <a href="./community-side3" class="button b-green"><i class="el-icon-s-marketing"></i> 系统概览</a>
    </div>

    <div class="recommendPart">
      <div class="flip"
           @click="function (){gotoPro(tableData[0].pid)}">
        <div class="front"
             style="background-image: url(https://box.nju.edu.cn/f/f210881f621d4cd89353/?dl=1)">
          <h1 class="text-shadow">{{ this.tableData[0].name }}</h1>
        </div>
        <div class="back">
          <h2>{{ this.tableData[0].name }}</h2>
          <b>招募上限：</b> {{this.tableData[0].total}}人
          <p>{{ this.tableData[0].intro }}</p>
        </div>
      </div>

      <div class="flip"
           @click="function (){gotoPro(tableData[1].pid)}">
        <div class="front"
             style="background-image: url(https://box.nju.edu.cn/f/7ecbb4b04a3f4361b678/?dl=1)">
          <h1 class="text-shadow">{{ this.tableData[1].name }}</h1>
        </div>
        <div class="back">
          <h2>{{ this.tableData[1].name }}</h2>
          <b>招募上限：</b> {{this.tableData[1].total}}人
          <p>{{ this.tableData[1].intro }}</p>
        </div>
      </div>

      <div class="flip"
           @click="function (){gotoPro(tableData[2].pid)}">
        <div class="front"
             style="background-image: url(https://box.nju.edu.cn/f/07b6bba609bf476d854d/?dl=1)">
          <h1 class="text-shadow">{{ this.tableData[2].name }}</h1>
        </div>
        <div class="back">
          <h2>{{ this.tableData[2].name }}</h2>
          <b>招募上限：</b> {{this.tableData[2].total}}人
          <p>{{ this.tableData[2].intro }}</p>
        </div>
      </div>
    </div>
    <br><br><br>
    <div class="recommendPart2">
      <div class="flip"
           @click="function (){gotoPro(tableData[3].pid)}">
        <div class="front"
             style="background-image: url(https://box.nju.edu.cn/f/33ee4a56276d42edad5e/?dl=1)">
          <h1 class="text-shadow">{{ this.tableData[3].name }}</h1>
        </div>
        <div class="back">
          <h2>{{ this.tableData[3].name }}</h2>
          <b>招募上限：</b> {{this.tableData[3].total}}人
          <p>{{ this.tableData[3].intro }}</p>
        </div>
      </div>

      <div class="flip"
           @click="function (){gotoPro(tableData[4].pid)}">
        <div class="front"
             style="background-image: url(https://box.nju.edu.cn/f/87ab711fedd141b989f4/?dl=1)">
          <h1 class="text-shadow">{{ this.tableData[4].name }}</h1>
        </div>
        <div class="back">
          <h2>{{ this.tableData[4].name }}</h2>
          <b>招募上限：</b> {{this.tableData[4].total}}人
          <p>{{ this.tableData[4].intro }}</p>
        </div>
      </div>

      <div class="flip"
           @click="function (){gotoPro(tableData[5].pid)}">
        <div class="front"
             style="background-image: url(https://box.nju.edu.cn/f/9ae539b6cca3468498c1/?dl=1)">
          <h1 class="text-shadow">{{ this.tableData[5].name }}</h1>
        </div>
        <div class="back">
          <h2>{{ this.tableData[5].name }}</h2>
          <b>招募上限：</b> {{this.tableData[5].total}}人
          <p>{{ this.tableData[5].intro }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {getRecommendProject} from "@/api/recommend";
import {stateMap, testTypeMap, deviceMap} from "@/main";

export default {
  name: "community-side1",
  async mounted() {
    if (this.$store.getters.isLogin === false) {
      await this.$router.push('/login');
    }
    const token = this.$store.state.token;
    const uid = this.$store.state.uid;
    console.log("uid:" + uid);
    const res = await getRecommendProject(uid, token);
    console.log("res:" + JSON.stringify(res[5]));
    for (let i = 0; i < 6; i++) {// todo 目前限定只能推荐六个，后续再扩展（不知道背景图咋扩展）
      this.projectTransferAndAdd(res[i]);
    }
  },
  data() {
    return {
      tableData: [],
      rowNum: 3,
    }
  },
  methods: {
    projectTransferAndAdd(project) {
      console.log("hi")
      this.tableData.push({
        pid: project.pid,
        uid: project.uid,
        name: project.projectName,
        status: stateMap[project.state],
        kind: testTypeMap[project.testType],
        testDevice: deviceMap[project.testDevice],
        total: project.workerLimit,
        curr: project.workerCurrent,
        date: (new Date(project.releaseTime)).formatting("yyyy-MM-dd"),
        address: project.projectAddress,
        exeURL: project.excuteFileUrl,
        desURL: project.descriptionFileUrl,
        grade: project.gradeRequirement,
        reward: project.reward,
        intro: project.introduction,
        remark: project.testRemark,
      });
      console.log(this.tableData[0])
    },
    gotoPro(pid) {
      const ppid=pid;
      console.log("看看tableData："+this.tableData);
      if (this.$store.state.role === 'WORKER' || this.$store.state.role === 'ADMIN') {
        this.$router.push(`/taskDetailP/${ppid}`);
      } else if (this.$store.state.role === "HIRER") {
        this.$router.push(`/taskDetailH/${ppid}`);
      } else {
        this.$router.push(`/login`);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono');
@import url("https://fonts.googleapis.com/css?family=Roboto:100");
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=ZCOOL+QingKe+HuangYou&display=swap');

h1 {
  font-size: 2.2em;
}

.flip {
  position: relative;

  > .front,
  > .back {
    display: block;
    transition-timing-function: cubic-bezier(.175, .885, .32, 1.275);
    transition-duration: .5s;
    transition-property: transform, opacity;
  }

  > .front {
    transform: rotateY(0deg);
  }

  > .back {
    position: absolute;
    opacity: 0;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    transform: rotateY(-180deg);
  }

  &:hover {
    > .front {
      transform: rotateY(180deg);
    }

    > .back {
      opacity: 1;
      transform: rotateY(0deg);
    }
  }

  &.flip-vertical {
    > .back {
      transform: rotateX(-180deg);
    }

    &:hover {
      > .front {
        transform: rotateX(180deg);
      }

      > .back {
        transform: rotateX(0deg);
      }
    }
  }
}

.flip {
  position: relative;
  display: inline-block;
  margin-right: 2px;
  margin-bottom: 1em;
  width: 400px;

  > .front,
  > .back {
    display: block;
    color: white;
    width: inherit;
    background-size: cover !important;
    background-position: center !important;
    height: 220px;
    padding: 1em 2em;
    background: #313131;
    border-radius: 10px;

    p {
      font-size: 0.9125rem;
      line-height: 160%;
      color: #999;
    }
  }
}

.text-shadow {
  text-shadow: 1px 1px rgba(0, 0, 0, 0.04), 2px 2px rgba(0, 0, 0, 0.04), 3px 3px rgba(0, 0, 0, 0.04), 4px 4px rgba(0, 0, 0, 0.04), 0.125rem 0.125rem rgba(0, 0, 0, 0.04), 6px 6px rgba(0, 0, 0, 0.04), 7px 7px rgba(0, 0, 0, 0.04), 8px 8px rgba(0, 0, 0, 0.04), 9px 9px rgba(0, 0, 0, 0.04), 0.3125rem 0.3125rem rgba(0, 0, 0, 0.04), 11px 11px rgba(0, 0, 0, 0.04), 12px 12px rgba(0, 0, 0, 0.04), 13px 13px rgba(0, 0, 0, 0.04), 14px 14px rgba(0, 0, 0, 0.04), 0.625rem 0.625rem rgba(0, 0, 0, 0.04), 16px 16px rgba(0, 0, 0, 0.04), 17px 17px rgba(0, 0, 0, 0.04), 18px 18px rgba(0, 0, 0, 0.04), 19px 19px rgba(0, 0, 0, 0.04), 1.25rem 1.25rem rgba(0, 0, 0, 0.04);
}

.recommendPart {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  position: relative;
  top: 35px;
}

.recommendPart2 {
  display: flex;
  justify-content: center;
}

body, .button:after {
  background: #e4fbfb;
}

.ctn {
  position: relative;
  top: 30px;
}

.b-green, .b-green:before {
  background: rgba(73, 155, 234, 1);
  background: -moz-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: -webkit-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: -o-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: -ms-linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  background: linear-gradient(45deg, rgba(73, 155, 234, 1) 0%, rgba(26, 188, 156, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#499bea', endColorstr='#1abc9c', GradientType=1);
}

.button {
  display: inline-block;
  position: relative;
  border-radius: 3px;
  text-decoration: none;
  padding: .5em;
  margin: .5em;
  font-size: 2em;
  font-weight: bold;
  transition: all .5s;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Permanent Marker', cursive;
}

.button:hover {
  text-shadow: 0px 0px 0px rgba(255, 255, 255, .75);
}

.button:hover:after {
  left: 100%;
  top: 100%;
  bottom: 100%;
  right: 100%;
}

.button:before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  border-radius: 5px;
  transition: all .5s;
}

.button:after {
  content: '';
  display: block;
  position: absolute;
  left: 2px;
  top: 2px;
  bottom: 2px;
  right: 2px;
  z-index: -1;
  border-radius: 5px;
  transition: all .5s;
}

/*ROTATE*/
.rot-360-noscoop:hover {
  filter: hue-rotate(360deg);
  transform: rotate(360deg);
}

.rot-135:hover {
  filter: hue-rotate(135deg);
}

.rot-90:hover {
  filter: hue-rotate(90deg);
}
</style>