<script setup>
import { ref } from "vue";

import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

import { useEquipmentStore } from "@/stores/equipment.store";

const { equipment } = storeToRefs(useEquipmentStore());
const { addEquipment } = useEquipmentStore();

const toISOStringWithTimezone = (date) => {
  const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
};

const equipmentData = ref({
  name: null,
  description: null,
  type: null,
  wearStage: null,
  supplier: null,
  acquisitionDate: toISOStringWithTimezone(new Date()),
  amount: null,
});
</script>

<template>
  <form
    class="form"
    @submit.prevent="
      addequipment({
        name,
        description,
        type,
        wearStage,
        supplier,
        acquisitionDate,
        amount,
      })
    "
  >
    <label class="label">
      <span class="span">Наименование</span>
      <input class="input" type="text" v-model="equipmentData.name" />
    </label>
    <label class="label">
      <span class="span">Описание</span>
      <input class="input" type="text" v-model="equipmentData.description" />
    </label>
    <label class="label">
      <span class="span">Тип инструмента</span>
      <input class="input" type="text" v-model="equipmentData.type" />
    </label>
    <label class="label">
      <span class="span">Степень износа</span>
      <input class="input" type="number" v-model="equipmentData.wearStage" />
    </label>
    <label class="label">
      <span class="span">Поставщик</span>
      <input class="input" type="text" v-model="equipmentData.supplier" />
    </label>
    <label class="label">
      <span class="span">Дата приобретения</span>
      <input
        class="input"
        type="date"
        v-model="equipmentData.acquisitionDate"
      />
    </label>

    <label class="label">
      <span class="span">Имеющееся количество</span>
      <input class="input" type="number" v-model="equipmentData.amount" />
    </label>
    <UIButton class="button" type="submit">Добавить инструмент</UIButton>
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
