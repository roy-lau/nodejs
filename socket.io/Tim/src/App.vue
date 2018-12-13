<template>
    <div id="app">
        <div class="bg-color">
            <router-view />
        </div>
    </div>
</template>
<style lang="less">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

html,
body {
    margin: 0;
    padding: 0;
}

div.bg-color {
    width: 100%;
    height: 940px;
    background: linear-gradient(125deg, #227afc, #3e50af, #227afc, #3e50af);
    background-size: 800% 800%;
    animation: AnimationName 8s ease infinite;

}

@keyframes AnimationName {
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
</style>