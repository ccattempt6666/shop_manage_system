import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
// import Rights from '../components/Rights.vue'
// 路由懒加载
const Rights = () => import('../components/Rights.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 设置导航守卫
router.beforeEach((to, form, next) => {
  const path = to.path
  const token = localStorage.getItem('token')
  if (path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
