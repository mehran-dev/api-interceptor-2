import {useForm} from "react-hook-form";
import {
    CouponType,
    CouponUserAccessType,
    CouponsListDataType,
    CreateCouponDataType,
    CreateCouponResponse,
    DeleteCouponResponse,
    GetCouponsResponse,
    UserDataType,
    UsersListDataType
} from "@/src/components/Dashboard/Coupons/couponsType";
import {HandleClientRequest} from "@/src/api/reactQuery";
import {ApiEnum, ApiMethodEnum} from "@/src/api/api.enum";
import {MutationEnum} from "@/src/api/mutation.enum";
import {useEffect, useState} from "react";
import {RoutesEnum} from "@/src/utils/routes";
import {showToast, ToastEnum} from "@/src/utils/showToast";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import { PaginationType } from "@/src/api/callApi";
import { toast } from "react-toastify";

const useCoupons = () => {

    const {t} = useTranslation();

    const router = useRouter();
    const [usersList, setUsersList] = useState<UserDataType[]>();
    const [couponId, setCouponId] = useState();

    const [couponsPagination, setCouponsPagination] = useState<PaginationType>({
        page : 1,
        take : 10
    });

    const [usersListPagination, setUsersListPagination] = useState<PaginationType>({
        page : 1,
        take : 10
    });
    
    const [couponsList, setCouponsList] = useState<CouponsListDataType[]>([]);

    const {
        control: createCouponControl,
        formState: {errors: createCouponError},
        handleSubmit: createCouponHandleSubmit
    } = useForm<CreateCouponDataType>()

    const {
        mutate: createCouponMutate,
        isLoading: createCouponIsLoading
    } = HandleClientRequest<CreateCouponResponse, CreateCouponDataType>({
        url: ApiEnum.COUPON,
        method: ApiMethodEnum.POST,
        mutationKey: MutationEnum.CREATE_COUPONS,
        onSuccess: (res) => {
            showToast(t("COUPONS.CREATE_COUPON_SUCCESSFULLY") as string, ToastEnum.SUCCESS)
            router.push(RoutesEnum.COUPONS_LIST)
        }
    })

    const {
        mutate: deleteCouponMutate,
        isLoading: deleteCouponIsLoading
    } = HandleClientRequest<DeleteCouponResponse, {}>({
        url: ApiEnum.COUPON + "/" + couponId,
        method: ApiMethodEnum.DELETE,
        mutationKey: MutationEnum.DELETE_COUPONS,
        onSuccess: (res) => {
            showToast(t("COUPONS.DELETE_COUPON_SUCCESSFULLY") as string, ToastEnum.SUCCESS)
            getCouponsMutate({})
        }
    });

    const {
        mutate: getCouponsMutate,
        isLoading: getCouponsIsLoading
    } = HandleClientRequest<GetCouponsResponse, {}>({
        url: `${ApiEnum.COUPON}?order=ASC&page=${couponsPagination.page}&take=${couponsPagination.take}`,
        method: ApiMethodEnum.GET,
        mutationKey: MutationEnum.GET_COUPONS,
        onSuccess: (res) => {

            setCouponsList(res.data);

            setCouponsPagination({
                page: res.pagination.page,
                take: res.pagination.take,
                total: res.pagination.itemCount,
            })

        }
    });

    useEffect(() => {
        getCouponsMutate({});
    },[couponsPagination.page]);

    const {
        mutate: getUsersMutate,
        isLoading: getUsersIsLoading
    } = HandleClientRequest<UsersListDataType, {}>({
        url: `${ApiEnum.USERS}?order=ASC&page=${usersListPagination.page}&take=${usersListPagination.take}`,
        method: ApiMethodEnum.GET,
        mutationKey: MutationEnum.GET_USERS,
        onSuccess: (res) => {

            setUsersList(res.data);

            setUsersListPagination({
                page: res.pagination.page,
                take: res.pagination.take,
                total: res.pagination.itemCount,
            });

        }
    });

    useEffect(() => {
        getUsersMutate({});
    },[usersListPagination.page]);


    function createCoupons (data: CreateCouponDataType) {

        if (data.type === CouponType.PERCENT && (data.value > 100 || data.value <= 0)) {

            toast.error("مقدار درصدی معتبر نیست");

            return

        }
        
        if (data.userAccessType === CouponUserAccessType.ALL_USERS) {
            
            createCouponMutate(data);
            
        } else {
            
            if (!data.userId) {
                
                toast.error("کاربری انتخاب نشده است");
                
            } else {
                
                createCouponMutate(data);

            }

        };
        
    }


    return {
        getCouponsMutate,
        getCouponsIsLoading,
        couponsPagination, setCouponsPagination,
        couponsList,
        createCoupon: {
            control: createCouponControl,
            errors: createCouponError,
            handleSubmit: createCouponHandleSubmit,
            submitForm: createCoupons,
            isLoading: createCouponIsLoading
            // || editReportIsLoading
        },
        getUsers: {
            mutate: getUsersMutate,
            isLoading: getUsersIsLoading,
            usersListPagination, setUsersListPagination,
            usersList, setUsersList
        },
        deleteCoupon: {
            mutate: deleteCouponMutate,
            isLoading: deleteCouponIsLoading
        },
        couponId, setCouponId
    }
}


export default useCoupons;