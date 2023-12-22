<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/stores/orders.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import { useUsersStore } from "@/stores/users.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import OrderModal from "@/components/OrderModal.vue";

const { fetchOrders, statuses } = useOrdersStore();
const { allOrders } = storeToRefs(useOrdersStore());

const { customers, clientManagers } = storeToRefs(useUsersStore());

const { addError } = useNotificationsStore();

const isEditing = ref(null);

const isNewOrderModalOpen = ref(null);
const openNewOrderModal = () => {
  isNewOrderModalOpen.value = true;
  isEditing.value = false;
};

const closeNewOrderModal = () => {
  isNewOrderModalOpen.value = false;
  isEditing.value = null;
};

const isEditOrderModalOpen = ref(null);
const openEditOrderModal = () => {
  isEditOrderModalOpen.value = true;
  isEditing.value = true;
};

const closeEditOrderModal = () => {
  isEditOrderModalOpen.value = false;
  editableOrder.value = null;
  isEditing.value = null;
};

const closeOrderModal = () => {
  if (isEditing.value) {
    closeEditOrderModal();
    return;
  }
  closeNewOrderModal();
};

const editableOrder = ref(null);
const selectedOrder = ref(null);

const selectOrder = (order) => {
  selectedOrder.value = order;
};

const isOrderModalOpen = computed(
  () => isNewOrderModalOpen.value || isEditOrderModalOpen.value
);

const handleEditOrder = (order) => {
  editableOrder.value = order;
  if (editableOrder.value === null) {
    addError("Error: Select order first!");
    return;
  }
  openEditRoleModal();
};

const selectedStatus = ref(null);

const orders = ref([]);
onMounted(async () => {
  orders.value = allOrders.value.length ? allOrders.value : await fetchOrders();
});

const filteredOrders = computed(() => {
  if (selectedStatus.value === null) {
    return allOrders.value;
  } else if (selectedStatus.value === "fresh") {
    return allOrders.value.filter((order) =>
      ["new", "specification", "approving"].includes(order.status)
    );
  } else if (selectedStatus.value === "completed") {
    return allOrders.value.filter((order) =>
      ["ready", "finished"].includes(order.status)
    );
  } else if (selectedStatus.value === "current") {
    return allOrders.value.filter((order) =>
      ["procurement", "production", "checking"].includes(order.status)
    );
  } else if (selectedStatus.value === "rejected") {
    return allOrders.value.filter((order) =>
      ["cancelled"].includes(order.status)
    );
  }
  return allOrders.value;
});

onUnmounted(() => {
  selectedOrder.value = null;
});
</script>

<template>
  <UIHeader title="Заказы" />
  <UINav />
  <main class="main">
    <div class="filter">
      <p class="filter-title">Статус</p>
      <UISelect
        v-model="selectedStatus"
        placeholder="Статус заказа"
        class="status-filter"
      >
        <option value="">Все</option>
        <option value="fresh">Новые</option>
        <option value="completed">Выполенные</option>
        <option value="current">Текущие</option>
        <option value="rejected">Отклоненные</option>
      </UISelect>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Заказ</th>
            <th>Дата</th>
            <th>Наименование</th>
            <th>Статус</th>
            <th>Стоимость</th>
            <th>Заказчик</th>
            <th>Запланированная дата выполнения</th>
            <th>Ответственный менеджер</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            @click="selectOrder(order)"
            :class="{
              selected: order === selectedOrder,
            }"
          >
            <td>№{{ order.number }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.name }}</td>
            <td>
              {{ statuses.find((st) => st.status === order.status)?.title }}
            </td>
            <td>{{ order.price }}</td>
            <td>
              {{
                customers.find((customer) => customer.id === order.customer)
                  ?.username
              }}
            </td>
            <td>{{ order.finish }}</td>
            <td>
              {{
                clientManagers.find((manager) => manager.id === order.manager)
                  ?.username
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons">
      <UIButton @click="openEditOrderModal(selectedorder)"
        >Изменить заказ</UIButton
      >
      <UIButton @click="openNewOrderModal">Новый заказ</UIButton>
    </div>
  </main>
  <OrderModal
    allOrders="orders"
    :open="isOrderModalOpen"
    :isEditing="isEditing"
    :editableOrder="editableOrder"
    @close="closeOrderModal"
  />
</template>

<style scoped>
.main {
  margin: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}

.filter {
  align-items: center;
  display: flex;
  gap: 1rem;
}

.filter-title {
  margin: 0;
}

.status-filter {
  min-width: 10rem;
}

.selected {
  box-shadow: inset 0 0 0 2px black;
}

.align-center {
  text-align: center;
}

thead {
  background-color: lightgray;
  border-bottom: 2px solid black;
}

td,
th {
  border: 1px solid black;
  padding-inline-start: 0.25rem;
}

.table-wrapper {
  flex-grow: 1;
  width: 100%;
  border: 2px solid black;
  overflow: scroll;
}
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: scroll;
}

.buttons {
  display: flex;
  gap: 5rem;
}
</style>
