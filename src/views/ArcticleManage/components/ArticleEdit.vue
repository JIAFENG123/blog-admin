<template>
  <div class="wrap">
    <el-drawer :model-value="props.show" title="文章编辑" @close="emit('close')">
      <el-form label-width="80px" :model="searchInfo">
        <el-form-item label="标题">
          <el-input v-model="searchInfo.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="缩略图">
          <el-input v-model="searchInfo.sammaryPic" placeholder="缩略图" />
        </el-form-item>
        <el-form-item label="概述">
          <el-input v-model="searchInfo.summary" type="textarea" placeholder="概述" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select multiple collapse-tags v-model="searchInfo.tags" placeholder="标签...">
            <el-option
              v-for="item in searchInfo.tagOptions"
              :key="item.tag_id"
              :label="item.name"
              :value="item.tag_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-cascader
            @change="cateChange"
            v-model="searchInfo.categories"
            :options="categories"
            :props="{
              value: 'id',
              checkStrictly: true,
              children: 'children',
              label: 'name'
            }"
            clearable
          />
        </el-form-item>
      </el-form>
      <div class="w-full flex">
        <section class="flex-1 overflow-auto">
          <mavon-editor @img-add="$imgAdd" ref="mditor" v-model="defaultHtml" :subfield="false" />
        </section>
        <!-- ql-editor -->
        <section class="flex-1 overflow-auto">
          <!-- <MarkDown :source="defaultHtml" /> -->
          <div id="md" class="markdown-body-x"></div>
        </section>
      </div>
      <template #footer>
        <el-button @click="emit('close')">取消</el-button>
        <el-button type="primary" @click="saveArticle" :loading="saveloading">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ElDrawer } from 'element-plus'
import { marked } from 'marked'
import Prismjs from 'prismjs'
import '@/styles/md-themes1.css'
// import MarkDown from 'vue3-markdown-it'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { getTags, result } from '@/api/tags'
import { addArticles, getArticle, updateArticles } from '@/api/article'
import { getCategorys } from '@/api/category'
import { CascaderOption } from 'element-plus/lib/components/cascader-panel/src/types'

const props = defineProps<{ show: boolean; id: string }>()
const emit = defineEmits(['close', 'refreshTable'])
const defaultHtml = ref(``)

onMounted(() => {
  nextTick(() => {
    Prismjs.highlightAll()
  })
})

watch(
  () => defaultHtml.value,
  (value) => {
    if (value) {
      nextTick(() => {
        let editor = document.querySelector('#md') as HTMLElement
        editor.innerHTML = marked(value)
        Prismjs.highlightAll()
      })
    }
  }
)
const backShow = async (val) => {
  const res = await getArticle(val)
  nextTick(() => {
    searchInfo.title = res.title
    searchInfo.tags = res.tags.map((_: any) => _.tag_id) as []
    searchInfo.sammaryPic = res.sammaryPic
    searchInfo.summary = res.summary
    searchInfo.content = res.content

    searchInfo.categories = res.categorys.split(',').map(Number) as []
    console.log(searchInfo.categories)
    defaultHtml.value = res.content
  })
}
watch(
  () => props.show,
  () => {
    resetData()
    if (props.id) {
      backShow(props.id)
    }
  }
)
//id
watch(
  () => props.id,
  async (val) => {
    backShow(val)
  }
)
const mditor = ref()
const $imgAdd = (pos, $file) => {
  console.log(pos, $file.miniurl)
}

const searchInfo = reactive({
  tags: [],
  title: '',
  sammaryPic: '',
  summary: '',
  content: '',
  tagOptions: [] as result[],
  categories: [],
  category: '',
  categorys: ''
})

const getTagList = async () => {
  const res = await getTags()
  searchInfo.tagOptions = res.data
}
getTagList()

const resetData = () => {
  searchInfo.title = ''
  searchInfo.tags = []
  searchInfo.sammaryPic = ''
  searchInfo.summary = ''
  searchInfo.content = ''
  defaultHtml.value = ''
  searchInfo.categories = []
  searchInfo.category = ''
  searchInfo.categorys = ''
  nextTick(() => {
    let editor = document.querySelector('#md') as HTMLElement
    editor.innerHTML = ''
  })
}
//save
const saveloading = ref(false)
const saveArticle = async () => {
  saveloading.value = true

  searchInfo.content = defaultHtml.value
  searchInfo.category = searchInfo.categories[searchInfo.categories.length - 1] || ''
  searchInfo.categorys = searchInfo.categories.join()
  const { title, sammaryPic, summary, content, tags, category, categorys } = searchInfo
  let res
  if (props.id) {
    res = await updateArticles(props.id, {
      title,
      sammaryPic,
      summary,
      content,
      tags,
      category,
      categorys
    })
  } else {
    res = await addArticles({
      title,
      sammaryPic,
      summary,
      content,
      tags,
      category,
      categorys
    })
  }
  if (res) {
    saveloading.value = false
    emit('close')
    resetData()
    emit('refreshTable')
  }
}

//categories
interface Tree {
  id: number
  name: string
  children?: Tree[]
}
type A = Tree & CascaderOption
const categories = ref<A[]>()
const getCategories = async () => {
  const res = await getCategorys()
  categories.value = res as unknown as A[]
}
getCategories()

const cateChange = (val) => {
  console.log(val)
}
</script>
<style scoped lang="less">
.wrap {
  :deep(.el-drawer) {
    width: calc(100% - 200px) !important;
  }
}
</style>
