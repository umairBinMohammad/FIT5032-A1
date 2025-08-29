import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ActivityView from '../views/ActivityView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/activity', name: 'activity', component: ActivityView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
