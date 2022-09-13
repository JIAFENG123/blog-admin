import { config } from '@/config/axios/config'
import { useAxios } from '@/hooks/web/useAxios'

const request = useAxios()
export interface result {
  tag_id: string
  name: string
}
const { commonUrl } = config

export const PATH_URL = commonUrl[import.meta.env.VITE_API_BASEPATH]
export const getTags = async (params?: any): Promise<IResponse<result[]>> => {
  const res = await request.get({ url: `${PATH_URL}/api/tags`, params })
  return res && res.data.data
}

export const addTags = async (data: any): Promise<IResponse<result>> => {
  const res = await request.post({ url: `${PATH_URL}/api/tags/create`, data })
  return res && res.data.data
}

export const delTags = async (id): Promise<IResponse<result>> => {
  const res = await request.delete({ url: `${PATH_URL}/api/tags/${id}` })
  return res && res.data.data
}
