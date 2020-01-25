<template>
      <v-app-bar
      absolute
      color="#6A76AB"
      dark
      shrink-on-scroll
      prominent
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-id"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-btn icon tag="a" href="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-toolbar-title>CPDC</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

     <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
            <v-list-item>中心管理</v-list-item>
            <v-list-item>院端管理</v-list-item>
            <v-list-item>知识库</v-list-item>
            <v-list-item tag="a" href="/setting-page">设置</v-list-item>
            <v-list-item tag="a" href="/dev-page">开发</v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-tabs
	      v-show="$route.name==='home'"
          align-with-title
          background-color="transparent"
        >
          <v-tab>病例列表</v-tab>
          <v-tab>Tab 2</v-tab>
          <v-tab>Tab 3</v-tab>
        </v-tabs>
      </template>


    </v-app-bar>

</template>

<script>
export default {
    name: 'Header',

    created(){
     console.log(this.$route)
    }
};
</script>