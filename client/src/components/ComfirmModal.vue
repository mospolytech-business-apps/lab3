<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";

import { ref, watchEffect } from "vue";

const props = defineProps({
  open: { type: Boolean, required: true },
  object: { type: Object || null, required: true },
});

const emit = defineEmits(["close"]);

const objectData = ref(null);

watchEffect(() => {
  objectData.value = props.object;
});

const applyObjectChanges = () => {
  console.log("Удаление подтверждено для объекта с id #", props.object.id);
  emit("deleteData", props.object);
  emit("close");
};

const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Удалить объект" :closeButtonHandler="close" />

    <main class="main">
      <form class="form" @submit.prevent="applyObjectChanges">
        Подтвердите удаление объекта
        <div class="buttons">
          <UIButton class="cerate-order" @click="close">{{
            "Отмена"
          }}</UIButton>
          <UIButton class="cerate-order" type="submit">{{
            "Удалить"
          }}</UIButton>
        </div>
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
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  margin-bottom: 1rem;
}

.field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.label {
  width: 100%;
  flex-grow: 2;
}

.input {
  height: min-content;
  width: 100%;
}

.customer {
  display: flex;
  flex-direction: column;
  position: relative;
}

.customer-select {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.add-customer__btn {
  margin-top: 0.5rem;
  width: 100%;
}
.add-customer__modal {
  position: absolute;
  top: 5rem;
  display: block;
  width: 100%;
  z-index: 1;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
}
.select-status {
  width: 100%;
}

.select-customer {
  display: flex;
  flex-direction: column;
}
.photo-select {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field {
  display: flex;
  gap: 0.5rem;
}

.file-input-wrapper {
  display: flex;
  gap: 0.5rem;
}
.input[type="file"] {
  height: 100%;
  margin-left: 0;
}

.field {
  width: 100%;
  display: flex;
  grid-column: 1 / -1;
  justify-content: space-between;
}

.input {
  border: 1px solid black;
  flex-grow: 1;
  border-radius: 0.25rem;
  padding: 0.25rem;
  margin-left: 10px;
}
.input::file-selector-button {
  display: none;
}

.input::file-selector-button {
  display: none;
}

.role-inputs {
  display: flex;
  flex-direction: column;
}

.fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
  display: block;
  grid-column: 1 / -1;
}

.legend {
  display: block;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.buttons {
  display: flex;
  justify-content: center;
  gap: 6rem;
  margin-bottom: 2rem;
}

.cancel-btn:hover {
  background-color: salmon;
}
.photos {
  border: 1px solid lightgray;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  height: 5rem;
  gap: 0.5rem;
}

.photo {
  object-fit: contain;
  display: block;
}
.cerate-order {
  margin-top: auto;
}
</style>
