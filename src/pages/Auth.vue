<template>
  <div class="flex flex-col items-center flex-1 gap-4">
    <h2 class="text-3xl font-bold mb-1">Вход в аккаунт</h2>

    <!-- Блоки с сообщениями -->

    <form @submit.prevent="handleLogin">
      <div v-if="errorMessage" class="text-xl text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="text-xl text-green-500 text-center">
        {{ successMessage }}
      </div>
      <table border="1" style="border-collapse: collapse">
        <tr>
          <td style="padding: 8px">
            <label>Email: </label>
          </td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="email"
              v-model="credentials.email"
              required
              placeholder="example@mail.com"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px"><label>Пароль: </label></td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="password"
              v-model="credentials.password"
              required
              placeholder="Введите пароль"
            />
          </td>
        </tr>
      </table>
      <button
        class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600"
        type="submit"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Вход...' : 'Войти' }}
      </button>
    </form>
    <router-link to="/registration">
      <p class="text-right">
        Еще нет аккаунта <a href="#" class="font-bold underline">Зарегистрироваться</a>
      </p></router-link
    >
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const credentials = ref({
  email: '',
  password: '',
})
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

// Метод для входа
const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.value.email,
      password: credentials.value.password,
    })

    if (error) throw error

    // Если вход успешен
    successMessage.value = 'Вход выполнен! Перенаправление...'

    // Редирект через 1.5 секунды
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: userId } = await supabase.from('profiles').select('role').eq('user_id', user.id)
    const roleUser = userId[0].role

    if (roleUser == 'admin') {
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } else {
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  } catch (error) {
    errorMessage.value = getFriendlyError(error.message)
  } finally {
    isLoading.value = false
  }
}

// Преобразование ошибок в понятный текст
const getFriendlyError = (error) => {
  const errors = {
    'Invalid login credentials': 'Неверный email или пароль',
    'Email not confirmed': 'Подтвердите email перед входом',
  }
  return errors[error] || 'Ошибка при входе'
}

// const { user } = supabase.auth.session()

// // Или подписка на изменения:
// supabase.auth.onAuthStateChange((event, session) => {
//   console.log('Текущий пользователь:', session?.user)
// })
</script>
