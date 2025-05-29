<!-- <script setup>
import { inject } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  selectedItem: Object,
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>
<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button> -->
<!-- <img :src="selectedItem.imageUrl" class="modal-image" /> -->
<!-- <h2 class="modal-title">{{ selectedItem.title }}</h2> -->
<!-- <p class="modal-description">{{ selectedItem.description }}</p>
      <div class="modal-price">{{ selectedItem.price }} руб.</div> -->
<!-- Добавьте другие характеристики товара -->
<!-- </div>
  </div>
</template>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 600px;
  width: 90%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  cursor: pointer;
  background: none;
  border: none;
}

.modal-image {
  max-width: 100%;
  height: 300px;
  object-fit: contain;
  margin-bottom: 1rem;
}
</style> -->
