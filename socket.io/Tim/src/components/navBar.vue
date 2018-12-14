<template>
    <div id="nav-bar">
        <div class="nav">
            <div class="people-box fl">
                <img src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" alt="头像" width="60" height="60" />
            </div>
                <div class="search fl"><input type="text" placeholder="查询" /></div>
                <div class="lists fl">
                    <router-link to="/Chat/message">消息</router-link>
                    <router-link to="/Chat/contact">联系人</router-link>
                    <router-link to="/Chat/about">关于</router-link>
                </div>
                 <router-link to="/login" class="logout"> 退 出 </router-link>
            </div>
        </div>
</template>
<script>
export default {
    name: 'nav-bar',
    props: {}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.nav {
    color: white;
    height: 80px;
    line-height: 80px;

    // 登录头像
    .people-box {
        margin: 10px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: white;
        cursor: pointer;
    }

    // 搜索框
    .search {
        margin-left: 20px;

        input {
            color: white;
            width: 80px;
            border: 1px solid white;
            border-radius: 8px;
            text-indent: 5px;
            // background-color: #227afc;
            transition: width 1s;

            &:focus {
                width: 120px;
                // background-color: white;
                // div.people-box{display: none;}
            }
        }
    }

    // 导航列表
    .lists {
      margin-left: 30%;
      a{
        // color: white;
        margin: 8px;
      }
    }

    // 退出
    .logout {
          text-decoration: none;
        color: white;
        float: right;
        margin-right: 20px;
    }
}
@media screen and (max-width: 520px) {

   // 导航列表
    .nav .lists {
      margin-left: 10px;
    }
    // 搜索框
    .nav .search {
        display: none;
    }
}
</style>