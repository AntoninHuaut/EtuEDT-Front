import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueClipboard from 'vue-clipboard2'
import isMobile from './plugins/isMobile.js'

Vue.prototype.$isMobile = isMobile
Vue.config.productionTip = false

Vue.use(VueClipboard);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')