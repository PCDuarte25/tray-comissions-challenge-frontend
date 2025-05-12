import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardLayout from '@/views/DashboardLayout.vue'
import SellersView from '@/views/SellersView.vue'
import SalesView from '@/views/SalesView.vue'
import SellerDetailsView from '@/views/SellerDetailsView.vue'
import CreateSaleView from '@/views/CreateSaleView.vue'
import CreateSellerView from '@/views/CreateSellerView.vue'

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}

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
          path: 'criar-vendedor',
          name: 'criar-vendedor',
          component: CreateSellerView,
        },
        {
          path: 'vendedores/:id',
          name: 'seller-details',
          component: SellerDetailsView
        },
        {
          path: 'vendas',
          name: 'vendas',
          component: SalesView,
        },
        {
        path: 'vendedores/:id/cadastrar-venda',
        name: 'create-sale',
        component: CreateSaleView,
        },
        {
          path: '',
          redirect: '/dashboard/vendedores',
        }
      ],
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next('/login');
        }
      }
    }
  ]
});

export default router;
