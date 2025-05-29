<template>
  <div class="h-130 flex justify-between items-center outline-none">
    <div class="m-auto text-center">
      <h1 class="text-4xl font-medium">Ваш надежный партнер в мире телекоммуникаций</h1>
      <p class="text-gray-400 pt-1">
        Мы предлагаем широкий ассортимент продукции от ведущих мировых производителей.
      </p>

      <RouterLink to="/"
        ><button
          class="mt-4 font-medium text-2xl bg-blue-900 w-100 h-15 rounded-xl py-3 text-white hover:bg-blue-600 transition active:bg-lime-700 disabled:bg-slate-300 cursor-pointer"
        >
          Перейти в каталог
        </button></RouterLink
      >
    </div>
  </div>

  <div class="h-130 items-center outline-none">
    <h1 class="text-4xl font-medium text-center mt-10 p-5">Наши преимущества</h1>
    <div class="grid grid-cols-3 gap-1 p-1">
      <div class="relative bg-white p-5 transition text-center">
        <img class="rounded-3xl" src="/back.png" alt="Sneaker" />
        <p class="mt-2 text-xl font-medium">Качество и надежность</p>
        <p class="mt-2 text-m">
          Работаем только с проверенными брендами, гарантирующими долговечность и эффективность
          оборудования.
        </p>
      </div>
      <div class="relative bg-white p-5 transition text-center">
        <img class="rounded-3xl" src="/back2.jpg" alt="Sneaker" />
        <p class="mt-2 text-xl font-medium">Профессиональная поддержка</p>
        <p class="mt-2 text-m">
          Наша команда экспертов готова помочь вам с выбором, установкой и настройкой оборудования.
        </p>
      </div>
      <div class="relative bg-white p-5 transition text-center">
        <img class="rounded-3xl" src="/back3.jpg" alt="Sneaker" />
        <p class="mt-2 text-xl font-medium">Быстрая доставка</p>
        <p class="mt-2 text-m">Доставляем заказы по всей России в кратчайшие сроки.</p>
      </div>
    </div>
  </div>

  <div class="h-130 items-center outline-none">
    <h1 class="text-4xl font-medium text-center mt-10 p-5">Контакты</h1>
    <div class="grid grid-cols-2 gap-1 p-1">
      <div class="relative bg-white p-5 transition text-center">
        <br />

        <p class="mt-2 text-4xl font-medium">Адрес</p>
        <p class="mt-2 text-3xl">Санкт-Петербург, Шкиперский проток, 15</p>
        <p class="mt-2 text-4xl font-medium text-center">Телефон</p>
        <p class="mt-2 text-3xl">+7 (495) 123-45-67</p>
        <p class="mt-2 text-4xl font-medium text-center">Email</p>
        <p class="mt-2 text-3xl">info@telecomm.ru</p>
      </div>
      <div class="relative bg-white p-5 transition text-center rounded-3xl">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A52f2f1d0a350cb28541745f585eeeef25b219ac2b6b7bbb0a0dc9bb3e4f5838b&amp;source=constructor"
          width="650"
          height="381"
          frameborder="0"
          class="rounded-xl"
        ></iframe>
      </div>
    </div>
  </div>
</template>
