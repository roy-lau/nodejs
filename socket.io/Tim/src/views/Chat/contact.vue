<!-- 联系人 -->
<template>
    <div id="contact">
        <!-- 左侧边栏 start -->
        <aside class="aside-group fl" ref="listScroll">
            <!-- 好友组 start -->
            <div class="tebs-line">
                <span>好友</span>
                <span>群聊</span>
            </div>
            <!-- 好友组 end -->
            <!-- 好友列表 start -->
            <ul>
                <li class="group-list" v-for="list in groupList" @click="onClickGroup(list.id)" :title="list.text">
                    >
                    <span class="text">{{list.text}}</span>
                    &nbsp;&nbsp;
                    {{list.num}}/{{list.num}}
                </li>
            </ul>
            <!-- 好友列表 end -->
            <!-- 好友信息 start -->
            <ul class="group-item">
                <li v-for="item in groupItem" :key="item.id" :class="{'active':isActiveId==item.id}">
                    <img class="imgs fl" :src="item.img" :title="item.title" alt="头像" width="50" height="50" />
                    <h4 class="texts title fl" v-text="item.title" :title="item.title"></h4>
                    <p class="texts disc fl" v-text="item.disc" :title="item.disc"></p>
                </li>
            </ul>
            <!-- 好友信息 end -->
        </aside>
        <!-- 左侧边栏 end-->
       <!-- 中间内容 start-->
        <section class="content">
            <div class="content-box">
                <ul class="user-info-box">
                    <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2244649555,922047850&fm=26&gp=0.jpg" alt="" height="80" />
                    <!-- {{qqData}} -->
                    <h3 v-text="qqData.nickname"></h3>
                    <li>人生如戏！！！！！！！</li>
                    <br />
                    <li>账号： 8888888888</li>
                    <li>昵称： 昵称</li>
                    <li>
                      <label for="">备注<input type="text" /></label>
                    </li>
                    <li>
                      <label for="">分组<input type="text" /></label>
                    </li>
                    <li>邮箱： 123@qq.com</li>
                    <li>职业： 风投</li>
                    <li>个人： 18 女 天平座</li>
                    <li>所在地： {{qqData.province}}</li>
                    <li>学习： 北大</li>
                    <li>故乡： {{qqData.city}}</li>
                    <li>备注信息： </li>
                </ul>
            </div>
        </section>
        <!-- 中间内容 end-->
    </div>
</template>
<script>
import setHeight from '@/utils/setHeight'
import BScroll from 'better-scroll'
export default {
    name: 'contact',
    components: {},
    props: {},
    computed: {},
    data() {
        return {
            isActiveId: null,
            qqData:{},
            groupList: [{
                num: 100,
                text: "三千弱水",
            }],
            groupItem: require("@/data/message.json"),
            // BScroll 配置参数
            bscrollConf: {
                click: true,
                mouseWheel: { // 是否启用鼠标滚轮
                    speed: 20, // 鼠标滚轮滚动的速度
                    easeTime: 300 // 滚动动画的缓动时长
                },
                scrollbar: {
                    fade: true, // 当滚动停止的时候滚动条是否需要渐隐
                    interactive: true //表示滚动条是否可以交互
                }
            }
        }
    },
    methods: {

    },
 created() {
        this.$nextTick(() => {
             this.qqData=JSON.parse(sessionStorage.getItem("qq-login-data"))
        })
    },
    mounted() {
        this.$nextTick(() => {
            setHeight('aside-group', 80)
            setHeight('content', 80)
            this.listScroll = new BScroll(this.$refs.listScroll, this.bscrollConf)
        })
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.contact{
    background-color: white;
    width: 100%;
}
.tebs-line {
    height: 30px;
    background-color: #FAFAFE;
    border-bottom: 1px solid silver;
    line-height: 30px;
    vertical-align: middle;

    span {
        height: 100%;
        width: 50%;
        display: inline-block;
        transition: all .5s;
        text-align: center;
        font-weight: bold;
        color: gray;

        &:hover {
            color: black;
            border-bottom: 1px solid blue;
            cursor: pointer;
        }
        &.cur {
            color: black;
            border-bottom: 1px solid blue;
            cursor: pointer;
        }
    }
}
/* 侧边 */
.aside-group {
    position: relative;
    width: 18%;
    background-color: #FAFAFE;
    overflow: hidden;

    // 分组列表
    .group-list {
        list-style-type: none;
        padding: 5px;
        transition: all .5s;
        .text{
          width: 70%;
          display: inline-block;
          white-space: nowrap; //文本不换行
          text-overflow: ellipsis; // 超出部分省略号
          overflow: hidden;
        }
        &:hover {
            background-color: #EBEBEB;
        }
    }
    // 分组人员项
    .group-item {
        width: 99%;
        display: inline-block;

        // 整行好友
        li {
            list-style-type: none;
            height: 60px;
            transition: all .5s;

            &.active {
                background-color: #EBEBEB;
            }

            &:hover {
                background-color: #EBEBEB;

                .num {
                    display: none;
                }

                .close {
                    cursor: pointer;
                    display: block;
                }
            }

            // 图片
            img {
                margin: 3px;
                background-color: white;
                border-radius: 50%;
            }

            .texts {
                width: 80%;
                margin: 0;
                text-align: left;
                white-space: nowrap; //文本不换行
                text-overflow: ellipsis; // 超出部分省略号
                overflow: hidden;
            }

            // 标题名
            .title {
                width: 60%;
                margin: 2px;
            }

            // 描述
            p.disc {
                height: 20px;
            }
        }
    }
}
/* 中间内容 */
.content {
    display: inline-block;
    width: 82%;
    background-color: white;

    .content-box{
      width: 50%;
      margin:0 auto;
      text-align: center;
      margin-top: 30px;
      background-color: #EBEBEB;
    }
}
</style>