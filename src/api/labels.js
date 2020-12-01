// 每个模块都应该有自己的接口文件去统一管理api
import { get, post, patch, DELETE } from '@/utils/request'
import store from '../store/index'
let githubUsername = store.state.configuration.githubUsername
// 导入接口域名列表
import base from './base';
export const createLabels = (params) => post(`${base.github}/repos/${githubUsername}/zzjtnb/labels`, params)
export const deleteLabels = (name) => DELETE(`${base.github}/repos/${githubUsername}/zzjtnb/labels/${name}`)
export const editLabels = (params, name) => patch(`${base.github}/repos/${githubUsername}/zzjtnb/labels/${name}`, params)
export const getLabels = (params) => get(`${base.github}/repos/${githubUsername}/zzjtnb/labels`, params)

