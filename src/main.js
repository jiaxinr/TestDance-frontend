import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './APP.vue'
import router from '../router'
import store from '../store'
import vuetify from './plugins/vuetify'
import navigationBar from "@/components/navigationBar";
import tree1 from "@/components/tree/tree1";
import tree2 from "@/components/tree/tree2";
import tree3 from "@/components/tree/tree3";
import barGraph1 from "@/components/barGraph1";
import barGraph2 from "@/components/barGraph2";
import barGraph3 from "@/components/barGraph3";
import barGraph4 from "@/components/barGraph4";
import fullyConnectedGraph from "@/components/tree/fullyConnectedGraph";
import clusterSpots from "@/components/clusterSpots";
import reportClusterView from "@/components/reportClusterView";
//import $ from 'jquery'
import echarts from 'echarts'

import image00 from "/public/cardImage/item00.png"
import image01 from "/public/cardImage/item01.png"
import image02 from "/public/cardImage/item02.png"
import image03 from "/public/cardImage/item03.png"
import image04 from "/public/cardImage/item04.png"
import image05 from "/public/cardImage/item05.png"
import image06 from "/public/cardImage/item06.png"
import image07 from "/public/cardImage/item07.png"
import image08 from "/public/cardImage/item08.png"
import image09 from "/public/cardImage/item09.png"
import image10 from "/public/cardImage/item10.png"
import image11 from "/public/cardImage/item11.png"
import image12 from "/public/cardImage/item12.png"
import image13 from "/public/cardImage/item13.png"
import image14 from "/public/cardImage/item14.png"
import image15 from "/public/cardImage/item15.png"
import image16 from "/public/cardImage/item16.png"
import image17 from "/public/cardImage/item17.png"
import image18 from "/public/cardImage/item18.png"
import image19 from "/public/cardImage/item19.png"




Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(navigationBar);
Vue.use(store);

Vue.component('navigationBar',navigationBar);
Vue.component('proTree1',tree1);
Vue.component('proTree2',tree2);
Vue.component('proTree3',tree3);
Vue.component('barGraph1',barGraph1);
Vue.component('barGraph2',barGraph2);
Vue.component('barGraph3',barGraph3);
Vue.component('barGraph4',barGraph4);
Vue.component('fullyConnectedGraph',fullyConnectedGraph);
Vue.component('clusterSpots',clusterSpots);
Vue.component('reportClusterView',reportClusterView);
Vue.prototype.$echarts=echarts;


Date.prototype.formatting = function (fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

export const deviceMap = ['web','IOS','Android','小程序/公众号','windows客户端','macOS客户端','linux客户端','其他'];
export const testTypeMap = ['功能测试','安全性测试','兼容性测试','性能测试'];
export const stateMap = ['进行中', '已结束'];
export const auditStateMap = ['审核中', '审核通过', '审核驳回'];
export const imageList = [image00, image01, image02, image03, image04, image05, image06, image07, image08, image09, image10,
  image11, image12, image13, image14, image15, image16, image17, image18, image19]

const validTime = 1000 * 60 * 30; //valid time: 30 min

export function windowsStoreUserState(payload) {
  window.localStorage.setItem("TOKEN", payload.token);
  window.localStorage.setItem("uname", payload.uname);
  window.localStorage.setItem("uid", payload.uid);
  window.localStorage.setItem("role", payload.role);
  window.localStorage.setItem('avatar_url', payload.avatar_url);
  window.localStorage.setItem('grade', payload.grade);
  window.localStorage.setItem('last_update_time', Date.now());
}

export function windowsDeleteUserState() {
  window.localStorage.removeItem("TOKEN");
  window.localStorage.removeItem("uname");
  window.localStorage.removeItem("uid");
  window.localStorage.removeItem("role");
  window.localStorage.removeItem('avatar_url');
  window.localStorage.removeItem('grade');
  window.localStorage.removeItem('last_update_time');
}

export function windowsGetUserState() {
  return {
    token: window.localStorage.getItem('TOKEN'),
    uid: window.localStorage.getItem('uid'),
    role: window.localStorage.getItem('role'),
    uname: window.localStorage.getItem('uname'),
    avatar_url: window.localStorage.getItem('avatar_url'),
    grade: window.localStorage.getItem('grade')
  }
}

export function isWindowStoreValidUserState() {
  if (window.localStorage.getItem('TOKEN') === null ||
      window.localStorage.getItem('TOKEN') === '' ||
      (Date.now() - parseInt(window.localStorage.getItem('last_update_time')) > validTime)) {
    windowsDeleteUserState();
    return false;
  } else {
    return true;
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');

