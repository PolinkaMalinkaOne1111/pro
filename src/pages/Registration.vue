<template>
  <div class="flex flex-col items-center flex-1 gap-4">
    <h2 class="text-3xl font-bold mb-1">Регистрация</h2>

    <form @submit.prevent="handleRegister" class="">
      <!-- Сообщения -->
      <div v-if="errorMessage" class="text-xl text-red-500 text-center">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="text-xl text-green-500 text-center">
        {{ successMessage }}
      </div>

      <table border="1" style="border-collapse: collapse">
        <tr>
          <td style="padding: 8px"><label>Фамилия: </label></td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="text"
              v-model="formData.lastName"
              required
              placeholder="Иванов"
              @input="formatName('lastName')"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px">
            <label>Имя: </label>
          </td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="text"
              v-model="formData.firstName"
              required
              placeholder="Иван"
              @input="formatName('firstName')"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px"><label>Отчество: </label></td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="text"
              v-model="formData.patronymic"
              placeholder="Иванович"
              @input="formatName('patronymic')"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px"><label>Телефон: </label></td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="tel"
              v-model="formData.phone"
              required
              placeholder="+7 (999) 999-99-99"
              @input="formatPhone"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px">
            <label>Email: </label>
          </td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="email"
              v-model="formData.email"
              required
              placeholder="example@mail.ru"
            />
          </td>
        </tr>
        <tr>
          <td style="padding: 8px"><label>Пароль: </label></td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="password"
              v-model="formData.password"
              required
              placeholder="Не менее 6 символов"
              minlength="6"
            />
          </td>
        </tr>
      </table>
      <button
        class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600"
        type="submit"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
      <router-link to="/auth">
        <p class="text-right">
          <a href="#" class="font-bold underline">Войти</a> в профиль
        </p></router-link
      >
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const router = useRouter()

const formData = ref({
  lastName: '',
  firstName: '',
  patronymic: '',
  phone: '',
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Форматирование ФИО (только буквы и пробелы)
const formatName = (field) => {
  formData.value[field] = formData.value[field]
    .replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    .replace(/\s{2,}/g, ' ')
}

// Маска для телефона
const formatPhone = () => {
  let phone = formData.value.phone.replace(/\D/g, '')

  if (phone.startsWith('7')) phone = phone.substring(1)
  if (phone.length > 10) phone = phone.substring(0, 10)

  let formatted = '+7'
  if (phone.length > 0) formatted += ` (${phone.substring(0, 3)}`
  if (phone.length > 3) formatted += `) ${phone.substring(3, 6)}`
  if (phone.length > 6) formatted += `-${phone.substring(6, 8)}`
  if (phone.length > 8) formatted += `-${phone.substring(8, 10)}`

  formData.value.phone = formatted
}

// Валидация телефона
const validatePhone = () => {
  return formData.value.phone.replace(/\D/g, '').length === 11
}

const handleRegister = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Валидация
    if (!validatePhone()) {
      throw new Error('Некорректный номер телефона')
    }

    if (!formData.value.lastName.trim() || !formData.value.firstName.trim()) {
      throw new Error('Заполните обязательные поля: Фамилия и Имя')
    }

    // Регистрация
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
    })

    if (authError) throw authError

    // Сохранение профиля
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: authData.user.id,
      last_name: formData.value.lastName,
      first_name: formData.value.firstName,
      patronymic: formData.value.patronymic,
      phone: formData.value.phone.replace(/\D/g, ''),
      email: formData.value.email,
    })

    if (profileError) throw profileError

    successMessage.value = 'Регистрация успешна! Проверьте email для подтверждения.'

    // Сброс формы
    formData.value = {
      lastName: '',
      firstName: '',
      patronymic: '',
      phone: '',
      email: '',
      password: '',
    }

    setTimeout(() => router.push('/auth'), 3000)
  } catch (error) {
    errorMessage.value = error.message || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>
