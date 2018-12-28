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
            <p>
                <span @click="onOtherLogin" v-show="!isShow" class="other-login-cls">第三方登录</span>
                <!-- <qq-login v-show="isShow" /> -->
                <span id="qqLoginBtn"  v-show="isShow" title="点击QQ登录">登录qq</span>
            </p>
        </div>
    </div>
</template>
<script>
import qqLogin from "@/components/loginGroup/qq.vue"
export default {
    name: 'login',
    components: {
        qqLogin
    },
    props: {},
    computed: {},
    data() {
        return {
            isShow: false,
        }
    },
    methods: {
        onOtherLogin() {
            this.isShow = !this.isShow;
            let self = this;
            //调用QC.Login方法，指定btnId参数将按钮绑定在容器节点中
            QC.Login({
                //btnId：插入按钮的节点id，必选
                btnId: "qqLoginBtn",
                //用户需要确认的scope授权项，可选，默认all
                scope: "all",
                //按钮尺寸，可用值[A_XL| A_L| A_M| A_S|  B_M| B_S| C_S]，可选，默认B_S
                size: "C_S"
            }, function(reqData, opts) { //登录成功
                console.log("reqData: ", reqData, "opts: ", opts)
                self.$router.push('/Chat')
                sessionStorage.setItem("qq-login-data", JSON.stringify(reqData))
            }, function(opts) { //注销成功
                self.$router.push('/login')
                // alert('QQ登录 注销成功');
            });
        },

    },

    mounted() {
        // this.$nextTick(() => {
        // })
    }
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
    text-align: center;
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

// 第三方登录方式
.other-login-cls {
    color: gray;

}

.other-login-cls:hover {
    color: black;
    cursor: pointer;
}

// qq登录按钮
#qqLoginBtn:hover,
img[alt="QQ登录"] {
    background-color: red;
    transform: scale(1.5);
}
</style>