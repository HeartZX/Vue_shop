import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Reports from '../components/Reports.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/GoodsList.vue'
import AddGoods from '../components/goods/AddGoods.vue'
import EditGoods from '../components/goods/EditGoods.vue'
import Orders from '../components/Orders.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/reports', component: Reports },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: AddGoods },
      { path: '/goods/edit', component: EditGoods },
      { path: '/orders', component: Orders }
    ]
  }
]
const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()放行 next(./login) 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (tokenStr) {
    next()
  } else {
    next('/login')
  }
})

export default router
