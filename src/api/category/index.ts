import { config } from '@/config/axios/config'
import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()
export interface result {
  id: string
  name: string
  parent_id: number
  parent: result
  children: result[]
}
const { commonUrl } = config

export const PATH_URL = commonUrl[import.meta.env.VITE_API_BASEPATH]
export const getCategorys = async (params?: any): Promise<IResponse<result[]>> => {
  const res = await request.get({ url: `${PATH_URL}/api/category`, params })
  return res && res.data.data
}

export const createCategory = async (data: {
  name: string
  parent_id?: number | string
}): Promise<IResponse<result>> => {
  const res = await request.post({ url: `${PATH_URL}/api/category/create`, data })
  return res && res.data.data
}
export const editCategory = async (
  id: number,
  data: {
    name: string
    parent_id?: number | string
  }
): Promise<IResponse<result>> => {
  const res = await request.put({ url: `${PATH_URL}/api/category/${id}`, data })
  return res && res.data.data
}
export const delCategory = async (id): Promise<IResponse<result>> => {
  const res = await request.delete({ url: `${PATH_URL}/api/category/${id}` })
  return res && res.data.data
}
