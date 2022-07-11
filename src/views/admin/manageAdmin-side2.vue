<template>
<div>
  <navigation-bar></navigation-bar>
  <div class="el-breadcrumb">
    <br>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="top: 10px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务管理 - 推荐系统设置</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-container>
    <el-aside>
      <el-row class="tac" style="margin-top: 77px">
        <el-menu ref="menu"
                 router
                 default-active="/manageAdmin-side2"
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
      <div class="form-container">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="最低等级">
          <el-select v-model="form.grade" placeholder="请选择最低等级">
            <el-option
                v-for="item in gradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最低工作年限">
          <el-select v-model="form.working_years" placeholder="请选择最低工作年限">
            <el-option
                v-for="item in workingYearsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最低活跃度">
          <div class="block">
            <el-slider v-model="form.activity" show-input></el-slider>
          </div>
        </el-form-item>
        <el-form-item label="推荐任务类型">
          <el-checkbox-group v-model="form.typeList">
            <el-checkbox v-for="item in testTypeOptions" :label="item" :key="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推荐设备类型">
          <el-checkbox-group v-model="form.deviceList">
            <el-checkbox v-for="item in deviceOptions" :label="item" :key="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推荐职位类型">
          <el-checkbox-group v-model="form.positionList">
            <el-checkbox v-for="item in positionOptions" :label="item" :key="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推荐最大数量">
          <el-input-number v-model="form.max_size" :min="6" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item style="display: flex; justify-content: center">
          <el-button type="primary" @click="onSubmit" style="width: 10em;">立即修改</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-main>
  </el-container>
</div>
</template>

<script>
import navigationBar from "@/components/navigationBar";
import {changeRecommendSettings, getRecommendSettings} from "@/api/recommend";

export default {
  name: "manageAdmin-side2",

  components: {navigationBar},

  data() {
    return {
      form: {
        grade: 1,
        working_years: 0,
        activity: 50,
        typeList: [],
        deviceList: [],
        positionList: [],
        max_size: 10,
      },

      gradeOptions: [{
        value: 0,
        label: '不限'
      }, {
        value: 1,
        label: '1 > 一心一意'
      }, {
        value: 2,
        label: '2 > 再接再厉'
      }, {
        value: 3,
        label: '3 > 三省吾身'
      }, {
        value: 4,
        label: '4 > 名扬四海'
      }, {
        value: 5,
        label: '5 > 学富五车'
      }, {
        value: 6,
        label: '6 > 六韬三略'
      }, {
        value: 7,
        label: '7 > 七步才华'
      }, {
        value: 8,
        label: '8 > 才高八斗'
      }, {
        value: 9,
        label: '9 > 九天揽月'
      }, {
        value: 10,
        label: '10 > 十年磨剑'
      }],

      workingYearsOptions: [{
        value: 0,
        label: '不限'
      }, {
        value: 1,
        label: '一年以上'
      }, {
        value: 2,
        label: '两年以上'
      }, {
        value: 3,
        label: '三年以上'
      }, {
        value: 4,
        label: '四年以上'
      }, {
        value: 5,
        label: '五年以上'
      }],

      testTypeOptions: [
          '功能测试',
          '安全性测试',
          '兼容性测试',
          '性能测试',
      ],

      deviceOptions: [
          'Web',
          'IOS',
          'Android',
          'IpadOS',
          '小程序/公众号',
          'MacOS',
          'Linux',
          '其它'
      ],

      positionOptions: [
          '未知',
          '产品经理',
          '研发人员',
          '测试人员',
          '设计人员',
          '市场运营',
          '运维人员',
          '学校教师',
          '在校学生',
          '自由职业者',
          '其它职业'
      ]
    }
  },

  methods: {
    async onSubmit() {
      const settings = this.formData2SettingsVO();
      console.dir(settings);
      settings['token'] = this.$store.state.token;
      await changeRecommendSettings(settings);
      alert("修改成功");
    },

    settingsVO2FormData(settings) {
      this.form.grade = settings['grade'];
      this.form.working_years = settings['working_years'];
      this.form.activity = settings['activity'];
      for (const item of settings['typeList']) {
        this.form.typeList.push(this.testTypeOptions[item]);
      }
      for (const item of settings['deviceList']) {
        this.form.deviceList.push(this.deviceOptions[item]);
      }
      for (const item of settings['positionList']) {
        this.form.positionList.push(this.positionOptions[item]);
      }
      this.form.max_size = settings['max_size'];
    },

    formData2SettingsVO() {
      const settings = {};
      settings['activity'] = this.form.activity;
      settings['working_years'] = this.form.working_years;
      settings['grade'] = this.form.grade;
      settings['typeList'] = [];
      settings['deviceList'] = [];
      settings['positionList'] = [];
      for (const testType of this.form.typeList) {
        settings['typeList'].push(this.testTypeOptions.indexOf(testType));
      }
      for (const device of this.form.deviceList) {
        settings['deviceList'].push(this.deviceOptions.indexOf(device));
      }
      for (const position of this.form.positionList) {
        settings['positionList'].push(this.positionOptions.indexOf(position));
      }
      settings['max_size'] = this.form.max_size;
      return settings;
    }
  },

  async mounted() {
    if (this.$store.getters.isLogin === false || this.$store.state.role !== 'ADMIN') {
      await this.$router.push('/login');
    }
    const settings = await getRecommendSettings(this.$store.state.token);
    console.dir(settings);
    this.settingsVO2FormData(settings);
  }
}
</script>

<style scoped>
.form-container {
  width: 70%;
  margin: 57px auto 0 0;
  padding: 2em;
  background-color: white;
}
</style>