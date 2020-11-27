import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表
import './assets/css/global.css'
Vue.config.productionTip = false


// 配置vant
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


//axios
import axios from "axios"
Vue.prototype.$axios = axios
axios.defaults.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
axios.interceptors.request.use(config=>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})


// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/admin') { return next() }
    const data = sessionStorage.getItem('token')
    if (!data) { return next('/admin') }
    next()
  })

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
