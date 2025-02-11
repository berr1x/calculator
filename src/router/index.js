import { createWebHistory, createRouter } from 'vue-router'

//добавил ленивую загрузку компонентов
const routes = [
    { path: '/', component: () => import('@/views/Main.vue') },
    { path: '/calculator', component: () => import('@/views/Calculator.vue') },
    { path: '/history', component: () => import('@/views/History.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
