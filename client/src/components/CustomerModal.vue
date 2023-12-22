<script setup>
import UIButton from "@/components/UIButton.vue";
import { ref } from "vue";

const editedCustomer = ref({});
const props = defineProps({
  open: { type: Boolean, required: true },
});

const close = () => {
  emit("close");
};

const emit = defineEmits(["close"]);
</script>

<template>
  <div v-if="props.open" class="customer">
    <button @click="close" class="customer__close-btn">
      <img src="@/assets/cross-icon.png" width="20" alt="" />
    </button>
    <main class="customer__main">
      <form
        class="customer__form"
        @submit.prevent="applyRoleChanges(customerData)"
      >
        <label class="customer__label"
          >Логин
          <input
            class="input"
            v-model="editedCustomer.something"
            type="text"
            required
          />
        </label>
        <label class="customer__label"
          >Имя
          <input
            class="input"
            v-model="editedCustomer.something"
            type="text"
            required
          />
        </label>
        <label class="customer__label"
          >Фамилия
          <input
            class="input"
            v-model="editedCustomer.something"
            type="text"
            required
          />
        </label>
      </form>
      <div class="customer__actions">
        <UIButton class="user-add-btn" type="submit">Добавить клиента</UIButton>
      </div>
    </main>
  </div>
</template>

<style scoped>
.customer {
  background-color: white;
  border: 1px solid black;
}

.customer__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  margin-top: 0.2rem;
  margin-bottom: 0.5rem;
  background-color: white;
}

.customer__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}
.customer__label {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
  width: 100%;
}
.customer__close-btn {
  border: 0;
  background: 0;
  position: absolute;
  top: 5px;
  right: 0;
}
</style>
