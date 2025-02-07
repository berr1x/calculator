import { createWebHistory, createRouter } from 'vue-router'

import CalculatorView from '@/views/Calculator.vue'
import HistoryView from '@/views/History.vue'
import MainView from '@/views/Main.vue'

const routes = [
    { path: '/', component: MainView },
    { path: '/calculator', component: CalculatorView },
    { path: '/history', component: HistoryView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
