<template>
  <div class="profile-form">
    <h2>Ваш профиль</h2>

    <div v-if="loading" class="loading">Загрузка данных...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else-if="profile">
      <form class="profile-data">
        <div class="form-group">
          <label>Фамилия:</label>
          <input type="text" :value="profile.last_name" readonly />
        </div>

        <div class="form-group">
          <label>Имя:</label>
          <input type="text" :value="profile.first_name" readonly />
        </div>

        <div class="form-group">
          <label>Отчество:</label>
          <input type="text" :value="profile.patronymic || 'Не указано'" readonly />
        </div>

        <div class="form-group">
          <label>Телефон:</label>
          <input type="tel" :value="profile.phone" readonly />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input type="email" :value="profile.email" readonly />
        </div>
      </form>
    </template>

    <div v-else class="notice">Профиль не найден</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const profile = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchProfile = async () => {
  try {
    // Шаг 1: Проверка аутентификации
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('Ошибка авторизации: ' + (authError?.message || 'Пользователь не найден'))
    }

    // Шаг 2: Запрос данных
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('last_name, first_name, patronymic, phone, email')
      .eq('user_id', user.id)
      .single()

    console.log(user.id)
    // Шаг 3: Обработка ответа
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // Empty result
        throw new Error('Профиль не найден')
      }
      throw dbError
    }

    profile.value = data
  } catch (err) {
    error.value = err.message
    console.error('Ошибка:', {
      message: err.message,
      code: err.code,
      details: err.details,
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 25px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  color: #1a202c;
}

.loading,
.error,
.notice {
  padding: 1rem;
  text-align: center;
  border-radius: 6px;
}

.loading {
  background: #ebf8ff;
  color: #3182ce;
}

.error {
  background: #fff5f5;
  color: #c53030;
}

.notice {
  background: #fff9db;
  color: #5c3c00;
}
</style>

<!-- <template>
  <div class="flex flex-col items-center flex-1 gap-4">
    <h2 class="text-3xl font-bold mb-1">Мой профиль</h2>

    <form @submit.prevent="handleRegister" class="">
      <table border="1" style="border-collapse: collapse">
        <tr>
          <td style="padding: 8px"><label>Фамилия: </label></td>
          <td style="padding: 8px">
            <input
              class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
              type="text"
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
      >
        Изменить данные
      </button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <router-link to="/auth">
      <p class="text-right">
        <a href="#" class="font-bold underline">Войти</a> в профиль
      </p></router-link
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
</script> -->
