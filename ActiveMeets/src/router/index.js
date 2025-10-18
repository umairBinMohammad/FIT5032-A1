import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivityView from '../views/ActivityView.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ClientDashboard from '../views/ClientDashboard.vue'
import ManagerDashboard from '../views/ManagerDashboard.vue'
import ActivityManagerView from '../views/ActivityManagerView.vue' // New import
import { authState } from "../auth";

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
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
  },
  {
    path: '/client/activities', // Client-specific activity view
    name: 'clientActivities',
    component: ActivityView,
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/manager/activities', // Manager-specific activity view
    name: 'managerActivities',
    component: ActivityManagerView,
    meta: { requiresAuth: true, role: 'clubManager' }
  },
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