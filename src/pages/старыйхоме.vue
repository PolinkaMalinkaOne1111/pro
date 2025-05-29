<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'
import axios from 'axios'
import { supabase } from '@/supabase'
const { cart, addToCart, removeFromCart } = inject('cart')

const items = ref([])

const filters = reactive({
  sortBy: '1',
  sortByCat: '',
  searchQuery: '',
})

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        item_id: item.id,
      }
      item.isFavorite = true
      const { data } = await axios.post('https://f56ab83a6b82a589.mokky.dev/favorites', obj)

      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://f56ab83a6b82a589.mokky.dev/favorites/${item.favoriteId}`)
    }
  } catch (err) {
    console.log(err)
  }

  // item.isFavorite = !item.isFavorite
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

  console.log(cart)
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get('https://f56ab83a6b82a589.mokky.dev/favorites')

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
    console.log(params.sortBy)

    if (params.sortBy == 'true1') {
      const { data: products, error } = await supabase
        .from('items')
        .select('*')
        .order('price', { ascending: true })
      masItems(products)
    } else if (params.sortBy == 'false1') {
      const { data: products, error } = await supabase
        .from('items')
        .select('*')
        .order('price', { ascending: false })
      masItems(products)
    } else {
      const { data: products, error } = await supabase.from('items').select('*')
      masItems(products)
      // items.value = products.map((obj) => ({
      //   ...obj,
      //   isFavorite: false,
      //   favoriteId: null,

      //   isAdded: false,
      // }))
    }

    // const { data } = await axios.get('https://f56ab83a6b82a589.mokky.dev/items', {
    //   params,
    // })
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
        <option value="">Категории</option>
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
        <option value="1">По названию</option>
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
