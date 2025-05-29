<script setup>
import { ref, watch, provide, computed, onMounted } from 'vue'
import axios from 'axios'

import { supabase } from '@/supabase'

import Header from './components/Header.vue'

import CardList from './components/CardList.vue'
import Drawer from './components/Drawer.vue'

// КОРЗИНА начало
const cart = ref([])

const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true },
)

// КОРЗИНА конец

const user = ref(null)
const isLoading = ref(true)
const isAdmin = ref(false)
// Проверка текущей сессии при загрузке компонента
onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  user.value = session?.user ?? null
  isLoading.value = false
})

// Подписка на изменения статуса аутентификации
supabase.auth.onAuthStateChange((event, session) => {
  user.value = session?.user ?? null

  console.log('Auth state changed:', event)
})

provide('cart', {
  cart,
  user,
  closeDrawer,

  openDrawer,
  addToCart,
  removeFromCart,
})
</script>

<template>
  <Drawer v-if="drawerOpen" :total-price="totalPrice" :vat-price="vatPrice" />

  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14 mb-16">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />

    <div class="pl-10 mt-5 items-center">
      <div v-if="isLoading" class="text-xl italic text-slate-400">Проверка авторизации...</div>
      <div v-else>
        <div v-if="user" class="text-xl italic text-slate-400">
          Добро пожаловать, {{ user.email }}!
          <button
            @click="supabase.auth.signOut()"
            class="cursor-pointer font-bold underline text-slate-700"
          >
            Выйти
          </button>
        </div>
        <div v-else class="text-xl italic text-slate-400">
          Вы не авторизованы
          <router-link to="/auth" class="cursor-pointer font-bold underline text-slate-700"
            >Войти</router-link
          >
        </div>
        <div v-if="isAdmin"><h1>АДМИН</h1></div>
      </div>
    </div>

    <div class="pl-10 pr-10 pt-3 pb-10">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>
