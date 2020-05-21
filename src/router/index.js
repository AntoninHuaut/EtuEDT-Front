import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import FAQ from '../views/FAQ.vue'
import ViewTimetable from '../views/ViewTimetable.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/faq',
  name: 'FAQ',
  component: FAQ
}, {
  path: '/edt/:edtId',
  name: 'ViewTimetable',
  component: ViewTimetable
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router