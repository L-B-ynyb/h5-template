import request from '@/utils/request'

export const getIncomeApi = () => request.get(`/violet/api/taskcenter/get_partner_info`)
export const getRankListApi = () => request.get(`/violet/api/taskcenter/get_revenue_ranking_list`)// 降序排名
export const getSubListApi = params => request.get(`/violet/api/taskcenter/get_all_subordinate_list`, { params })
export const getFlowListApi = params => request.get(`/violet/api/taskcenter/commission/flow_list`, { params })
export const postWithdrawApi = data => request.post(`/violet/api/taskcenter/commission/withdraw`, data)
