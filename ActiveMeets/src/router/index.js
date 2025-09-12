import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivityView from '../views/ActivityView.vue'
import LoginPage from '../views/LoginPage.vue'
import ClientDashboard from '../views/ClientDashboard.vue'
import ManagerDashboard from '../views/ManagerDashboard.vue'
import { authState } from "../auth";

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/activity', name: 'activity', component: ActivityView },
  { path: '/login', name: 'login', component: LoginPage },
  {
    path: '/client',
    name: 'clientDashboard',
    component: ClientDashboard,
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/manager',
    name: 'managerDashboard',
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: 'clubManager' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!authState.isAuthenticated) {
      next('/login');
    } else if (to.meta.role && authState.user.role !== to.meta.role) {
      alert('You are not authorized to access this page.');
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;