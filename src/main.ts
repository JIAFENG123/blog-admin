// 引入windi css
import '@/plugins/windi.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { createApp } from 'vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


import App from './App.vue'

/* 
prismjs
*/
import '@/utils/prismjs'
import './permission'
// 创建实例
const setupAll = async () => {
  const app = createApp(App)
  app.use(mavonEditor)
  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)
  app.mount('#app')
}

setupAll()
