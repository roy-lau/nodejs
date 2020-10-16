<!-- 初始个页面 -->
<template>
  <div id="qq">
    <img
      @click="onqqLogin"
      class="qq-img-cls"
      src="./qq_login.gif"
      alt="QQ登录"
      title="QQ登录"
    />
  </div>
</template>
<script>
// import "index.js"
export default {
  name: "qq",
  components: {},
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {
    // 新打开个页面 （登录成功后 关闭）
    onqqLogin() {
      QC.Login.showPopup((opts) => {
        console("showPopup-opts: ", opts);
      });
      let self = this;
      QC.Login(
        {
          //btnId：插入按钮的节点id，必选
          btnId: "qqLoginBtn",
          //用户需要确认的scope授权项，可选，默认all
          scope: "all",
        },
        function (reqData, opts) {
          //登录成功
          // console.log("reqData: ", reqData, "opts: ", opts)
          self.$router.push("/Chat");
          sessionStorage.setItem("qq-login-data", reqData);
        },
        function (opts) {
          //注销成功
          self.$router.push("/login");
          // alert('QQ登录 注销成功');
        }
      );
    },
  },
  created() {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#qq {
  display: inline;
  cursor: pointer;
}

#qq:hover .qq-img-cls {
  transform: scale(1.2);
}

.qq-img-cls {
}
</style>
