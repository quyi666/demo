<template>
<div>
 <el-container class="home-container">
  <el-header>
    <div>
        <img src="../assets/14306fa49578be775db5a521f6dff77a.gif" alt="">
      <span>后台管理系统</span> 
    </div>

<el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="flag ? '64px' : '200px'">
    <!-- 折叠按钮 -->
      <div class="toggle-button" @click="toggle">|||</div>
      <el-col :span="24">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="flag"
      :collapse-transition="false"
      router  
     
      >
      <!-- 一级菜单 -->
      <el-submenu :index="'item.id'+item.path" v-for="item in list" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item-group>
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children"
            :key="subItem.path" >
              <i class="el-icon-menu"></i>
              {{subItem.authName}}
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>


    </el-aside>
    <el-main>
      <!-- 占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
export default {
  // 组件名称
  name: 'demo',
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
   return {
      list: null,
      // 折叠
      flag:false,
   }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 退出 
    logout(){
        sessionStorage.clear()
        this.$message.success('退出成功')
        this.$router.push('/admin')
    },
    // 获取左侧列表
    async getList(){
      const {data:res} = await this.$axios.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.list=res.data
      // console.log(res)
    },
    // 折叠下·
    toggle(){
      this.flag=!this.flag
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 在实例初始化之后，组件属性计算之前，如data属性等
  */
  beforeCreate () {
  },
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {
    this.getList()
  },
  /**
  * 在挂载开始之前被调用：相关的 render 函数首次被调用。
  */
  beforeMount () {
  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted () {
  },
  /**
  * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
  * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
  */
  beforeUpdate () {
  },
  /**
  * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  */
  updated () {
  },
  /**
  * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
  */
  activated () {
  },
  /**
  * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
  */
  deactivated () {
  },
  /**
  * 实例销毁之前调用。在这一步，实例仍然完全可用。
  */
  beforeDestroy () {
  },
  /**
  * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
  * 所有的事件监听器会被移除，所有的子实例也会被销毁。
  */
  destroyed () {
  }
}
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style lang="scss" scoped>
  .home-container{
    width: 100%;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    display: flex;
    justify-content:space-between;
    height: 693px;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
     img{
      width: 80px;
      border-radius: 50%;
      
    }
  }

  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    height: 693px;
    .el-menu{
      border-right: none;
    }
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
   
    
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }

  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  

</style>
