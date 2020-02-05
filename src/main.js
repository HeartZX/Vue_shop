import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font_login/iconfont.css'
import './assets/font_home/iconfont.css'
import './assets/font_pay/iconfont.css'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入nprogress包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false

// axios请求拦截
axios.interceptors.request.use(config => {
  console.log(config)
  NProgress.start()
  // 为请求头对象 添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config

  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  // 最后必须return config
  return config
})

Vue.prototype.$http = axios
Vue.filter('dateFormat', function (originval) {
  const dt = new Date(originval)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
