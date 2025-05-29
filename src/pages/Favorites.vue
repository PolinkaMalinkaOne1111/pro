<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const favorites = ref([])
const loading = ref(true)
const error = ref(null)

const fetchFavorites = async () => {
  try {
    loading.value = true
    error.value = null

    // Получаем текущего пользователя
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Пользователь не авторизован')
    }

    const { data: userId } = await supabase.from('profiles').select('id').eq('user_id', user.id)

    const userId1 = userId[0].id

    // Делаем запрос к таблице favorites с JOIN к items
    const { data, error: dbError } = await supabase
      .from('favorites')
      .select(
        `
        id,
        items:item_id (*)
      `,
      )
      .eq('user_id', userId1)

    if (dbError) throw dbError

    // Извлекаем товары из результатов
    favorites.value = data.map((favorite) => favorite.items)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Вызываем при загрузке компонента
onMounted(() => {
  fetchFavorites()
})
</script>

<template>
  <div class="favorites-container">
    <h2 class="text-3xl font-bold mb-3">Закладки</h2>
    <div v-if="loading" class="text-xl italic text-slate-400 text-center">Загрузка закладок...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="favorites.length === 0" class="empty">В закладках пока ничего нет</div>

    <div v-else class="grid grid-cols-4 gap-5" v-auto-animate>
      <div
        v-for="item in favorites"
        :key="item.id"
        class="relative bg-white border border-slate-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
      >
        <img :src="item.imageUrl" :alt="item.name" />
        <h3 class="mt-2">{{ item.title }}</h3>
        <b class="bold">{{ item.price }} руб.</b>
      </div>
    </div>
  </div>
</template>

<style>
.favorites-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.favorite-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  color: #ff4444;
}

.empty {
  color: #666;
}
</style>

<!-- <script setup>
import { onMounted, ref, inject } from 'vue'
import axios from 'axios'
import { supabase } from '@/supabase'
import CardList from '../components/CardList.vue'

const { user } = inject('cart')
const favorites = ref([])



onMounted(async () => {
  try {
    console.log(user)
    const { data: userId } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.value.id)

    const userId1 = userId[0].id

    const { data: data } = supabase.from('favorites').select('*').eq('user_id', userId1)

    // await axios.get(
    //   'https://f56ab83a6b82a589.mokky.dev/favorites?_relations=items',
    // )
    console.log(userId1)
    favorites.value = data.map((obj) => obj.item)
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>
  <CardList :items="favorites" is-favorites />
</template> -->
