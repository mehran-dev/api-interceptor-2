import {useMutation} from "@tanstack/react-query";
import {callApi} from "@/src/api/callApi";
import {HandleClientRequestParameter} from "@/src/api/reactQuery.types";
import {showToast} from "@/src/utils/showToast";
import userInfoState from "@/src/zustand/userInfo";
import {useRouter} from "next/router";
import {RoutesEnum} from "@/src/utils/routes";


export const HandleClientRequest = <ResponseType, PayloadType = {}>({
                                                                        mutationKey,
                                                                        url,
                                                                        method,
                                                                        onSuccess
                                                                    }: HandleClientRequestParameter<ResponseType,PayloadType>) => {
    const {clearUserInfo}=userInfoState()
    const router=useRouter()
    return useMutation<ResponseType, unknown, PayloadType, unknown>([mutationKey], (payload) => callApi<PayloadType>({
        url,
        payload,
        method,
    }),{
        onSuccess:((data, variables) => {
            onSuccess && onSuccess(data,variables)
        }),
        onError:(err:any)=>{
            if (err.response.data.message){
                showToast(err.response.data.message)
                if (err.response.data.statusCode===401){
                    clearUserInfo()
                    router.push(RoutesEnum.LOGIN)
                }
            }else{
                showToast("خطای سرور")
            }
        }
    })
}
