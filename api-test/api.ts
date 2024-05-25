import axios from "axios";
import {ApiEnum, ApiMethodEnum} from "@/src/api/api.enum";
import exp from "constants";

const UNPROTECTED_ROUTE:string[]=[ApiEnum.LOGIN]

interface CallApi<PayloadType> {
    url: string,
    method: ApiMethodEnum,
    payload?: PayloadType
}

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    timeout: 10000,
    maxRedirects: 3
})

export interface BaseListResponse {
    pagination: {
        page: number
        take: number
        itemCount: number
        pageCount: number
        hasPreviousPage: boolean,
        hasNextPage: boolean
    }
}

export type PaginationType = {
    page?: number
    take?: number
    total?: number
}


export const callApi =async <PayloadType>({
                                         url, method, payload
                                     }: CallApi<PayloadType>) => {
    let token;
    if (typeof window!=="undefined" && !UNPROTECTED_ROUTE.includes(url)){
        const getUserInfo=localStorage.getItem("user-info") as string
        token=JSON.parse(getUserInfo).state.token
    }
    const {data}=await axiosInstance({
        url:"/shokoofan"+url,
        method,
        data:payload,
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    return data
}
