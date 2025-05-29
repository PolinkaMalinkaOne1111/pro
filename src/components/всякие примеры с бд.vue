<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-50"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <RegistrationHead />
    <div class="flex flex-col flex-1 gap-4">
      <form class="">
        <div class="pb-4">
          <p class="text-xl pb-2">Логин</p>
          <input
            @input="login"
            value="это ыыы"
            class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
            placeholder="введите логин"
            required
          />
        </div>

        <div class="">
          <p class="text-xl pb-2">Пароль</p>
          <input
            class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
            placeholder="введите пароль"
            type="password"
            required
          />
        </div>

        <button
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600 transition active:bg-lime-700 disabled:bg-slate-300 cursor-pointer"
          type="submit"
        >
          Зарегистрироваться
        </button>
      </form>
      <button
        @click="addProduct"
        class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600"
      >
        Click
      </button>

      <div>
        <input type="text" v-model="inputValue" placeholder="Введите текст" />
        <button @click="submit">Отправить</button>
        <p>Вы ввели: {{ inputValue }}</p>
      </div>
      <!-- <div class="">
        <p class="text-xl">Имя</p>
        <input
          class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
          placeholder=""
        />
      </div>

      <div class="">
        <p class="text-xl">Фамилия</p>
        <input
          class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
          placeholder=""
        />
      </div> -->

      <!-- <div class="">
        <p class="text-xl">Повтор пароля</p>
        <input
          class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
          placeholder=""
          type="password"
        />
      </div>

      <div class="">
        <p class="text-xl">E-mail</p>
        <input
          class="border border-gray-400 rounded-md py-2 pl-3 w-80 outline-none focus:border-gray-600"
          placeholder=""
        />
      </div> -->

      <p class="text-right"><a href="#" class="font-bold underline">Войти</a> в профиль</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import RegistrationHead from '../pages/RegistrationHead.vue'

const emit = defineEmits(['createOrder'])

defineProps({
  totalPrice: Number,
  vatPrice: Number,
  buttonDisabled: Boolean,
})

const inputValue = ref('') // Реактивная переменная

const submit = () => {
  console.log('Отправлено:', inputValue.value)
  // Можно отправить в Supabase или обработать
}

// получение данных из таблицы products
// const fetchProducts = async () => {
//   const { data: products, error } = await supabase.from('products').select('*')

//   if (error) console.error('Ошибка:', error)
//   else console.log(products) // массив товаров
// }

// --------------------------

// добавление данных в таблицу products
const addProduct = async () => {
  const product = { name: 'ввв', price: 100 }
  const { data, error } = await supabase.from('products').insert([product]) // передаём объект { name: '...', price: 100 }

  if (error) console.error('Ошибка:', error)
  else console.log('Успех')
}

// --------------------------

// Удалить товар по ID
// const deleteProduct = async (id) => {
//   const { error } = await supabase.from('products').delete().eq('id', id) // условие: где id = переданному ID

//   if (error) console.error('Ошибка:', error)
//   else console.log('Успех')
// }
</script>
