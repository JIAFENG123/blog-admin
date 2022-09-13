<template>
  <div class="bg-light-400 px-4 w-full h-full">
    <el-button type="primary" class="mb-4" @click="addCategory">Add</el-button>
    <el-tree
      :props="{ children: 'children', label: 'name' }"
      :data="dataSource"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <section v-if="data.edit">
            <el-input v-model="data.nameClone">
              <template #suffix>
                <Select class="w-4 h-4 cursor-pointer text-green-500" @click="confirmEdit(data)" />
                <CloseBold
                  class="w-4 h-4 cursor-pointer ml-3 text-red-500"
                  @click="
                    () => {
                      data.edit = false
                      data.nameClone = data.name
                    }
                  "
                />
              </template>
            </el-input>
          </section>
          <span v-else>{{ node.label }}</span>
          <span class="flex items-center">
            <Plus class="w-4 h-4 cursor-pointer text-blue-500" @click="addLevelCategory(data)" />
            <Minus class="w-4 h-4 cursor-pointer mx-4 text-red-500" @click="delNode(data)" />
            <EditPen class="w-4 h-4 cursor-pointer text-green-500" @click="editNode(data)" />
          </span>
        </span>
      </template>
    </el-tree>
  </div>

  <el-dialog v-model="dialogVisible" title="add" width="30%">
    <el-form :model="addForm" label-width="80px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="addForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel()">Cancel</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirm(ruleFormRef)"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// import type Node from 'element-plus/es/components/tree/src/model/node'
import { Plus, Minus, EditPen, Select, CloseBold } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { createCategory, delCategory, editCategory, getCategorys } from '@/api/category'
interface Tree {
  id: number
  name: string
  children?: Tree[]
  edit?: boolean
  nameClone?: string
}
// let id = 1000
const ruleFormRef = ref<FormInstance>()
// const append = (data: Tree) => {
//   const newChild = { id: id++, label: 'testtest', children: [] }
//   if (!data.children) {
//     data.children = []
//   }
//   data.children.push(newChild)
//   dataSource.value = [...dataSource.value]
// }

// const remove = (node: Node, data: Tree) => {
//   const parent = node.parent
//   const children: Tree[] = parent.data.children || parent.data
//   const index = children.findIndex((d) => d.id === data.id)
//   children.splice(index, 1)
//   dataSource.value = [...dataSource.value]
// }
const currentNode = ref<Tree>()
const dataSource = ref<Tree[]>([])

//add
const dialogVisible = ref(false)
const addForm = reactive({
  name: ''
})
const addCategory = () => {
  addForm.name = ''
  dialogVisible.value = true
}
const addLevelCategory = (_?: Tree) => {
  addForm.name = ''
  if (_) currentNode.value = _
  dialogVisible.value = true
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: 'Please input category name', trigger: 'blur' }]
})

const confirmLoading = ref(false)

const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      confirmLoading.value = true
      const data = currentNode.value
        ? {
            name: addForm.name,
            parent_id: currentNode.value.id
          }
        : {
            name: addForm.name
          }
      const res = await createCategory(data)
      if (res) {
        confirmLoading.value = false
        dialogVisible.value = false
        getCates()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const cancel = () => {
  dialogVisible.value = false
}

//getlist
const traverse = (arr: Tree[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children && arr[i].children?.length) {
      traverse(arr[i].children as Tree[])
    }
    arr[i].edit = false
    arr[i].nameClone = arr[i].name
  }
}
const getCates = async () => {
  const res = await getCategorys()
  traverse(res as unknown as Tree[])
  dataSource.value = res as unknown as Tree[]
}

onMounted(() => {
  getCates()
})

//edit tree node
const editNode = (_: Tree) => {
  _.edit = true
}
const confirmEdit = async (_: Tree) => {
  if (!_.nameClone) {
    ElMessage.error('请输入分类名称')
  } else {
    _.name = _.nameClone as string

    const res = await editCategory(_.id, { name: _.name })
    if (res) {
      _.edit = false
      getCates()
    }
  }
}

//delete
const delNode = (_: Tree) => {
  ElMessageBox.confirm('del confirm?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      const res = await delCategory(_.id)
      if (res) {
        getCates()
      }
    })
    .catch(() => {})
}
</script>
<style>
.el-tree-node__content {
  height: auto !important;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
