import Vue from 'vue'
import VueRouter from 'vue-router'
//import APP from "@/APP";

// import Home from '../src/components/tree'
import Home from "../src/views/home2"//主页
import Login from '../src/views/login'//登录
import Register from '../src/views/register'//注册
import PersonInfo from "@/views/personInfo";//个人信息修改界面
//import PersonInfoShow from '../src/views/personInfoShow'//个人信息展示界面
import SquareH from '../src/views/hirer/squareH'//发包方广场
import SquareP from '../src/views/producer/squareP'//众包工人广场
import TaskRelease from '../src/views/hirer/taskRelease'//发包方发布新任务
import TaskDetailH from '../src/views/hirer/taskDetailH'//发包方任务详情
import TaskDetailP from '../src/views/producer/taskDetailP'//众包工人任务详情
import ManageHSide1 from '../src/views/hirer/manageH-side1'//发包方管理页面，第一个侧边栏展开（某人的拥有的所有任务列表）
import ManageHSide2 from '../src/views/hirer/manageH-side2'//同上，第二个侧边栏展开（迭代一暂时不用）
import ManageDetailHSide1 from '@/views/hirer/manageDetailH-side1'//发包方管理具体任务（所有报告）
import ManageDetailHSide2 from '@/views/hirer/manageDetailH-side2'//发包方管理具体任务（聚合报告）
import ManageDetailHSide3 from '@/views/hirer/manageDetailH-side3'//发包方管理具体任务（报告可视化）
import ManagePSide1 from '../src/views/producer/manageP-side1'//众包工人管理页面，第一个侧边栏展开
import ManagePSide2 from '../src/views/producer/manageP-side2'//同上，第二个侧边栏展开
import ManageDetailPSide1 from '@/views/producer/manageDetailP-side1'//众包工人管理具体任务（所有报告）
import ManageDetailPSide2 from '@/views/producer/manageDetailP-side2'//众包工人管理具体任务（聚合报告）
import ManageDetailPSide3 from '@/views/producer/manageDetailP-side3'//众包工人管理具体任务（报告可视化）
import ManageDetailPSide4 from '@/views/producer/manageDetailP-side4'//众包工人管理具体任务（低质量报告）
import ReportManage from '@/views/report/reportManage'//所有人查看特定项目的缺陷报告
import ReportRelease from '../src/views/producer/reportRelease'//众包工人提交缺陷报告
import ReportSupp from '../src/views/report/reportSupplement'//查看特定项目的补充说明报告
import ReportSimilar from '../src/views/report/reportSimilar'//查看特定项目的相似报告
import CommunitySide1 from '@/views/community-side1'//任务推荐板块
import CommunitySide2 from '@/views/community-side2'//低质量报告推荐协作板块
import CommunitySide3 from '@/views/community-side3'//系统概览图表板块
import ManageAdminSide1 from '../src/views/admin/manageAdmin-side1'//管理员管理页面，第一个侧边栏展开（所有任务列表）
import ManageAdminSide2 from '../src/views/admin/manageAdmin-side2'//管理员管理界面，第二个侧边栏展开（推荐系统设置）
import ReportCluster from '../src/views/report/reportCluster'//融合后报告
import ManageDetailASide1 from '@/views/admin/manageDetailA-side1'//管理员管理具体任务（所有报告）
import NewMessage from "@/views/newMessage";

//import Tree from '@/components/tree/tree'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/personInfo',
        name: 'PersonInfo',
        component: PersonInfo
    },
    {
        path: '/squareH',
        name: 'SquareH',
        component: SquareH
    },
    {
        path: '/squareP',
        name: 'SquareP',
        component: SquareP
    },
    {
        path: '/taskRelease',
        name: 'TaskRelease',
        component: TaskRelease,
    },
    {
        path: '/taskDetailH/:pid',
        name: 'TaskDetailH',
        component: TaskDetailH,
        props: true
    },
    {
        path: '/taskDetailP/:pid',
        name: 'TaskDetailP',
        component: TaskDetailP,
        props: true
    },
    {
        path: '/manageH-side1',
        name: 'ManageH-side1',
        component: ManageHSide1
    },
    {
        path: '/manageH-side2',
        name: 'ManageH-side2',
        component: ManageHSide2
    },
    {
        path: '/manageDetailH-side1/:pid',
        name: 'ManageDetailH-side1',
        component: ManageDetailHSide1,
        props: true
    },
    {
        path: '/manageDetailH-side2/:pid',
        name: 'ManageDetailH-side2',
        component: ManageDetailHSide2,
        props: true
    },
    {
        path: '/manageDetailH-side3/:pid',
        name: 'ManageDetailH-side3',
        component: ManageDetailHSide3,
        props: true
    },
    {
        path: '/manageP-side1',
        name: 'ManageP-side1',
        component: ManagePSide1
    },
    {
        path: '/manageP-side2',
        name: 'ManageP-side2',
        component: ManagePSide2
    },
    {
        path: '/manageDetailP-side1/:pid',
        name: 'ManegeDetailP-side1',
        component: ManageDetailPSide1,
        props: true
    },
    {
        path: '/manageDetailP-side2/:pid',
        name: 'ManegeDetailP-side2',
        component: ManageDetailPSide2,
        props: true
    },
    {
        path: '/manageDetailP-side3/:pid',
        name: 'ManegeDetailP-side3',
        component: ManageDetailPSide3,
        props: true
    },
    {
        path: '/manageDetailP-side4/:pid',
        name: 'ManegeDetailP-side4',
        component: ManageDetailPSide4,
        props: true
    },
    {
        path: '/reportManage/:tid',
        name: 'ReportManage',
        component: ReportManage,
        props: true
    },
    {
        path: '/reportRelease/:pid',
        name: 'ReportRelease',
        component: ReportRelease,
        props: true
    },
    {
        path: '/personInfo/:uid',
        name: 'PersonInfo',
        component: PersonInfo,
        props: true
    },
    {
        path: '/reportSupp/:tid',
        name: 'ReportSupplement',
        component: ReportSupp,
        props: true
    },
    {
        path: '/reportSimilar/:tid',
        name: 'ReportSimilar',
        component: ReportSimilar,
        props: true
    },
    {
        path: '/community-side1',
        name: 'CommunitySide1',
        component: CommunitySide1,
    },
    {
        path: '/community-side2',
        name: 'CommunitySide2',
        component: CommunitySide2,
    },
    {
        path: '/community-side3',
        name: 'CommunitySide3',
        component: CommunitySide3,
    },
    {
        path: '/manageAdmin-side1',
        name: 'ManageAdminSide1',
        component: ManageAdminSide1
    },
    {
        path: '/manageAdmin-side2',
        name: 'ManageAdminSide2',
        component: ManageAdminSide2
    },
    {
        path: '/reportCluster/:tid',
        name: 'ReportCluster',
        component: ReportCluster,
        props: true
    },
    {
        path: '/manageDetailA-side1/:pid',
        name: 'ManageDetailA-side1',
        component: ManageDetailASide1,
        props: true
    },
    {
        path: '/newMessage/:uid',
        name: 'NewMessage',
        component: NewMessage,
        props: true
    },

]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router