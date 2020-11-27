<template>
<div>
    <div class="login_container">
        <div class="login_box">
            <div class="avater_box">
                <img src="../assets/14306fa49578be775db5a521f6dff77a.gif" alt="">
            </div>
            <!--登录-->
                <el-form ref="form" :model="loginFrom" :rules="rules"  label-width="0px" class="login_from">
                 <!--用户名-->
                <el-form-item prop="username">
                 <el-input placeholder="用户名字" v-model="loginFrom.username" ></el-input>
                </el-form-item>  
                 <!--密码--> 
                <el-form-item prop="password">
                 <el-input placeholder="密码" v-model="loginFrom.password" type="password"></el-input>
                </el-form-item> 
                 <!--登录按钮-->  
                 <el-form-item class="btns">
                     <el-button type="success" @click="login">登录</el-button>
                     <el-button type="info" @click="resectLoginFrom">重置 </el-button>
                </el-form-item> 
                </el-form>

        </div>
    </div>
</div>
</template>

<script>
export default {
  // 组件名称
  name: "demo",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
        //这是登录表单的数据绑定对象
        loginFrom:{
            username:"admin",
           password:"123456"
        },
        //表单验证
        rules:{
            username:[
                 { required: true, message: '请输入登录名称', trigger: 'blur' },
                   { min: 3, max: 5, message: '长度在 3 到 10 个字母', trigger: 'blur' }
            ],
            password:[
                 { required: true, message: '请输入密码名称', trigger: 'blur' },
                // { min: 3, max: 5, message: '长度在 6 到 15 个字母', trigger: 'blur' }
            ],
        }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
        //   重置
      resectLoginFrom(){
        // console.log(this)
        this.$refs.form.resetFields()
      },
    //   登录
      login(){
           this.$refs.form.validate( async valid=>{
         if (!valid) return ; 
         const {data: res}= await this.$axios.post('login',this.loginFrom);
            if(res.meta.status!==200) return  this.$message.error('登录失败');
             this.$message.success('登录成功');
              console.log(res)
              sessionStorage.setItem('token',res.data.token)
              this.$router.push('/home')
           })
      }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 在实例初始化之后，组件属性计算之前，如data属性等
   */
  beforeCreate() {},
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * 在挂载开始之前被调用：相关的 render 函数首次被调用。
   */
  beforeMount() {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
  /**
   * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
   * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
   */
  beforeUpdate() {},
  /**
   * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
   * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
   */
  updated() {},
  /**
   * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
   */
  activated() {},
  /**
   * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
   */
  deactivated() {},
  /**
   * 实例销毁之前调用。在这一步，实例仍然完全可用。
   */
  beforeDestroy() {},
  /**
   * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，
   * 所有的事件监听器会被移除，所有的子实例也会被销毁。
   */
  destroyed() {},
};
</script> 

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--使用了scoped属性之后，父组件的style样式将不会渗透到子组件中，-->
<!--然而子组件的根节点元素会同时被设置了scoped的父css样式和设置了scoped的子css样式影响，-->
<!--这么设计的目的是父组件可以对子组件根元素进行布局。-->
<style lang="scss" scoped>
.login_container {
  background: #2b4b6b;
  height: 750px;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #dddddd;
    }
  }
}

.btns{
    display: flex;
    justify-content: flex-end;

}
.login_from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
