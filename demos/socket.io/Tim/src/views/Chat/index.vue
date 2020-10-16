<!-- 聊天室 —— 主页面 -->
<template>
  <div id="Chat">
    <div>
      <nav-bar />
      <router-view />
    </div>
  </div>
</template>
<script>
import navBar from "@/components/navBar";
export default {
  name: "Chat",
  components: {
    navBar,
  },
  props: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
