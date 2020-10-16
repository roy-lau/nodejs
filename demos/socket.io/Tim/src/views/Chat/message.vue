<!-- 消息页 -->
<template>
  <div id="message">
    <div class="message-bg">
      <!-- 左侧边栏 消息组 start -->
      <aside class="aside-group over-fill">
        <ul>
          <li
            v-for="item in groupList"
            @click="onClickGroup(item.id)"
            :key="item.id"
            :class="{ active: isActiveId == item.id }"
          >
            <img
              class="imgs fl"
              :src="item.img"
              :title="item.title"
              alt="头像"
              width="50"
              height="50"
            />
            <h4
              class="texts title fl"
              v-text="item.title"
              :title="item.title"
            ></h4>
            <p class="texts disc fl" v-text="item.disc" :title="item.disc"></p>
            <br />
            <span class="icon num fr" v-text="item.iconNum"></span>
            <span class="icon close fr" title="删除">X</span>
          </li>
        </ul>
      </aside>
      <!-- 左侧边栏 消息组 end-->
      <!-- 中间聊天内容 start-->
      <section class="content over-fill">
        <div class="content-msg-area">
          <ul>
            <li v-for="msg in msgList">
              <p class="user-info" :class="{ 'user-self-info': msg.isSelf }">
                <img :src="msg.icon" :alt="msg.id" />
                <span v-text="msg.name"></span>
                <!-- <span v-text="msg.dateTime"></span> -->
              </p>
              <div class="msg-box" :class="{ 'is-self': msg.isSelf }">
                <span v-html="msg.text"></span>
              </div>
            </li>
          </ul>
        </div>
        <div class="content-text-area">
          <!-- <textarea class="content-textarea" v-model="msgText" ></textarea> -->
          <p
            contenteditable="true"
            class="input-text fl"
            ref="msgTexts"
            @keyup.enter="sendMsg"
          ></p>
          <a class="send-btn" @click="sendMsg"> 发 <br />送</a>
        </div>
      </section>
      <!-- 中间聊天内容 end-->
    </div>
  </div>
</template>
<script>
export default {
  name: "message",
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
      msgText:
        '<img data-v-68781400="" src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png" alt="头像" width="60" height="60">',
      msgList: [
        {
          isSelf: true,
          id: 0,
          dateTime: "",
          text: "",
          icon: "https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png",
        },
      ],
      // BScroll 配置参数
      bscrollConf: {
        click: true,
        mouseWheel: {
          // 是否启用鼠标滚轮
          speed: 20, // 鼠标滚轮滚动的速度
          easeTime: 300, // 滚动动画的缓动时长
        },
        scrollbar: {
          fade: true, // 当滚动停止的时候滚动条是否需要渐隐
          interactive: true, //表示滚动条是否可以交互
        },
      },
    };
  },
  methods: {
    // 点击聊天组
    onClickGroup(id) {
      this.isActiveId = id;
    },
    // 发送消息
    sendMsg() {
      this.msgText = this.$refs.msgTexts.innerHTML;
      console.log("msgTextSay : ", this.msgText);
      if (!this.msgText) {
        alert("输入内容不能为空！");
        return;
      }
      this.msgList.push({
        id: (this.msgId += 1),
        text: this.msgText,
        dateTime: Date(),
      });
    },
  },
  created() {
    this.$nextTick(() => {
      this.qqData = JSON.parse(sessionStorage.getItem("qq-login-data"));
    });
  },
  mounted() {},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.message-bg {
  background-color: white;
  width: 100%;

  // 左侧消息组
  .aside-group {
    width: 18%;
    // border-right: 1px solid silver;
    vertical-align: top;
    display: inline-block;
    background-color: #fafafe;
    overflow: auto;

    // 整行消息
    ul li {
      list-style-type: none;
      height: 60px;
      transition: all 0.5s;

      &.active {
        background-color: #ebebeb;
      }

      &:hover {
        background-color: #ebebeb;

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
    background-color: white;
    margin: 80px 0 0 18%; /* 80px 是头部的，18%是左侧列表的*/

    // 消息显示框
    .content-msg-area {
      border-right: 1px solid silver;
      height: 85%;
      overflow: auto;
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
        background-color: #eee;
      }

      .is-self {
        background-color: Khaki;
      }
    }
    // 文本输入区域
    .content-text-area {
      height: 13%;
      text-align: center;
      // 文本输入
      .input-text {
        border: 1px solid silver;
        text-align: left;
        margin: 0;
        width: 95%;
        height: 100%;
        overflow-y: auto;
      }

      // 发送按钮
      .send-btn {
        background-color: ;
        transition: 0.4s ease;

        &:hover {
          // border: 2px solid rgba(255, 255, 255, 1);
        }
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
