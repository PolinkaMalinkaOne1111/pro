<template>
  <h2 class="text-3xl font-bold mb-1">Панель администратора</h2>
  <div v-if="loading" class="text-xl italic text-slate-400 text-center">Загрузка...</div>
  <div v-else>
    <h2 v-if="orders.length == 0" class="text-3xl mb-1 text-center">
      Пользователи еще не сделали заказы
    </h2>
    <table id="orders-table" v-else>
      <thead>
        <tr>
          <th>E-mail пользователя</th>
          <th>ФИО</th>
          <th>Номер заказа</th>
          <th>Стоимость заказа</th>
          <th>Товары</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.profiles.email }}</td>
          <td>
            {{
              order.profiles.last_name +
              ' ' +
              order.profiles.first_name +
              ' ' +
              order.profiles.patronymic
            }}
          </td>
          <td>№ {{ order.id }}</td>
          <td>
            <b>{{ order.totalPrice }} ₽</b>
          </td>
          <td>{{ order.items }}</td>
          <td class="font-medium status-cell" :style="getStatusStyle(order.status)">
            <select
              class="font-medium"
              v-model="order.status"
              @change="updateOrderStatus(order.id, $event.target.value)"
              :disabled="loading"
            >
              <option value="Oформлен">Оформлен</option>
              <option value="Отправлен">Отправлен</option>
              <option value="Доставлен">Доставлен</option>
              <option value="Отменен">Отменен</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from '@/supabase'

const orders = ref([])
const loading = ref(false)
const fetchOrders = async () => {
  try {
    loading.value = true
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: userId } = await supabase.from('profiles').select('id').eq('user_id', user.id)
    const userId1 = userId[0].id

    const { data: orders2 } = await supabase
      .from('orders')
      .select(`*, profiles:user_id (email, last_name, first_name, patronymic)`)

    orders.value = orders2
  } catch (err) {
    console.log(err.message)
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    loading.value = true
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)

    if (error) throw error

    // Обновляем локальные данные
    const orderIndex = orders.value.findIndex((o) => o.id === orderId)
    if (orderIndex > -1) {
      orders.value[orderIndex].status = newStatus
    }
  } catch (err) {
    console.error('Ошибка обновления статуса:', err.message)
    alert('Не удалось обновить статус заказа')
  } finally {
    loading.value = false
  }
}

const getStatusStyle = (status) => {
  const styles = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    display: 'inline-block',
    color: 'black',
  }

  switch (status) {
    case 'Отменен':
      return { ...styles, backgroundColor: '#dc2626' } // Красный
    case 'Доставлен':
      return { ...styles, backgroundColor: '#6b7280' } // Серый
    case 'Oформлен':
      return { ...styles, backgroundColor: '#16a34a' } // Зеленый
    case 'Отправлен':
      return { ...styles, backgroundColor: '#2563eb' } // Синий
    default:
      return { ...styles, backgroundColor: '#e5e7eb' } // Серый по умолчанию
  }
}
onMounted(fetchOrders)
</script>
<style>
.status-cell {
  min-width: 120px;
  text-align: center;
  font-weight: 500;
  text-transform: capitalize;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  #orders-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
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
</style>
