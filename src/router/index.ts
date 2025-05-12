import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/views/DashboardLayout.vue'
import SellersView from '@/views/SellersView.vue'
import SalesView from '@/views/SalesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
     {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: 'vendedores',
        name: 'vendedores',
        component: SellersView,
      },
      {
        path: 'vendas',
        name: 'vendas',
        component: SalesView,
      },
      // {
      //   path: 'configuracoes',
      //   name: 'configuracoes',
      //   component: ConfiguracoesView,
      // },
      {
        path: '',
        redirect: '/dashboard/vendedores',
      }
    ],
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) {
        console.log(token);
        next()
      } else {
        next('/login')
      }
    }
  }
  ],
})

export default router
