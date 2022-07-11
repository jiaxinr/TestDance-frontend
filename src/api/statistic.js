import axios from "axios";
import {STATISTIC_MODULE} from "@/api/_prefix";

export async function getSystemData() {
    return await (axios.get(`${STATISTIC_MODULE}/system_data`).then(
        res=> {
            console.log(JSON.stringify(res.data))
            return res.data;
        }
    ));
}

export async function getReportQualityData() {
    return await (axios.get(`${STATISTIC_MODULE}/report_quality_data`).then(
        res=> {
            console.log(JSON.stringify(res.data));
            return res.data;
        }
    ));
}