<script setup>
import { ref, watch, provide, computed, inject, onMounted } from 'vue'
const emit = defineEmits(['openDrawer'])
import { supabase } from '@/supabase'

defineProps({
  totalPrice: Number,
})

const { user } = inject('cart')
console.log(user)
// const getRole = async () => {
//   try {
//     if (user) {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()
//       const { data: userId } = await supabase.from('profiles').select('role').eq('user_id', user.id)
//       const userRole = userId[0].role
//       if (userRole == 'admin') {
//         isRole.value = true
//       }
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }
// onMounted(getRole)
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <RouterLink to="/"
      ><div class="flex items-center gap-4">
        <img src="/logo.png" alt="logo" class="w-15" />
        <div>
          <h2 class="text-xl font-bold italic">ТЕЛЕкомм</h2>
          <p class="text-slate-400">Магазин телекоммуникационного оборудования</p>
        </div>
      </div></RouterLink
    >

    <ul class="flex items-center gap-10">
      <RouterLink to="/contact"
        ><li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          О компании
        </li></RouterLink
      >

      <li
        @click="() => emit('openDrawer')"
        class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="cart" />
        <b>{{ totalPrice }} руб.</b>
      </li>

      <RouterLink to="/favorites"
        ><li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="heart" />
          <span>Закладки</span>
        </li></RouterLink
      >

      <RouterLink v-if="!user" to="/registration">
        <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/profile.svg" alt="profile" />
          <span>Профиль</span>
        </li>
      </RouterLink>

      <RouterLink v-if="user" to="/profile">
        <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/profile.svg" alt="profile" />
          <span>Профиль</span>
        </li>
      </RouterLink>
    </ul>
  </header>
</template>
