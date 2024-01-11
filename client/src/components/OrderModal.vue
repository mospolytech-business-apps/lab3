<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import CustomerModal from "@/components/CustomerModal.vue";

import { ref, onMounted, watchEffect, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";
import { useOrdersStore } from "@/stores/orders.store";

const { fetchUsers, addUser, fetchUserById } = useUsersStore();
const { clientManagers, customers, userRole, currentUser, userID } =
  storeToRefs(useUsersStore());
const { statuses, updateOrder, addOrder } = useOrdersStore();

onMounted(async () => {
  currentUser.value = await fetchUserById(userID.value);
});

const props = defineProps({
  open: { type: Boolean, required: true },
  order: { type: Object || null, required: true },
  isEditing: { type: Boolean, required: true },
  allOrders: { type: Array, required: true },
});

const allOrders = ref(null);
watchEffect(() => {
  allOrders.value = props.allOrders;
});

const numberOfOrdersToday = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const number = allOrders.value.filter((order) => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);

    return orderDate.getTime() === today.getTime();
  });

  return number.length + 1;
});

const emit = defineEmits(["close"]);

const orderData = ref(null);

watchEffect(() => {
  orderData.value = props.isEditing
    ? { ...props.order }
    : {
        finish: null,
        status: null,
        date: null,
        number: null,
        name: null,
        customer: null,
        manager: null,
        price: null,
        images: [],
        metics: [],
      };
});

const applyOrderChanges = async () => {
  if (props.isEditing) {
    updateOrder({
      ...orderData.value,
      manager: +orderData.value.manager,
      customer: +orderData.value.customer,
    });
  } else {
    orderData.value.customer =
      userRole.value === "Customer"
        ? +currentUser.value.id
        : +orderData.value.customer;

    orderData.value.manager =
      userRole.value === "ClientManager" ? +currentUser.value.id : null;

    const user = await fetchUserById(+orderData.value.customer);

    const orderNumber =
      "" +
      today.getDate() +
      today.getMonth() +
      today.getFullYear() +
      (user?.firstName?.slice(0, 1) ?? "_") +
      (user?.lastName?.slice(0, 1) ?? "_") +
      (numberOfOrdersToday.value < 10
        ? "0" + numberOfOrdersToday.value
        : numberOfOrdersToday.value);

    addOrder({
      ...orderData.value,
      number: orderNumber,
      status: userRole.value === "ClientManager" ? "specification" : "new",
      date: new Date().toISOString().slice(0, 10),
    });
  }
  close();
};

const close = () => {
  emit("close");
};

const isCustomerModalOpen = ref(null);

const newCustomerData = ref(null);
const closeCustomerModal = async () => {
  isCustomerModalOpen.value = false;
  newCustomerData.value = null;
};

const handleNewCustomer = () => {
  isCustomerModalOpen.value = true;
  addUser(newCustomerData.value);
};

const today = new Date();

const users = ref([]);
onMounted(async () => {
  console.log(props.allOrders);
  users.value = await fetchUsers();
});

const files = ref(null);
const imgPaths = ref([]);

const getFile = (event) => {
  files.value = event.target.files;
};

const addFiles = () => {
  if (files.value) {
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i];
      const preview = new FileReader();

      preview.readAsDataURL(file);
      preview.onload = () => {
        imgPaths.value.push(preview.result);
      };
    }
  }
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader
      :title="props.isEditing ? 'Изменить заказ' : 'Добавить заказ'"
      :closeButtonHandler="close"
    />

    <main class="main">
      <form class="form" @submit.prevent="applyOrderChanges">
        <label class="field" v-show="props.isEditing">
          <span class="label">Заказ</span>
          <b class="field">№{{ orderData.number }}</b>
        </label>

        <label class="field">
          <span class="label">Наименование заказа </span>
          <input class="input" v-model="orderData.name" type="text" required />
        </label>

        <label class="field" v-show="props.isEditing">
          <span class="label">Статус заказа</span>
          <UISelect
            class="select-status"
            v-model="orderData.status"
            :disabled="userRole === 'Director'"
            required
          >
            <option v-for="status in statuses" :value="status.status">
              {{ status.title }}
            </option>
          </UISelect>
        </label>

        <label class="field">
          <span class="label">Стоимость заказа (₽)</span>
          <input
            class="input"
            v-model="orderData.price"
            type="number"
            required
          />
        </label>

        <label class="customer-select" v-show="userRole === 'ClientManager'">
          <span class="label">Заказчик</span>
          <div class="customer">
            <UISelect v-model="orderData.customer" requited>
              <option v-for="customer in customers" :value="customer.id">
                {{ customer.firstName }} ({{ customer.username }})
              </option>
            </UISelect>
            <UIButton
              @click="handleNewCustomer"
              class="add-customer__btn"
              type="button"
              >Добавить заказчика</UIButton
            >
            <CustomerModal
              class="add-customer__modal"
              :open="isCustomerModalOpen"
              @close="closeCustomerModal"
              @fetchCustomers="fetchUsers()"
            />
          </div>
        </label>

        <label class="field">
          <span class="label">Запланированная дата выполнения</span>
          <input
            class="input"
            v-model="orderData.finish"
            type="date"
            :min="new Date().toISOString().slice(0, 10)"
          />
        </label>

        <label class="filed" v-show="isEditing">
          <span class="label">Ответственный менеджер</span>
          <UISelect
            class="select-customer"
            v-model="orderData.manager"
            requited
          >
            <option v-for="manager in clientManagers" :value="manager.id">
              {{ manager.firstName }} ({{ manager.username }})
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
              @change="getFile"
              ref="fileInput"
              multiple
            />
            <UIButton @click="addFiles" type="button">
              <img src="@/assets/import.png" width="20" alt="Import icon" />
              <span>Добавить</span>
            </UIButton>
          </div>
          <div class="photos" ref="photos">
            <img
              v-for="(path, index) in imgPaths"
              :key="index"
              class="photo"
              :src="path"
              alt=""
            />
          </div>
        </label>

        <UIButton
          @click="applyOrderChanges"
          class="cerate-order"
          :disabled="
            userRole === 'ClientManager' && orderData.customer === null
              ? false
              : null
          "
          type="submit"
          >{{
            props.isEditing ? "Сохранить изменения" : "Создать заказ"
          }}</UIButton
        >
      </form>
    </main>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  background-color: white;
  display: flex;
  flex-direction: column;
  min-width: 40%;
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
  margin: 0 auto;
  justify-content: center;
  height: 100%;
  flex-grow: 1;
  padding: 1.5rem 4rem;
  background-color: white;
  margin-bottom: 0.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
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

.select-manager {
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
