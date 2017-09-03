import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: home
  }, {
    path: '/write',
    name: 'writer',
    component: resolve => require(['@/components/writer'], resolve)
  }, {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/components/login'], resolve)
  }, {
    path: '/posts',
    name: 'posts',
    component: resolve => require(['@/components/posts'], resolve)
  }, {
    path: '/about',
    name: 'about',
    component: resolve => require(['@/components/about'], resolve)
  }, {
    path: '*',
    redirect: '/'
  }]
})
