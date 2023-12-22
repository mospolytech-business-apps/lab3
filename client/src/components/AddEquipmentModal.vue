<script setup>
import { ref } from "vue";
import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import { useEquipmentsStore } from "@/stores/equipments.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import UISelect from "@/components/UISelect.vue";

const { addAlert } = useNotificationsStore();
const { addEquipment } = useEquipmentsStore();

const props = defineProps({
  open: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const equipmentData = ref({
  name: null,
  brand: null,
  type: null,
  specifications: null,
});

const close = () => {
  emit("close");
};

const handleSubmit = async () => {
  try {
    await addEquipment(equipmentData.value);
    close();
  } catch (error) {
    addAlert("Не удалось добавить оборудование", error);
  }
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Добавление оборудования" :closeButtonHandler="close" />
    <main class="main">
      <form class="form" @submit.prevent="handleSubmit">
        <label class="label">
          <span class="span">Название</span>
          <input class="input" type="text" v-model="equipmentData.name" />
        </label>
        <label class="label">
          <span class="span">Бренд</span>
          <input class="input" type="text" v-model="equipmentData.brand" />
        </label>
        <label class="label">
          <span class="span">Тип оборудования</span>
          <UISelect v-model="equipmentData.type" class="input">
            <option value="Машина">Машина</option>
            <option value="Печь">Печь</option>
            <option value="Миксер">Миксер</option>
            <option value="Другое">Другое</option>
          </UISelect>
        </label>

        <label class="label">
          <span class="span">Спецификация</span>
          <textarea
            class="input"
            type="text"
            v-model="equipmentData.specifications"
          />
        </label>

        <UIButton class="button" type="submit">Добавить оборудование</UIButton>
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
