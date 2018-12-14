<!-- 消息页 -->
<template>
    <div id="message">
        <div class="message-bg">
            <!-- 左侧边栏 消息组 start -->
            <aside class="aside-group">
                <ul>
                    <li v-for="item in groupList" @click.self="onClickGroup">
                        <img class="imgs fl" :src="item.img" :title="item.title" alt="头像" width="50" height="50" />
                        <h4 class="texts title fl" v-text="item.title" :title="item.title"></h4>
                        <p class="texts disc fl" v-text="item.disc" :title="item.disc"></p><br />
                        <span class="icon num fr" v-text="item.iconNum"></span>
                        <span class="icon close fr">X</span>
                    </li>
                </ul>
            </aside>
            <!-- 左侧边栏 消息组 end-->
            <!-- 中间聊天内容 start-->
            <section class="content">
                <ul class="content-box">
                    <li v-for="msg in msgList">
                        <p class="user-info">
                            <img :src="msg.icon" alt="" />
                            <span v-text="msg.id"></span>—
                            <span v-text="msg.name"></span>—
                            <span v-text="msg.dateTime"></span>
                        </p>
                        <span v-html="msg.text"></span>
                    </li>
                </ul>
                <!-- <textarea class="content-textarea" v-model="msgText" ></textarea> -->
                <p contenteditable="true" class="content-textarea" ref="msgTexts"></p>
                <!-- <input type="button" value="发 送" class="send-btn fr" @click="sendMsg"/> -->
                <a class="send-btn fr">
                  <span class="line line-top"></span>
                  <span class="line line-right"></span>
                  <span class="line line-bottom"></span>
                  <span class="line line-left"></span>
                  SEND
              </a>
            </section>
            <!-- 中间聊天内容 end-->
        </div>
    </div>
</template>
<script>
import setHeight from '@/utils/setHeight'
export default {
    name: 'message',
    components: {},
    props: {},
    computed: {},
    data() {
        return {
            groupList: [{
                img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544710583177&di=cf8d727301416363f28d614c234a7505&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F70%2F40%2Fse16704032.jpg',
                title: '红袖添香',
                disc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non consequatur, ducimus optio sequi consectetur, aliquid natus animi voluptatibus laudantium unde, facilis ut officiis nihil a libero repellendus. Reprehenderit, totam, omnis.',
                iconNum: '60'
            }, {
                img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544710583177&di=cf8d727301416363f28d614c234a7505&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F70%2F40%2Fse16704032.jpg',
                title: '上古的猿群 ',
                disc: '库连接放大了圣诞节了打飞机阿萨德了开发啥发送到',
                iconNum: '80'
            }, {
                img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544710583177&di=cf8d727301416363f28d614c234a7505&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F70%2F40%2Fse16704032.jpg',
                title: '酒',
                disc: '库连接放',
                iconNum: '8'
            }],
            msgId: 0,
            msgText: '<img data-v-68781400="" src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" alt="头像" width="60" height="60">',
            msgList: [{
                id: 0,
                dateTime: '',
                text: '',
                icon: 'https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png'
            }]
        }
    },
    methods: {
        // 点击聊天组
        onClickGroup(e) {
            console.log(e.target)
        },
        // 发送消息
        sendMsg() {
            this.msgText = this.$refs.msgTexts.innerHTML
            console.log("msgText : ", this.msgText)
            this.msgList.push({
                id: this.msgId += 1,
                text: this.msgText,
                dateTime: Date()
            })
        },
    },
    mounted() {
        setHeight()
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
        border-right: 1px solid silver;
        vertical-align: top;
        display: inline-block;
        width: 18%;
        background-color: #FAFAFE;
        // overflow-x:  scroll;

        // 整行消息
        ul li {
            list-style-type: none;
            height: 60px;
            transition: all .5s;

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
                margin-right: 5px;
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
            height: 80%;
            overflow: scroll;
            padding: 5px;

            // 用户信息
            .user-info {
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 1px solid gray;

                    &:hover {
                        box-shadow: 2px 2px 2px silver;
                    }
                }
            }
        }

        .content-textarea {
            display: inline-block;
            border: 1px solid silver;
            margin: 0;
            width: 93%;
            height: 18%;
        }

        // 发送按钮
        .send-btn {
            display: block;
            width: 6%;
            height: 50px;
            line-height: 50px;
            text-decoration: none;
            color: #2dcb70;
            background-color: #333;
            font-family: Arial;
            font-weight: bolder;
            border: 2px solid rgba(255, 255, 255, 0.6);
            text-align: center;
            margin: 0 auto; // background: url(../images/allow.png) no-repeat 130px center;
            box-sizing: border-box;
            transition: 0.4s ease;
            position: relative;

            &:hover {
                border: 2px solid rgba(255, 255, 255, 1);
                background-position: 140px center;

                .line {
                    background: #2dcb70;
                }

                .line-top {
                    width: 70px;
                    left: -2px;
                }

                .line-right {
                    height: 50px;
                    top: -2px;
                }

                .line-bottom {
                    width: 70px;
                    right: -2px;
                }

                .line-left {
                    height: 50px;
                    bottom: -2px;
                }
            }

            .line {
                position: absolute;
                background: none;
                transition: 0.4s;
            }

            .line-top {
                width: 0px;
                height: 2px;
                top: -2px;
                left: -110%;
            }

            .line-right {
                width: 2px;
                height: 0px;
                right: -2px;
                top: -110%;
            }

            .line-bottom {
                width: 0px;
                height: 2px;
                bottom: -2px;
                right: -110%;
            }

            .line-left {
                width: 2px;
                height: 0px;
                left: -2px;
                bottom: -110%;
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