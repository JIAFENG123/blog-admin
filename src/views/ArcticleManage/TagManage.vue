<template>
  <el-tag
    v-for="tag in dynamicTags"
    :key="tag.tag_id"
    class="mx-1"
    closable
    :disable-transitions="false"
    @close="handleClose(tag.tag_id)"
  >
    {{ tag.name }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    style="width: 200px"
    @keyup.enter="handleInputConfirm"
  >
    <template #suffix>
      <Check
        @click="handleInputConfirm"
        class="text-green-500 cursor-pointer"
        style="width: 1em; height: 1em; margin-right: 8px"
      />
      <Close @click="cancel" class="text-red-400 cursor-pointer" style="width: 1em; height: 1em" />
    </template>
  </el-input>
  <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
    + New Tag
  </el-button>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'
import { getTags, addTags, delTags } from '@/api/tags'
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus/es'
const inputValue = ref('')
const dynamicTags = ref<{ tag_id: string; name: string }[]>([])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = async (id: string) => {
  const res = await delTags(id)

  if (res) getTagList()
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = async () => {
  if (inputValue.value) {
    const res = await addTags({ name: inputValue.value })

    if (res) {
      inputVisible.value = false
      inputValue.value = ''
      getTagList()
    }
  } else {
    ElMessage.error('请输入标签名称')
  }
}

const getTagList = async () => {
  const res = await getTags()
  dynamicTags.value = res.data
}
getTagList()

const cancel = () => {
  inputVisible.value = false
  inputValue.value = ''
}
</script>
