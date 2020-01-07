import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font_login/iconfont.css'
import './assets/font_home/iconfont.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false

//axios请求拦截
axios.interceptors.request.use(config=>{
  console.log(config);
  //为请求头对象 添加token验证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})
Vue.prototype.$http=axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
