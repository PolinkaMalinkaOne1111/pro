<template>
  <h2 class="text-3xl font-bold mb-1">Панель администратора</h2>
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
        <td>
          {{ order.status }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from '@/supabase'

const orders = ref([])
const loading = ref(false)
const fetchOrders = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: userId } = await supabase.from('profiles').select('id').eq('user_id', user.id)
    const userId1 = userId[0].id

    const { data: orders2 } = await supabase
      .from('orders')
      .select(`*, profiles:user_id (email, last_name, first_name, patronymic)`)
      .eq('user_id', userId1)

    orders.value = orders2
  } catch (err) {
    console.log(err.message)
  } finally {
    loading.value = false
  }
}
onMounted(fetchOrders)
</script>
<style>
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
