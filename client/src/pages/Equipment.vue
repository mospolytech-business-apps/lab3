<script setup>
import { ref } from "vue";

import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

import {useToolsStore} from '@/stores/tools.store'

const {addTool, tools} = useToolsStore()

const toISOStringWithTimezone = date => {
  const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate())
};

const name = ref('название')
const description = ref('описание')
const type = ref('тип')
const wearStage = ref('1')
const supplier = ref('поставщик')
const acquisitionDate = ref(toISOStringWithTimezone(new Date()))
const amount = ref('1')

const MONTH_IN_MS = 2.628e+9
function getToolAge(date) {
  return Math.round((Date.now() - new Date(date)) / MONTH_IN_MS)
}

</script>

<template>
  <UIHeader />
  <UINav />
  <h1 class="h1">Инструменты</h1>
  <form class="form" @submit.prevent="addTool({name, description, type, wearStage, supplier, acquisitionDate, amount})">
    <label class="label">
      <span class="span">Наименование</span>
      <input
          class="input"
          type="text"
          v-model="name"
      />
    </label>
    <label class="label">
      <span class="span">Описание</span>
      <input
          class="input"
          type="text"
          v-model="description"
      />
    </label>
    <label class="label">
      <span class="span">Тип инструмента</span>
      <input
          class="input"
          type="text"
          v-model="type"
      />
    </label>
    <label class="label">
      <span class="span">Степень износа</span>
      <input
          class="input"
          type="number"
          v-model="wearStage"
      />
    </label>
    <label class="label">
      <span class="span">Поставщик</span>
      <input
          class="input"
          type="text"
          v-model="supplier"
      />
    </label>
    <label class="label">
      <span class="span">Дата приобретения</span>
      <input
          class="input"
          type="date"
          v-model="acquisitionDate"
      />
    </label>

    <label class="label">
      <span class="span">Имеющееся количество</span>
      <input
          class="input"
          type="number"
          v-model="amount"
      />
    </label>
    <UIButton class="button" type="submit">Добавить инструмент</UIButton>
    <ol>
      <li v-for="tool in tools">
        <span><b>Наименование:</b> {{tool.name}}. </span>
        <span><b>Тип:</b> {{tool.type}}. </span>
        <span><b>Возраст инструмента в месяцах:</b> {{getToolAge(tool.acquisitionDate)}}. </span>
        <span><b>Количество:</b> {{tool.amount}}</span>
      </li>
    </ol>
  </form>
</template>

<style scoped>
.h1 {
  text-align: center;
}

.form {
  display: flex;
  padding: 2rem;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.label {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input {
  min-width: 20rem;
}

.button {
  width: 100%;
  max-width: 20rem;
}
</style>
