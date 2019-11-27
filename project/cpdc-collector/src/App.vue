<template>
    <v-app>
        <v-card>
            <Header />
            <v-sheet id="scrolling-techniques-id" class="overflow-y-auto sheet-cls" :max-height="curHeight">
                <v-container>
                    <router-view />
                </v-container>
            </v-sheet>
        </v-card>
    </v-app>
</template>
<script>
import Header from './views/Header';
export default {
    name: 'App',

    components: {
        Header,
    },

    data: () => ({
        curHeight: '800'
    }),
    created(){
      this.curHeight = window.outerHeight - 100
      // console.log(this.curHeight)
    }
};
</script>
<style>
body::-webkit-scrollbar {
    display: none
}
.sheet-cls{
  padding-top: 280px;
}
</style>