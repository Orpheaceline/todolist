import Vue from 'vue'
import Router from 'vue-router'
import Home from 'pages/Home'
import Login from 'pages/Login'
import Register from 'components/Register'
import ManageList from 'pages/ManageList'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/manage-list',
      name: 'manage-list',
      component: ManageList
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})
export default router
