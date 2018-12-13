<!-- 消息页 -->
<template>
    <div id="message">
        <div class="message-bg">
            <aside class="aside-group">
                <ul>
                    <li v-for="item in massageList">
                        <img class="imgs fl" :src="item.img" alt="头像" width="50" height="50" />
                        <h4 class="title fl" v-text="item.title"></h4>
                        <p class="disc fl" v-text="item.disc"></p>
                        <span class="icon-num fl" v-text="item.iconNum"></span>
                    </li>
                </ul>
            </aside>
        </div>
    </div>
</template>
<script>
export default {
    name: 'message',
    components: {

    },
    props: {},
    computed: {},
    data() {
        return {
            massageList: [{
                img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544710583177&di=cf8d727301416363f28d614c234a7505&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F70%2F40%2Fse16704032.jpg',
                title: '红袖添香',
                disc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non consequatur, ducimus optio sequi consectetur, aliquid natus animi voluptatibus laudantium unde, facilis ut officiis nihil a libero repellendus. Reprehenderit, totam, omnis.',
                iconNum: '60'
            }, {
                img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544710583177&di=cf8d727301416363f28d614c234a7505&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F70%2F40%2Fse16704032.jpg',
                title: '酒干荞麦无',
                disc: '库连接放大了圣诞节了打飞机阿萨德了开发啥发送到',
                iconNum: '80'
            }, {
                img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544710583177&di=cf8d727301416363f28d614c234a7505&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F70%2F40%2Fse16704032.jpg',
                title: '酒干荞麦2',
                disc: '库连接放',
                iconNum: '80'
            }]
        }
    },
    methods: {

    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.message-bg {
    background-color: white;
    width: 100%;
    height: 860px;

    // 左侧消息组
    .aside-group {
        width: 18%;
        height: 860px;
        background-color: silver;

        ul {
            padding: 0;

            li {
                list-style-type: none;
                height: 60px;
                // line-height: 60px;
                img{
                  margin: 3px;
                  border-radius: 50%;
                }
                .title{
                  margin: 2px;
                }
                p.disc{
                  height: 20px;
                  width: 70%;
                  margin: 0;
                  white-space:nowrap; //文本不换行
                  text-overflow: ellipsis; // 超出部分省略号
                  overflow: hidden;
                }
                &:hover{
              color: white;
                  background-color:gray;
                  cursor: pointer;
                }
            }
        }
    }
}
</style>