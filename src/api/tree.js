import axios from "axios";
import {TREE_MODULE} from "@/api/_prefix";

/**
 *
 * @param pid
 * @param token
 * @returns {Promise<Array<Object>>}
 */
export async function getReportRoots(pid, token) {
    console.log(pid);
    return await (axios.get(`${TREE_MODULE}/all_roots/${pid}`, {
        headers: {
            Authorization: token
        }
    }).then(
        res=> {
            return res.data;
        }
    ));
}

export async function getReportTreeById(tid, token) {
    return await (axios.get(`${TREE_MODULE}/subtree/${tid}`, {
        headers: {
            Authorization: token
        }
    }).then(
        res=> {
            return res.data;
        }
    ));
}

export async function getSimReportList(payload) {
    const {tid,uid,pid,bugName,testDevice,submitTime,state,
        bugDescription,bugProcedure,screenshotUrlList,token}=payload;
    return await (axios.post(`${TREE_MODULE}/reports/${pid}`,{
        tid,uid,pid,bugName,testDevice,submitTime,state,
        bugDescription,bugProcedure,screenshotUrlList,token
    },{
        headers: {
            Authorization: token,
        }}).then(res=>{
        return res.data;
    }))
}

export async function getRootsRelation(pid){
    return await (axios.get(`${TREE_MODULE}/root_relation/${pid}`)
        // headers:{
        //     Authorization:token,
        // }
    ).then(
        res=>{
            return res.data;
        }
    )
}

/**
 * 添加fork的报告协作关系
 * @param payload{pid, tid, parentTid, addInformation, token}
 * @returns {Promise<void>}
 */
export async function addNode(payload) {
    const {pid, tid, parentTid, addInformation, token} = payload;
    return await (axios.post(`${TREE_MODULE}/add_node`, {
        tid, pid, parentTid, addInformation
    }, {
        headers: {
            Authorization: token,
        }
    }).then(res => res.data));
}

export async function countInfo(pid) {
    return await (axios.get(`${TREE_MODULE}/countinfo/${pid}`).then(
        res=> {
            return res.data;
        }
    ));
}

export async function cloudsword(tid) {
    return await (axios.get(`${TREE_MODULE}/cloudsword/${tid}`).then(
        res=> {
            //console.log("返回的词云图是："+JSON.stringify(res.data));
            return res.data;
        }
    ));
}

export async function topicwords(tid) {
    return await (axios.get(`${TREE_MODULE}/topicwords/${tid}`).then(
        res=> {
            let reslist=[];
            //console.log("返回的关键词是："+JSON.stringify(res.data.topicwords[0].word));
            for(let i=0;i<res.data.topicwords.length;i++) {
                reslist.push(res.data.topicwords[i].word);
            }
            //console.log("返回数据："+reslist);
            return reslist;
        }
    ));
}