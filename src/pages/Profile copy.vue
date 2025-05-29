<template>
  <h2 class="text-3xl font-bold mb-1">Мои заказы</h2>
  <div>
    <h2 v-if="orders.length == 0" class="text-3xl mb-1 text-center">У вас нет активных заказов</h2>
    <table id="orders-table" v-else>
      <thead>
        <tr>
          <th>Номер заказа</th>
          <th>Стоимость заказа</th>
          <th>Товары</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.totalPrice }} ₽</td>
          <td>{{ order.items }}</td>
          <td class="font-medium">
            {{ order.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="text-3xl font-bold mb-1">Данные профиля</h2>

  <div class="profile-form">
    <div v-if="loading" class="loading">Загрузка данных...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <template v-else-if="profile">
      <form class="profile-data" @submit.prevent="handleSubmit">
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        <div class="form-group">
          <label>Фамилия:</label>
          <input type="text" v-model="editableProfile.last_name" :readonly="!isEditing" required />
        </div>

        <div class="form-group">
          <label>Имя:</label>
          <input type="text" v-model="editableProfile.first_name" :readonly="!isEditing" required />
        </div>

        <div class="form-group">
          <label>Отчество:</label>
          <input type="text" v-model="editableProfile.patronymic" :readonly="!isEditing" />
        </div>

        <div class="form-group">
          <label>Телефон:</label>
          <input
            type="tel"
            v-model="editableProfile.phone"
            :readonly="!isEditing"
            @input="formatPhone"
            required
          />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input type="email" v-model="editableProfile.email" :readonly="!isEditing" required />
        </div>

        <div class="form-actions">
          <template v-if="!isEditing">
            <button type="button" class="edit-btn" @click="enableEditing">Редактировать</button>
          </template>

          <template v-else>
            <button type="submit" class="save-btn" :disabled="isSaving">
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button type="button" class="cancel-btn" @click="cancelEditing" :disabled="isSaving">
              Отмена
            </button>
          </template>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from '@/supabase'

const profile = ref(null)
const editableProfile = reactive({})
const isEditing = ref(false)
const isSaving = ref(false)
const loading = ref(true)
const error = ref(null)
const successMessage = ref(null)

const orders = ref([])

const formatPhone = () => {
  let phone = editableProfile.phone.replace(/\D/g, '')
  if (phone.startsWith('7')) phone = phone.substring(1)
  phone = phone.substring(0, 10)

  let formatted = '+7'
  if (phone.length > 0) formatted += ` (${phone.substring(0, 3)}`
  if (phone.length > 3) formatted += `) ${phone.substring(3, 6)}`
  if (phone.length > 6) formatted += `-${phone.substring(6, 8)}`
  if (phone.length > 8) formatted += `-${phone.substring(8)}`

  editableProfile.phone = formatted
}

const fetchProfile = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()

    profile.value = data
    Object.assign(editableProfile, data)

    const { data: userId } = await supabase.from('profiles').select('id').eq('user_id', user.id)
    const userId1 = userId[0].id
    const { data: orders2 } = await supabase.from('orders').select('*').eq('user_id', userId1)

    orders.value = orders2
    console.log(orders2)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const enableEditing = () => {
  isEditing.value = true
  successMessage.value = null
}

const cancelEditing = () => {
  isEditing.value = false
  Object.assign(editableProfile, profile.value)
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    error.value = null

    // Валидация телефона
    const phoneDigits = editableProfile.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 11) {
      throw new Error('Номер телефона должен содержать 11 цифр')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        last_name: editableProfile.last_name,
        first_name: editableProfile.first_name,
        patronymic: editableProfile.patronymic,
        phone: phoneDigits,
        email: editableProfile.email,
      })
      .eq('user_id', user.id)

    if (updateError) throw updateError

    // Обновляем локальные данные
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()

    profile.value = data
    isEditing.value = false
    successMessage.value = 'Данные успешно обновлены!'
  } catch (err) {
    error.value = err.message
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
#orders-table {
  width: 100%;
  margin: 2rem auto;
  padding: 25px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#orders-table th {
  background-color: #e2e8f0;
  padding: 12px;

  text-align: left;
  border-bottom: 2px solid #e2e8f0;
}

#orders-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

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

.profile-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 25px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group input {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
}

.form-group input:read-only {
  background: #f8fafc;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.save-btn {
  background: #10b981;
  color: white;
}

.cancel-btn {
  background: #ef4444;
  color: white;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 6px;
}
</style>
