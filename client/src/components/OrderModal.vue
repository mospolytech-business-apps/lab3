<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import CustomerModal from "@/components/CustomerModal.vue";

import { ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";
import { useOrdersStore } from "@/stores/orders.store";

const { fetchUsers, clientManagers, customers } = useUsersStore();
const { statuses, numberOfOrdersToday, editOrder, addOrder } = useOrdersStore();
const { allUsers, currentUser } = storeToRefs(useUsersStore());

const props = defineProps({
  open: { type: Boolean, required: true },
  editableOrder: { type: Object || null, required: true },
  isEditing: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const editedOrder = ref({});

watchEffect(() => {
  editedOrder.value = { ...props.order };
});

const applyOrderChanges = () => {
  editOrder(editedOrder.value.id, {
    ...editedOrder.value,
  });
  emit("updateData");
  emit("close");
};

const close = () => {
  emit("close");
};

const isCustomerModalOpen = ref(true);

const editableCustomer = ref(null);
const selectedCustomer = ref(null);

const closeCustomerModal = async () => {
  isCustomerModalOpen.value = false;
  editableCustomer.value = null;
};

const newCustomerData = ref(null);
const handleNewCustomer = () => {
  isCustomerModalOpen.value = true;
  addUser(newCustomerData.value);
};

const today = new Date();
const orderNumber = ref(null);

const users = ref([]);
onMounted(async () => {
  users.value = await fetchUsers();

  orderNumber.value =
    "" +
    today.getDate() +
    today.getMonth() +
    today.getFullYear() +
    numberOfOrdersToday;
});
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader
      :title="isEditing ? 'Изменить заказ' : 'Добавить заказ'"
      :closeButtonHandler="close"
    />

    <main class="main">
      <form class="form" action="">
        <label class="field">
          <span class="label">Наименование заказа </span>
          <input
            class="input"
            v-model="editedOrder.something"
            type="text"
            required
          />
        </label>

        <label class="field">
          <span class="label">Номер и дата заказа</span>
          <b class="field">{{ orderNumber }}</b>
        </label>

        <label class="field" v-show="props.isEditing">
          <span class="label">Статус заказа</span>
          <UISelect class="select-status" v-model="editedOrder.status" required>
            <option v-for="status in statuses" value="status.name">
              {{ status.title }}
            </option>
          </UISelect>
        </label>

        <label class="field">
          <span class="label">Стоимость заказа</span>
          <input
            class="input"
            v-model="editedOrder.something"
            type="text"
            required
          />
        </label>

        <label class="customer-select">
          <span class="label">Заказчик</span>
          <div class="customer">
            <UISelect v-model="editedOrder.customer" requited>
              <option v-for="customer in customers" value="customer.id">
                {{ customer.firstName }} ({{ customer.username }})
              </option>
            </UISelect>
            <div class="add-customer">
              <UIButton @click="handleNewCustomer" class="add-customer__btn"
                >Добавить заказчика</UIButton
              >
              <CustomerModal
                class="add-customer__modal"
                :open="isCustomerModalOpen"
                @close="closeCustomerModal"
              />
            </div>
          </div>
        </label>

        <label class="field">
          <span class="label">Запланированная дата выполнения</span>
          <input
            class="input"
            v-model="editedOrder.something"
            type="text"
            required
          />
        </label>

        <label class="filed">
          <span class="label">Ответственный менеджер</span>
          <UISelect v-model="editedOrder.customer" requited>
            <option v-for="manager in clientManagers" value="manager.id">
              {{ manager.username }}
            </option>
          </UISelect>
          <div class="add-customer"></div>
        </label>

        <label class="photo-select">
          <span class="label">Фотографии</span>
          <div class="file-input-wrapper">
            <input
              class="input"
              type="file"
              placeholder="lasdfad"
              ref="fileInput"
            />
            <UIButton @click="importData" type>
              <img src="@/assets/import.png" width="20" alt="Import icon" />
              <span>Добавить</span>
            </UIButton>
          </div>
        </label>

        <UIButton class="cerate-order" type="modal" @click="applyRoleChanges"
          >Создать заказ</UIButton
        >
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
  min-height: 60%;
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

.customer-select {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}
.add-customer {
  position: relative;
  text-wrap: nowrap;
  width: 100%;
}

.add-customer__btn {
  width: 100%;
}
.add-customer__modal {
  position: absolute;
  display: block;
  z-index: 1;
  top: 40px;
  left: 0;
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
.cerate-order {
  margin-top: auto;
}
</style>
