import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false


// 配置vant
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

//element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


//axios
import axios from "./uiuts/requer"
Vue.prototype.$axios = axios

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
