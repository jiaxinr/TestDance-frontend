import axios from "axios";
import {PROJECT_MODULE} from "@/api/_prefix";


// /**
//  * 根据状态获取项目列表 GET ${PROJECT_MODULE}/state/${page}
//  * @param payload
//  */
// export async function getProjectByState(payload) {
//     console.log(payload);
//     const {state,page}=payload;
//     axios.get(`${PROJECT_MODULE}/all/filter/${page}`,{
//         params:{
//             state,page
//         },
//         headers: {
//             TOKEN: this.$store.state.token
//         }
//     }).then(res=>{
//         return res.data;
//     })
// }

/**
 *
 * @param deviceList
 * @param typeList
 * @param state
 * @param page
 * @returns {Promise<any>}
 */
export async function getProjectListByFilter(deviceList, typeList, state, page) {
    deviceList = deviceList.map( item => parseInt(item));
    typeList = typeList.map( item => parseInt(item));
    return (await axios.post(`${PROJECT_MODULE}/all/filter/${page}`, {
        deviceList,
        typeList,
        state
    })).data;
}

/**
 * 获取单一project信息 GET ${PROJECT_MODULE}/${pid}
 * @param pid
 */
export async function getProjectById(pid) {
    return (await axios.get(`${PROJECT_MODULE}/all/${pid}`)).data
}

/**
 * 得到对应工人的项目列表 GET ${PROJECT_MODULE}/work/${page}/${uid}
 * @param payload，其中${state}=0为正在进行、=1为已结束、=-1为全部
 */
export async function getWorkerProjectByUid(payload) {
    const {page,uid,state,token}=payload;
    return await (axios.get(`${PROJECT_MODULE}/work/${page}/${uid}`,{
        params: {
            state
        },
        headers: {
            Authorization: token
        }
    }).then(res=>res.data));
}

/**
 * 得到对应发包方的项目列表 GET ${PROJECT_MODULE}/manage/${page}/${uid}
 * @param payload，其中${state}=0为正在进行、=1为已结束、=-1为全部
 */
export async function getManagerProjectByUid(payload) {
    console.log(payload);
    const {page,uid,state,token}=payload;
    return await (axios.get(`${PROJECT_MODULE}/manage/${page}/${uid}`,{
        params: {
            state
        },
        headers: {
            Authorization: token
        }
    }).then(res=>res.data));
}

/**
 * 根据项目id获取参与的工人列表 GET ${PROJECT_MODULE}/wokerlist/${pid}
 * @param pid
 */
export const getProjectWorkerByPid = pid =>{
    console.log(pid);
    axios.get(`${PROJECT_MODULE}/wokerlist/${pid}`).then(
        res=>{
            return res.data;
        }
    )
}

/**
 * 创建项目 POST ${PROJECT_MODULE}/create
 * @param payload
 */
export const createProject = payload =>{
    console.log(payload);
    const {uid,projectName,state,testType,testDevice,workerNumLimit,workerNumCurr,
        releaseTime,startTime,endTime,projectAddress,excuteFileUrl,descriptionFileUrl,
        gradeRequirement,reward,introduction,testRemark,token}=payload;
    const projectVO = {
        uid,projectName,state,testType,testDevice,
        workerLimit: workerNumLimit,
        workerCurrent: workerNumCurr,
        releaseTime,startTime,endTime,projectAddress,excuteFileUrl,descriptionFileUrl,
        gradeRequirement,reward,introduction,testRemark
    };
    return axios.post(`${PROJECT_MODULE}/create`,
        projectVO,
        {headers: {
            Authorization: token
        }}).then(res=>{
            console.log("here is 2!!")
        return res.data;
    })
}

/**
 * 更新项目信息 POST ${PROJECT_MODULE}/update
 * @param payload
 */
export const updateProject = payload =>{
    console.log(payload);
    const {pid,uid,projectName,state,testType,testDevice,workerNumLimit,workerNumCurr,
        releaseTime,startTime,endTime,projectAddress,excuteFileUrl,descriptionFileUrl,
        gradeRequirement,reward,introduction,testRemark}=payload;
    axios.post(`${PROJECT_MODULE}/update`,{
        pid,uid,projectName,state,testType,testDevice,workerNumLimit,workerNumCurr,
        releaseTime,startTime,endTime,projectAddress,excuteFileUrl,descriptionFileUrl,
        gradeRequirement,reward,introduction,testRemark
    }).then(res=>{
        return res.data;
    })
}


export async function participateProject(uid, pid, token) {
    await axios.post(`${PROJECT_MODULE}/participate`, {
        uid,
        pid
    }, {
        headers: {
            Authorization: token
        }
    })
}


export async function checkParticipateState(uid, pid, token) {
    try {
        return (await (axios.get(`${PROJECT_MODULE}/is_participate/${uid}/${pid}`, {
            headers: {
                Authorization: token
            }
        }))).data;
    } catch (e) {
        return {
            success: false,
            msg: 'no'
        }
    }
}

export async function completion_degree(payload) {
    const pid=payload;
    return await (axios.get(`${PROJECT_MODULE}/completion_degree/${pid}`
        // headers: {
        //     Authorization: token
        // }
    ).then(res=>res.data));
}

export const closeProject = payload =>{
    console.log("payload is:"+payload);
    let pid=payload;
    let state=0;
    axios.post(`${PROJECT_MODULE}/close/${pid}`,{
        params: {
            state
        }
    }).then(res=>{
        return res.data;
    })
}