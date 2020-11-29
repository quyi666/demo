import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    // 登录路由
    {
      path:"/admin",
      name:"admin",
      component:()=>import('@/views/admin')
    },
    {
      path:"/home",
      name:"home",
      component:()=>import('@/views/home'),
      redirect:{
        path:"/About",
        name:"About",
        component:()=>import('@/views/About'),
      },
      children:[
        {
          path:"/About",
          name:"About",
          component:()=>import('@/views/About'),
        },
        {
          path:"/users",
          name:"users",
          component:()=>import('@/views/users'),
        },
        {
          path:"/roles",
          name:"roles",
          component:()=>import('@/views/roles'),
        },
        {
          path:"/rights",
          name:"rights",
          component:()=>import('@/views/rights'),
        },
  
      ]
    },
  ] 
})


