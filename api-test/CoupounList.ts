import React, {useEffect} from "react";
import {Button, Table, TableColumnsType, Tag, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ReportListDataType} from "@/src/components/Dashboard/Reports/reports.type";
import useCoupons from "@/src/components/Dashboard/Coupons/useCoupons";
import Format from "string-format";
import {RoutesEnum} from "@/src/utils/routes";
import {useRouter} from "next/router";
import { CouponType, CouponUserAccessType, CouponsListDataType } from "./couponsType";
import moment from "jalali-moment";

const {Text} = Typography

const CouponsList = () => {

    const {t} = useTranslation()

    const router=useRouter()

    const { getCouponsMutate, getCouponsIsLoading, couponsPagination, setCouponsPagination, couponsList, couponId, setCouponId, deleteCoupon } = useCoupons();

    const columns: TableColumnsType<CouponsListDataType> = [
        {title: t('COUPONS.TITLE'), dataIndex: 'title', key: 'title', align: "center"},
        {
            title: t('COUPONS.CODE'),
            dataIndex: 'code',
            key: 'type',
            align: "center",
        },
        {title: t('COUPONS.VALUE'), dataIndex: 'value', key: 'group', align: "center"},
        {title: t('COUPONS.TYPE'), dataIndex: 'type',
            key: 'pageCount', align: "center",
            render:(value)=> <Text> { value === CouponType.FLAT ? "قیمتی" : "درصدی" } </Text>
        },
        {title: t('COUPONS.ACCESS_TYPE'), dataIndex: 'userAccessType',
            key: 'cost', align: "center",
            render:(value)=> <Text> { value === CouponUserAccessType.ALL_USERS ? "همه ی کاربران" : "کد یکتا" } </Text>
        },
        {
            title: t('COUPONS.ACTIVE'),
            dataIndex: 'isActive',
            key: 'isActive',
            render: (value) =>  value ? "فعال" : "غیر فعال",
            align: "center"
        },
        {   title: t('COUPONS.EXPIRE_DATE'), dataIndex: 'expireDate',
            key: 'expireDate', align: "center",
            render : (value) => moment(value).locale('fa').format('YYYY/MM/DD HH:mm:ss')
        },
        {
            title: t('COUPONS.EDIT_REMOVE'),
            align: "center",
            render: (record) => <div className={"flex gap-2"}>
                <Button type="primary"
                        onClick={() => {
                            
                            // setCouponId
                        }}
                        block={true}>
                    {t("COUPONS.EDIT")}
                </Button>
                <Button
                    type="primary"
                    loading={couponId === record.id && deleteCoupon.isLoading}
                    onClick={() => {
                        setCouponId(record.id)
                        deleteCoupon.mutate({});
                    }}
                    block={true}>
                    {t("COUPONS.REMOVE")}
                </Button>
            </div>
        },
    ];

    useEffect(() => {
        getCouponsMutate({})
    }, [])

    return  (
                <Table rowKey={"id"} loading={getCouponsIsLoading} bordered columns={columns} dataSource={couponsList}
                        pagination={{
                            pageSize: couponsPagination.take,
                            current: couponsPagination.page,
                            total: couponsPagination.total,
                            onChange: (page, pageSize) => {
                                setCouponsPagination({...couponsPagination, page, take: pageSize})
                            }
                        }}
                />
            )

}


export default CouponsList
