import axios from "axios";
import {RECOMMEND_MODULE} from "@/api/_prefix";

/**
 * 获取管理员的推荐项目列表 GET ${RECOMMEND_MODULE}/admin/recommend
 * @param token
 */
export async function getRecommendSettings(token){
    return await (axios.get(`${RECOMMEND_MODULE}/admin/recommend`,{
        headers:{
            Authorization: token
        }
    }).then(
        res=>{
            return res.data;
        }
    ))
}

/**
 * 获取具体的推荐项目信息 GET ${RECOMMEND_MODULE}/preference_project/${uid}
 * @param uid
 * @param token
 */
export async function getRecommendProject(uid,token){
    return await (axios.get(`${RECOMMEND_MODULE}/preference_project/${uid}`, {
        headers: {
            Authorization: token
        }
    }).then(
        res=>{
             console.log("后端传回的数据："+JSON.stringify(res.data));
            // console.log()
            return res.data;
        }
    ))
}

export async function getBadProjects(uid,token){
    return await (axios.get(`${RECOMMEND_MODULE}/bad_reports/${uid}`, {
        headers: {
            Authorization: token
        }
    }).then(
        res=>{
            console.log("后端传回的数据："+JSON.stringify(res.data));
            return res.data;
        }
    ))
}

/**
 * 更换推荐项目 POST ${RECOMMEND_MODULE}/admin/change
 * @param payload
 */
export const changeRecommendSettings = payload =>{
    const {grade,working_years,activity,typeList,positionList,max_size,token}=payload;
    return axios.post(`${RECOMMEND_MODULE}/admin/change`,{
    grade,working_years,activity,typeList,positionList,max_size,token
    },{
        headers:{
            Authorization:token
        }
    }).then(
        res=>{
            return res.data;
        })
}