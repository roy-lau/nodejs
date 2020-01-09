import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
//Add unimported components to ignore list to prevent warnings.
Vue.config.ignoredElements = ['field','block','category','xml','mutation','value','sep']

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
