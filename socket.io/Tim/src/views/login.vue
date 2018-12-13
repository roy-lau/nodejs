<template>
    <div class="login">
        <div class="box">
            <h1 class="title-text">TIMING</h1><br /><br />
            <label for="user">账号：
                <input type="text" id="user" placeholder="请输入账号" />
            </label><br /><br />
            <label for="pwd">密码：
                <input type="text" id="pwd" placeholder="请输入密码" />
            </label><br /><br />
            <router-link to="/Chat" class="login-btn"> 登 录 </router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    components: {}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.box {
    width: 500px;
    height: 300px;
    background-color: #e5ecf6;
    position: absolute;
    top: 30%;
    left: 35%;
    border-radius: 3%;
}

.title-text {
    color: #f35626;
    text-shadow: 1px 2px 1px black;
    background-image: linear-gradient(92deg, #f35626, #feab3a);
    background-clip: text;
    text-fill-color: transparent;
    animation: hue 30s infinite linear;
}

@keyframes hue {
    0% {
        -webkit-filter: hue-rotate(0deg);
    }

    100% {
        -webkit-filter: hue-rotate(-360deg);
    }
}

.login-btn {
    display: inline-block;
    width: 200px;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
    text-decoration: none;
    border-radius: 5%;
    color: white;
    background-color: #409eff;

    &:hover {
        background-color: #3399ff;
    }
}
</style>