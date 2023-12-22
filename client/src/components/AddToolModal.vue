<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import { useToolsStore } from "@/stores/tools.store";
import { useNotificationsStore } from "@/stores/notifications.store";

const { addAlert } = useNotificationsStore();
const { addTool } = useToolsStore();

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

const props = defineProps({
  open: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const equipmentData = ref({
  name: null,
  description: null,
  type: null,
  wearStage: null,
  supplier: null,
  acquisitionDate: toISOStringWithTimezone(new Date()),
  amount: null,
});

const close = () => {
  emit("close");
};

const handleSubmit = async () => {
  try {
    await addTool(equipmentData.value);
    close();
  } catch (error) {
    addAlert("Не удалось добавить инструмент");
  }
};
</script>

"id": 1, "name": "Венчик для взбивания", "description": "Инструмент для
взбивания яиц, сливок и других ингредиентов", "instrumentType": "Ручной
инструмент", "usageDegree": "Новый", "customer": "ООО 'Сладкий Мир'",
"purchaseDate": "2023-12-20", "amount": 3

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Добавление инструмента" :closeButtonHandler="close" />
    <main class="main">
      <form class="form" @submit.prevent="handleSubmit">
        <label class="label">
          <span class="span">Наименование</span>
          <input class="input" type="text" v-model="equipmentData.name" />
        </label>
        <label class="label">
          <span class="span">Описание</span>
          <input
            class="input"
            type="text"
            v-model="equipmentData.description"
          />
        </label>
        <label class="label">
          <span class="span">Тип инструмента</span>
          <input class="input" type="text" v-model="equipmentData.type" />
        </label>
        <label class="label">
          <span class="span">Степень износа (%)</span>
          <input
            class="input"
            type="number"
            v-model="equipmentData.wearStage"
          />
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
    </main>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  max-width: 45%;
  max-height: 80%;
  overflow-y: scroll;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  box-shadow: 0 0 2rem black;
}

.main {
  gap: 1rem;
  display: flex;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  padding: 1.5rem 4rem;
  background-color: white;
  margin-bottom: 0.5rem;
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
