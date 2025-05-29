import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import Home from './pages/Home.vue'
import Contact from './pages/Contact.vue'
import Auth from './pages/Auth.vue'
import Registration from './pages/Registration.vue'
import Profile from './pages/Profile.vue'
import Admin from './pages/Admin.vue'

import Favorites from './pages/Favorites.vue'

const app = createApp(App)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/registration', name: 'Registration', component: Registration },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/admin', name: 'Admin', component: Admin },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(autoAnimatePlugin)
app.use(router)
app.mount('#app')
