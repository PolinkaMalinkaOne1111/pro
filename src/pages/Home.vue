<script setup>
import { reactive, watch, ref, onMounted, provide } from 'vue'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'
import axios from 'axios'
import { supabase } from '@/supabase'

const { cart, addToCart, removeFromCart, user } = inject('cart')

const items = ref([])

const filters = reactive({
  sortBy: '1',
  sortByCat: '',
  searchQuery: '',
})
const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const { data: userId } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.value.id)

      const obj = {
        item_id: item.id,
        user_id: userId[0].id,
      }
      item.isFavorite = true

      await supabase.from('favorites').insert([obj])

      const { data: favorId } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId[0].id)
        .eq('item_id', item.id)

      item.favoriteId = favorId[0].id
    } else {
      item.isFavorite = false
      const { data: userId } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.value.id)
      // console.log(user.value.id)
      const userId1 = userId[0].id
      await supabase.from('favorites').delete().eq('id', item.favoriteId).eq('user_id', userId1)
    }
  } catch (err) {
    console.log(err)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSelectCat = (event) => {
  filters.sortByCat = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
}

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: userId } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.value.id)
    // console.log(user.value.id)
    const userId1 = userId[0].id

    const { data: favorites } = await supabase.from('favorites').select('*').eq('user_id', userId1)

    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id)

      if (!favorite) {
        return item
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    }

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }

    if (filters.sortByCat.length != 0) {
      params.category = `${filters.sortByCat}`
    }

    const masItems = (products) => {
      items.value = products.map((obj) => ({
        ...obj,
        isFavorite: false,
        favoriteId: null,

        isAdded: false,
      }))
    }
    let query = supabase.from('items').select('*')

    if (params.sortBy == 'true1') {
      query = query.order('price', { ascending: true })
    }

    if (params.sortBy == 'false1') {
      query = query.order('price', { ascending: false })
    }

    if (params.category) {
      query = query.eq('category', params.category)
    }

    if (params.title) {
      query = query.ilike('title', `%${params.title}%`)
    }
    const { data: products, error } = await query
    masItems(products)
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  const localCart = localStorage.getItem('cart')

  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }))
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }))
})

watch(filters, fetchItems)
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Оборудование</h2>
    <div class="flex gap-4">
      <select
        @change="onChangeSelectCat"
        class="py-2 px-3 border border-gray-200 outline-none rounded-md"
      >
        <option value="">Все категории</option>
        <option value="set">Сетевое оборудование</option>
        <option value="bes">Беспроводные решения</option>
        <option value="tel">Телефонные системы</option>
        <option value="cab">Кабели и соединители</option>
        <option value="ser">Серверное оборудование</option>
        <option value="opt">Оптическое оборудование</option>
      </select>
      <select
        @change="onChangeSelect"
        class="py-2 px-3 border border-gray-200 outline-none rounded-md"
      >
        <option value="1">Без сортировки</option>
        <option value="true1">По возрастанию цены</option>
        <option value="false1">По убыванию цены</option>
      </select>
      <div class="relative">
        <img class="absolute left-4 top-3" src="/search.svg" />
        <input
          @input="onChangeSearchInput"
          class="border border-gray-200 rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>
  <div class="mt-8">
    <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
  </div>
</template>
