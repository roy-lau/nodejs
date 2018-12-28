<!-- 消息页 -->
<template>
    <div id="message">
        <div class="message-bg">
            <!-- 左侧边栏 消息组 start -->
            <aside class="aside-group" ref="listScroll">
                <ul>
                    <li v-for="item in groupList" @click="onClickGroup(item.id)" :key="item.id" :class="{'active':isActiveId==item.id}">
                        <img class="imgs fl" :src="item.img" :title="item.title" alt="头像" width="50" height="50" />
                        <h4 class="texts title fl" v-text="item.title" :title="item.title"></h4>
                        <p class="texts disc fl" v-text="item.disc" :title="item.disc"></p><br />
                        <span class="icon num fr" v-text="item.iconNum"></span>
                        <span class="icon close fr" title="删除">X</span>
                    </li>
                </ul>
            </aside>
            <!-- 左侧边栏 消息组 end-->
            <!-- 中间聊天内容 start-->
            <section class="content">
                <div ref="msgScroll" class="content-box">
                    <ul>
                        <li v-for="msg in msgList">
                            <p class="user-info" :class="{'user-self-info':msg.isSelf}">
                                <img :src="msg.icon" :alt="msg.id"/>
                                <span v-text="msg.name"></span>
                                <!-- <span v-text="msg.dateTime"></span> -->
                            </p>
                            <div class="msg-box" :class="{'is-self':msg.isSelf}">
                                <span v-html="msg.text"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- <textarea class="content-textarea" v-model="msgText" ></textarea> -->
                <p contenteditable="true" class="content-textarea" ref="msgTexts" @keyup.enter="sendMsg"></p>
                <input type="button" value="发 送" class="send-btn fr" @click="sendMsg" />
            </section>
            <!-- 中间聊天内容 end-->
        </div>
    </div>
</template>
<script>
import setHeight from '@/utils/setHeight'
import BScroll from 'better-scroll'
export default {
    name: 'message',
    components: {},
    props: {},
    computed: {
        // msgList(newVal,oldVal){
        //     console.log(newVal,oldVal)
        // },
    },
    data() {
        return {
            isActiveId: null,
            groupList: require("@/data/message.json"),
            msgId: 0,
            msgText: '<img data-v-68781400="" src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" alt="头像" width="60" height="60">',
            msgList: [{
                isSelf: true,
                id: 0,
                dateTime: '',
                text: '',
                icon: 'https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png'
            }],
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
        // 点击聊天组
        onClickGroup(id) {
            this.isActiveId = id;
        },
        // 发送消息
        sendMsg() {
            this.msgText = this.$refs.msgTexts.innerHTML
            console.log("msgTextSay : ", this.msgText)
            this.msgList.push({
                id: this.msgId += 1,
                text: this.msgText,
                dateTime: Date()
            })
            // 最后一个li
            let msgUl = this.$refs.msgScroll.children[0],
                lastLi = msgUl.lastChild
            console.log(lastLi)
            if (this.msgScroll.maxScrollY !== 0) {
                this.msgScrollTo(this.msgScroll.x, this.msgScroll.maxScrollY)
            }
        },
        /**
         * 滚动到指定的位置
         *
         * {Number} x 横轴坐标（单位 px）
         * {Number} y 纵轴坐标（单位 px）
         * {Number} time 滚动动画执行的时长（单位 ms）
         * {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
         */
        msgScrollTo(x, y, time, easing) {
            this.msgScroll.scrollTo(x, y, time, easing)
        }
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
            this.msgScroll = new BScroll(this.$refs.msgScroll, this.bscrollConf)
        })
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.message-bg {
    background-color: white;
    width: 100%;

    // 左侧消息组
    .aside-group {
        position: relative;
        // border-right: 1px solid silver;
        vertical-align: top;
        display: inline-block;
        width: 18%;
        background-color: #FAFAFE;
        overflow: hidden;

        // 整行消息
        ul li {
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
                width: 70%;
                margin: 0;
                text-align: left;
                white-space: nowrap; //文本不换行
                text-overflow: ellipsis; // 超出部分省略号
                overflow: hidden;
            }

            // 标题名
            .title {
                width: 50%;
                margin: 2px;
            }

            // 消息内容 描述
            p.disc {
                height: 20px;
            }

            // 图标
            .icon {
                color: white;
                background-color: red;
                width: 25px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                margin-right: 8px;
                border-radius: 45%;
            }

            // 数字图标
            .num {
                background-color: red;
            }

            // 关闭图标
            .close {
                display: none;
                background-color: gray;
            }
        }
    }

    // 中间内容区域
    .content {
        // border:5px solid yellow;
        display: inline-block;
        width: 62%;

        .content-box {
            position: relative;
            border-right: 1px solid silver;
            height: 80%;
            overflow: hidden;
            padding: 5px;

            // 用户信息
            .user-info {
                height: 50px;
                line-height: 50px;
                vertical-align: middle;

                img {
                    height: 50px;
                    width: 50px;
                    float: left;
                    border-radius: 50%;
                    border: 1px solid gray;

                    &:hover {
                        box-shadow: 2px 2px 2px silver;
                    }
                }

                span {
                    margin-left: 3px;
                    float: left;
                }
            }

            .user-self-info {
                height: 50px;
                line-height: 50px;
                vertical-align: middle;

                img {
                    height: 50px;
                    width: 50px;
                    float: right;
                    border-radius: 50%;
                    border: 1px solid gray;

                    &:hover {
                        box-shadow: 2px 2px 2px silver;
                    }
                }

                span {
                    margin-right: 3px;
                    float: right;
                }
            }

            // 消息框
            .msg-box {
                padding: 5px;
                margin: 8px;
                border-radius: 5px;
                background-color: #EEE;
            }

            .is-self {
                background-color: Khaki;
            }
        }

        .content-textarea {
            display: inline-block;
            border: 1px solid silver;
            margin: 0;
            width: 93%;
            height: 18%;
            overflow-y: scroll;

        }

        // 发送按钮
        .send-btn {
            display: block;
            width: 6%;
            height: 50px;
            line-height: 50px;
            color: #2dcb70;
            background-color: #333;
            font-family: Arial;
            font-weight: bolder;
            border: 2px solid rgba(255, 255, 255, 0.6);
            text-align: center;
            margin: 0 auto; // background: url(../images/allow.png) no-repeat 130px center;
            box-sizing: border-box;
            transition: 0.4s ease;

            &:hover {
                border: 2px solid rgba(255, 255, 255, 1);
            }
        }
    }
}

// max-width: 1366px 小于 1366px
// 媒体查询
@media screen and (max-width: 1366px) and (min-width: 820px) {

    // 消息内容 描述
    p.disc {
        display: none;
    }
}

@media screen and (max-width: 820px) and (min-width: 420px) {

    // 左侧消息组
    .message-bg .aside-group {
        width: 13%;
        position: relative;

        // 标题名 && 消息内容 描述
        .title,
        .disc {
            display: none;
        }

        // 图标
        .icon {
            margin-top: -6px;
            position: absolute;
            left: 35px;
        }
    }
}

@media screen and (max-width: 420px) {

    // 左侧消息组
    .message-bg .aside-group {
        width: 100%;
    }
}
</style>