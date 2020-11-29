<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--添加按钮-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="rolesList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'thenr']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!--渲染一级权限-->

              <el-col :span="5">
                <el-tag @close="remove(scope.row, item1.id)" closable>{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二和三级权限-->
              <el-col :span="19">
                <!--渲染二级权限-->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'thenr']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="remove(scope.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      @close="remove(scope.row, item3.id)"
                      closable
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分配权限对话框  -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRight"
        width="50%" @close='setclosed'>
      <!--树形控件  -->
        <el-tree :data="rightsList" :props="treeProps"  
        show-checkbox node-key="id" 
        default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRight = false">取 消</el-button>
          <el-button type="primary" @click="allot"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 组件名称.id
  name: "demo",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      //  所以角色列表数据
      rolesList: [],
      setRight:false,
      rightsList:[],
      // 树形控件属性绑定对象
      treeProps: {
          children: 'children',
          label: 'authName'
        },
        defKeys:[],
        // 当前分配角色的id
        roleId:''
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 获取所以角色列表
    async getroles() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    // 删除对应的权限
    async remove(role, rightId) {
      // 弹框提示用户是否删除
      const conft = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (conft !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }

      role.children = res.data;
      // this.getroles()
    },
    // 展示分配对话框
   async showDialog(role) {
     this.roleId=role.id
    //  获取所有权限数据
  const {data:res}= await this.$axios.get("rights/tree")
      
      if(res.meta.status!==200){
       return this.$$message.error('获取权限失败')
      } 
      // 获取权限保存data中
      this.rightsList=res.data
      // 递归传递
      this.getkeYs(role,this.defKeys)

       this.setRight=true
    },
    //通过递归获取id
    getkeYs(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
          this.getkeYs(item, arr)
      });
    },
    setclosed(){
      this.defKeys=[]
    },
    // 点击确认分配权限
   async  allot(){
      const keys=[
         ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr=keys.join(',')
   const {data:res}=await this.$axios.post(`roles/${this.roleId}/rights`
   ,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getroles()
      this.setRight = false
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
  created() {
    this.getroles();
  },
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
<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.thenr {
  display: flex;
  align-items: center;
}
</style>
