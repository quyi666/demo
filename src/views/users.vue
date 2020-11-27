<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!--搜索+添加区域  -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getuser"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuser"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true"
            >添加</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table border stripe :data="userList" style="width: 100%">
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userstate(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="show(scope.row.id)"
              circle
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="open(scope.row.id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!--添加-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      @close="addDialog"
      width="30%"
    >
      <el-form ref="from" :rules="rules" :model="addFrom" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="提示" :visible.sync="flag" width="50%" @close="editClick">
      <el-form ref="from" :rules="rules" :model="editFrom" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="addEdit">确 定</el-button>
      </span>
    </el-dialog>
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
    var checkEmail = (rule, value, cd) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的邮箱"));
    };
    // 验证手机号
    var checkMobile = (rule, value, cd) => {
      const regMoble = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoble.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的电话"));
    };

    return {
      // 用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      input: "",
      //
      userList: [],
      total: 0,
      value: true,
      dialogVisible: false,
      //  验证规则
      rules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字母",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码名称", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },

          {
            pattern: /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/,
            message: "请输入正确手机号",
            trigger: "blur",
          },
        ],
      },

      addFrom: {
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      editFrom: {
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      flag: false,
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   获取用列表数据
    async getuser() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.console.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
      // console.log(this.userList);
    },
    //分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getuser();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getuser();
      // console.log(`当前页: ${val}`);
    },
    // 状态
    async userstate(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );

      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户失败");
      }
      this.$message.success("更新用户成功");
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 监听添加用户对话框的关闭事件
    addDialog() {
      this.$refs.from.resetFields();
    },
    // 添加
    adduser() {
      this.$refs.from.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios
          .post("users", this.addFrom)
          .then((res) => {
            console.log(res);
            if (res.data.meta.status == 201) {
              this.$message.success("添加成功");
              this.dialogVisible = false;
            } else {
              this.$message.error("添加失败");
            }
          });
      });
      this.getuser();
    },
    // 编辑对话框
    async show(id) {
      const { data: res } = await this.$axios.get("users/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editFrom = res.data;
      this.flag = true;
    },

    editClick() {
      this.$refs.from.resetFields();
    },
    addEdit() {
      this.$refs.from.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "users/" + this.editFrom.id,
          {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile,
          }
        );
        this.flag = false;
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败");
        }
        // 关闭对话框
        this.flag = false;
        // 刷新数据列表
        this.getuser();
        // 更新成功
        this.$message.success("更新成功");
      });
    },
    // 删除
    async open(id) {
      const delForm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (delForm !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$axios.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success(res.meta.msg);
      this.getuser();
    },
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
    this.getuser();
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
.el-breadcrumb {
  margin-bottom: 10px;
}
.el-caed {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) ！importart;
}
</style>
