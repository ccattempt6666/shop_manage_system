import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入axios
import axios from 'axios'
// 导入全局样式
import './css/common.css'
// 导入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

// 全局配置axios
Vue.prototype.$axios = axios
// 配置基准url
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 发送请求前加上请求头
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  if (response.meta.status === 401) {
    response.meta.msg = '登录状态失效，请重新登录'
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
