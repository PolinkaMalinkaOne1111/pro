<script setup>
import { ref, watch, provide, computed, inject } from 'vue'
import axios from 'axios'
import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import InfoBlock from './InfoBlock.vue'
import { supabase } from '@/supabase'

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
})

const { cart, closeDrawer } = inject('cart')
const isCreatingOrder = ref(false)
const orderId = ref(null)

const createOrder = async () => {
  try {
    isCreatingOrder.value = true

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: userId } = await supabase.from('profiles').select('id').eq('user_id', user.id)
    const userId1 = userId[0].id

    const itemString = cart.value.map((item) => item.title).join(', ')
    const obj = { user_id: userId1, totalPrice: props.totalPrice, items: itemString }
    await supabase.from('orders').insert([obj])

    const { data: data } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId1)
      .eq('items', itemString)

    cart.value = []
    orderId.value = data[0].id
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrder.value = false
  }
}

const cartIsEmpty = computed(() => cart.value.length === 0)
const buttonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-50"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы один товар, чтобы сделать заказ"
        image-url="/package-icon.png"
      />
      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской службе`"
        image-url="/order-success-icon.png"
      />
    </div>
    <div v-else>
      <CartItemList />
      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} ₽</b>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }} ₽</b>
        </div>
        <button
          :disabled="buttonDisabled"
          @click="createOrder"
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600 transition active:bg-lime-700 disabled:bg-slate-300 cursor-pointer"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
