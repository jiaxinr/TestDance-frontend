import axios from "axios";
import {REPORT_MODULE, BEHAVIOR_MODULE, RECOMMEND_MODULE} from "@/api/_prefix";

/**
 * 得到单一报告的详细信息 GET ${REPORT_MODULE}/${rid}
 * @param rid
 */
export async function getReportById(tid, token) {
    console.log(tid);
    return await (axios.get(`${REPORT_MODULE}/${tid}`, {
        headers: {
            Authorization: token
        }
    }).then(
        res => {
            //console.log("here is success")
            return res.data;
        }
    ));
}

/**
 * 分页展示特定项目的报告列表 GET ${REPORT_MODULE}/${page}/${rid}
 * @param payload
 */
export async function getReportListByPID(payload) {
    const {page, pid, token} = payload;
    return await (axios.get(`${REPORT_MODULE}/project/${page}/${pid}`, {
        headers: {
            Authorization: token
        }
    }).then(res => res.data));
}

/**
 * 分页展示特定项目特定用户自己提交的的报告列表 GET ${REPORT_MODULE}/${page}/${rid}
 * @param payload
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getReportListByPIDAndUID(payload) {
    const {page, pid, uid, token} = payload;
    return await ((axios.get(`${REPORT_MODULE}/worker/${page}/${uid}/${pid}`, {
        headers: {
            Authorization: token
        }
    })).then(res => res.data));
}

/**
 * 创建报告 POST ${REPORT_MODULE}/create
 * @param payload
 */
export const createReport = payload => {
    console.log(payload);
    const {uid,pid,bugName,testDevice,state,submitTime,
    bugDescription,bugProcedure,screenshotUrlList,token,parentTid}=payload;
    return axios.post(`${REPORT_MODULE}/create`,{
        "reportVO": {
            uid,pid,bugName,testDevice,state,submitTime,
            bugDescription,bugProcedure,screenshotUrlList
        },
        "reportTreeNodeVO": {
            parentTid,
            pid
        }
    },{
        headers: {
            Authorization: token,
        }}).then(res=>{
        return res.data;
    })
}


/**
 * 获取用户行为: 点赞点踩状态、是否fork、评分、短评
 * @param payload{{uid: number, tid: default.reportProps.tid, token: string}}
 * @returns {comment,fork,id,isLike,score,tid,uid}
 */
export async function getUserReportBehavior(payload) {
    const {uid, tid, token} = payload;
    return await ((axios.get(`${BEHAVIOR_MODULE}/check/relations/${uid}/${tid}`, {
        headers: {
            Authorization: token
        }
    })).then(res => res.data));
}

/**
 * 更新用户点赞点踩行为（需要附带old的fork字段)
 * @param payload{{uid: number, isLike: (number), oldFork: *, tid: (*|number), token: string}}
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function updateUserReportLikeState(payload) {
    const {uid, tid, token, isLike, oldFork} = payload;
    return await axios.post(`${BEHAVIOR_MODULE}/like/report`, {
        uid: uid,
        tid: tid,
        fork: oldFork,
        isLike: isLike
    }, {
        headers: {
            Authorization: token,
        }
    }).then(res => {
        return res.data;
    })
}

/**
 * 更新用户是否fork行为（需要附带old的isLike字段)
 * @param payload{uid, tid, token, oldIsLike, fork}
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function updateUserReportForkState(payload) {
    const {uid, tid, token, fork} = payload;
    return await axios.post(`${BEHAVIOR_MODULE}/fork/report`, {
        uid: uid,
        tid: tid,
        fork: fork
    }, {
        headers: {
            Authorization: token,
        }
    }).then(res => {
        return res.data;
    })
}


/**
 * 提交用户的评分与评论
 * @param payload{uid, tid, token, score, comment}
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function submitUserReportScoreAndComment(payload) {
    const {uid, tid, token, score, comment} = payload;
    return await axios.post(`${BEHAVIOR_MODULE}/score/report`, {
        uid: uid,
        tid: tid,
        score: score,
        comment: comment
    }, {
        headers: {
            Authorization: token,
        }
    }).then(res => {
        return res.data;
    })
}

/**
 * 获取报告质量指标
 * @param tid
 * @param token
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function getReportQuality(tid, token) {
    return await axios.get(`${REPORT_MODULE}/quality/${tid}`, {
        headers: {
            Authorization: token
        }
    }).then(res => res.data);
}


/**
 * 获取某个项目的低质量报告
 * @param pid
 * @param uid
 * @param token
 * @returns {Promise<Array<any>>}
 */
export async function getBadReportsByPid(pid, uid, token) {
    return await axios.get(`${RECOMMEND_MODULE}/bad_reports/${pid}/${uid}`, {
        headers: {
            Authorization: token
        }
    }).then(res => res.data);
}

export async function getAggregationReport(pid) {
    //console.dir("看看融合返回的信息："+JSON.stringify(await axios.get(`${REPORT_MODULE}/aggregation/${pid}`)));
    return await axios.get(`${REPORT_MODULE}/aggregation/${pid}`)
        .then(res => res.data);
}

export async function aggregateReport(pid,uid) {
    return await axios.post(`${REPORT_MODULE}/aggregation/aggregate/${pid}/${uid}`).then(res => {
        return res.data;
    })
}
