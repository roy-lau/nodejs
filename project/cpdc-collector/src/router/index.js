import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DevPage from '../views/DevPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },{
    path: '/setting-page',
    name: 'settingPage',
    component: () => import(/* webpackChunkName: "SettingPage" */ '../views/SettingPage.vue')
  },{
    path: '/dev-page',
    name: 'devPage',
    component: () => import(/* webpackChunkName: "DevPage" */ '../views/DevPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
