<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'

import { TableData } from '@/api/table/types'
import { ElButton, ElMessageBox, ElSwitch } from 'element-plus'
import ArticleEdit from './components/ArticleEdit.vue'
import { Search } from '@element-plus/icons-vue'
import { ArticleParams, getArticles, delArticle, changePublish } from '@/api/article'
import { h, reactive, ref } from 'vue'

const { t } = useI18n()

let article_id = ref('')
let pages = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
const columns: TableColumn[] = [
  // {
  //   field: 'index',
  //   label: t('tableDemo.index'),
  //   type: 'index'
  // },
  {
    field: 'title',
    label: t('tableDemo.title')
  },
  // {
  //   field: 'author',
  //   label: t('tableDemo.author')
  // },
  {
    field: 'createdAt',
    label: t('tableDemo.displayTime'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return cellValue.toString().slice(0, 10)
    }
  },
  {
    field: 'isPublish',
    label: '是否发布',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(ElSwitch, {
        modelValue: cellValue,
        onChange: async (val) => {
          await changePublish(_.article_id, { isPublish: val as boolean })
          refresh()
        }
      })
    }
  },
  // {
  //   field: 'importance',
  //   label: t('tableDemo.importance'),
  //   formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
  //     return h(
  //       ElTag,
  //       {
  //         type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger'
  //       },
  //       () =>
  //         cellValue === 1
  //           ? t('tableDemo.important')
  //           : cellValue === 2
  //           ? t('tableDemo.good')
  //           : t('tableDemo.commonly')
  //     )
  //   }
  // },
  {
    field: 'views',
    label: t('tableDemo.pageviews')
  },
  {
    field: 'action',
    label: t('tableDemo.action')
  }
]

const loading = ref(true)

let tableDataList = ref<TableData[]>([])

const getTableList = async (params?: ArticleParams) => {
  const res = await getArticles(
    params || {
      page: 1,
      pageSize: 10,
      keyword: ''
    }
  )

  loading.value = false
  // .catch(() => {})
  // .finally(() => {
  //   loading.value = false
  // })

  if (res) {
    tableDataList.value = res.data
    pages.total = res.count
  }
}
const searchInfo = ref('')

getTableList({
  page: pages.page,
  pageSize: pages.pageSize,
  keyword: searchInfo.value
})
const refresh = () => {
  loading.value = true
  getTableList({
    page: pages.page,
    pageSize: pages.pageSize,
    keyword: searchInfo.value
  })
}
const acitonFn = (data: TableSlotDefault, type: string) => {
  if (type === 'edit') {
    article_id.value = data.row.article_id + ''
    showEdit.value = true
  } else {
    ElMessageBox.confirm('del confirm?', 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async () => {
        const res = await delArticle(data.row.article_id)
        if (res) {
          refresh()
        }
      })
      .catch(() => {})
  }
}

//add
const addArticle = () => {
  article_id.value = ''
  showEdit.value = true
}
const showEdit = ref<boolean>(false)

//page
const handleSizeChange = (val: number) => {
  getTableList({
    page: pages.page,
    pageSize: val,
    keyword: searchInfo.value
  })
}
const handleCurrentChange = (val: number) => {
  getTableList({
    page: val,
    pageSize: pages.pageSize,
    keyword: searchInfo.value
  })
}
</script>

<template>
  <ContentWrap :title="t('tableDemo.table')" :message="t('tableDemo.tableDes')">
    <template #header>
      <div class="ml-6 flex items-center">
        <ElButton type="primary" @click="addArticle">
          {{ '新建文章' }}
        </ElButton>
        <el-input
          class="ml-5"
          v-model="searchInfo"
          style="width: 200px"
          placeholder="请输入"
          :suffix-icon="Search"
          @change="refresh"
        />
      </div>
    </template>
    <Table :columns="columns" :data="tableDataList" :loading="loading" :selection="false">
      <template #action="data">
        <!-- <ElButton type="primary" @click="acitonFn(data as TableSlotDefault)">
          {{ t('tableDemo.action') }}
        </ElButton> -->
        <el-button type="success" size="small" @click="acitonFn(data as TableSlotDefault, 'edit')"
          >修改</el-button
        >
        <el-button type="danger" size="small" @click="acitonFn(data as TableSlotDefault, 'delete')"
          >删除</el-button
        >
      </template>
    </Table>
    <section class="my-4 flex justify-center items-center">
      <el-pagination
        v-model:currentPage="pages.page"
        v-model:page-size="pages.pageSize"
        :page-sizes="[10, 30, 50, 100]"
        layout="sizes, prev, pager, next"
        :total="pages.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>

    <ArticleEdit
      :show="showEdit"
      @close="showEdit = false"
      :id="article_id"
      @refresh-table="refresh"
      size="100%"
    />
  </ContentWrap>
</template>
