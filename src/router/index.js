import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Pays from '../views/Pays.vue'
import FichePays from '../views/FichePays.vue'
import Recherche from '../views/Recherche.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/pays',
      name: 'pays',
      component: Pays
    },
    {
      path: '/fiche-pays/:id',
      name: 'fiche-pays',
      component: FichePays
    },
    {
      path: '/recherche',
      name: 'recherche',
      component: Recherche
    }
  ]
})

export default router
