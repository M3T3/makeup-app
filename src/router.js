import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import ProductPage from './components/product/ProductPage.vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/product/:id/details',
      name: 'product-page',
      component: ProductPage,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
