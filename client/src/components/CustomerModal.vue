<script setup>
import UIButton from "@/components/UIButton.vue";
import { ref } from "vue";
import { useUsersStore } from "@/stores/users.store";
const { addUser } = useUsersStore();

const editedCustomer = ref({});

const props = defineProps({
  open: { type: Boolean, required: true },
});

const close = () => {
  emit("close");
};

const handleAddCustomer = () => {
  addUser(editedCustomer.value);
  emit("close");
  emit("fetchCustomers");
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
        id="customer"
        class="customer__form"
        @submit.prevent="handleAddCustomer"
      >
        <label class="customer__label"
          >Логин
          <input
            class="input"
            v-model="editedCustomer.username"
            type="text"
            required
          />
        </label>
        <label class="customer__label"
          >Имя
          <input
            class="input"
            v-model="editedCustomer.firstName"
            type="text"
            required
          />
        </label>
        <label class="customer__label"
          >Фамилия
          <input
            class="input"
            v-model="editedCustomer.lastName"
            type="text"
            required
          />
        </label>
      </form>
      <div class="customer__actions">
        <UIButton class="user-add-btn" form="customer" type="submit"
          >Добавить клиента</UIButton
        >
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
  padding: 0.5rem 2rem;
  margin-top: 1.5rem;
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
  display: grid;
  grid-template-columns: 1fr 3fr;
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
