<!-- 联系人 -->
<template>
    <div id="contact">
        <div class="wrapper" ref="wrapper">
            <ol ref="list" class="list-cls">
                <li v-for="item in 30" :key="item" v-text="item"></li>
            </ol>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    name: 'contact',
    components: {
    },
    props: {},
    computed: {},
    data() {
        return {}
    },
    methods: {

    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.wrapper, {
                mouseWheel: { // 是否启用鼠标滚轮
                    speed: 20, // 鼠标滚轮滚动的速度
                    easeTime: 300 // 滚动动画的缓动时长
                },
                scrollbar: {
                    fade: true, // 当滚动停止的时候滚动条是否需要渐隐
                    interactive: true //表示滚动条是否可以交互
                }
            })
        })
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
    position:relative;
    height: 100px;
    overflow: hidden;
}
</style>