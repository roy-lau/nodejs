<template>
  <div id="app">
    <div class="bg-color">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  name: "app",
  components: {},
  props: {},
  computed: {},
  data() {
    return {
      timer: false,
    };
  },
  methods: {},
  mounted() {},
};
</script>
<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  margin: 0;
  padding: 0;
}

div.bg-color {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(125deg, #227afc, #3e50af, #227afc, #3e50af);
  background-size: 800% 800%;
  animation: bgGradient 8s ease infinite;
}

@keyframes bgGradient {
  0% {
    background-position: 98% 0%;
  }

  50% {
    background-position: 5% 100%;
  }

  100% {
    background-position: 98% 0%;
  }
}

/* 公共样式 */
// 左浮动
.fl {
  float: left;
}

.fr {
  float: right;
}

ul {
  padding: 0;
  margin: 0;
  // 整行消息
  li {
    list-style-type: none;
  }
}
.over-fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-top: 80px;
}
@media screen and (max-width: 420px) {
  body {
    min-width: 420px;
  }
}
</style>
