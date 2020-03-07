import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import("./views/login.vue")
        },
        {
            path: '/Chat',
            name: 'Chat',
            component: () => import( /* webpackChunkName: "Chat" */ './views/Chat'),
            children: [{
                path: 'message',
                name: '消息',
                component: () => import( /* webpackChunkName: "chatMessage" */ './views/Chat/message'),
            },{
                path: 'contact',
                name: '联系人',
                component: () => import( /* webpackChunkName: "chatContact" */ './views/Chat/contact'),
            },{
                path: 'about',
                name: '关于',
                component: () => import( /* webpackChunkName: "chatAbout" */ './views/Chat/about'),
            }]
        }
    ]
})