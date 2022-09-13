import { config } from '@/config/axios/config'
import { useAxios } from '@/hooks/web/useAxios'
// import { AxiosResponse } from 'axios'

import { TableData } from '../table/types'
export interface ArticleParams {
  page: number
  pageSize: number
  keyword: string
}
export interface result {
  count: number
  data: TableData[]
}

export interface ArticelData {
  tags: string[] | number[]
  title: string
  sammaryPic: string
  summary: string
  content: string
  category: string
  categorys: string
}
const request = useAxios()
const { commonUrl } = config

export const PATH_URL = commonUrl[import.meta.env.VITE_API_BASEPATH]
export const getArticles = async (params: ArticleParams): Promise<result> => {
  const res = await request.get({ url: `${PATH_URL}/api/article`, params })
  return res.data.data
}

export const addArticles = async (data: ArticelData): Promise<result> => {
  const res = await request.post({ url: `${PATH_URL}/api/article/create`, data })
  return res.data.data
}

export const updateArticles = async (id: string, data: ArticelData): Promise<result> => {
  const res = await request.put({ url: `${PATH_URL}/api/article/${id}`, data })
  return res.data.data
}

export const getArticle = async (id: string): Promise<ArticelData> => {
  const res = await request.get({ url: `${PATH_URL}/api/article/${id}` })
  return res.data.data
}

export const delArticle = async (id: string): Promise<result> => {
  const res = await request.delete({ url: `${PATH_URL}/api/article/${id}` })
  return res.data.data
}

export const changePublish = async (
  id: number,
  data: {
    isPublish: boolean
  }
): Promise<IResponse<result>> => {
  const res = await request.post({
    url: `${PATH_URL}/api/article/changePublish?id=${id}`,
    data
  })
  return res && res.data.data
}
