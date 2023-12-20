<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/stores/orders.store";
import { useNotificationsStore } from "@/stores/notifications.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import OrderModal from "@/components/OrderModal.vue";

const { addOrder, fetchOrders } = useOrdersStore();
const { allOrders } = storeToRefs(useOrdersStore());
const { addError } = useNotificationsStore();

const isOrderModalOpen = ref(true);

const openOrderModal = () => {
  isOrderModalOpen.value = true;
};

const closeOrderModal = async () => {
  isOrderModalOpen.value = false;
  editableOrder.value = null;
};

const editableOrder = ref(null);
const selectedOrder = ref(null);

const selectOrder = (order) => {
  selectedOrder.value = order;
};

const handleEditOrder = (order) => {
  editableOrder.value = order;
  if (editableOrder.value === null) {
    addError("Error: Select order first!");
    return;
  }
  openOrderModal();
};

const handleNewOrder = () => {
  openOrderModal();
};

const selectedStatus = ref(null);

const orders = ref([]);
onMounted(async () => {
  orders.value = allOrders.value.length ? allOrders.value : await fetchOrders();
});

const filteredOrders = computed(() => {
  if (selectedStatus.value === "new") {
    return allOrders.value.filter((order) => order.status === "new");
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
        <option value="new">Новые</option>
        <option value="">Выполенные</option>
        <option value="">Текущие</option>
        <option value="">Отклоненные</option>
      </UISelect>
    </div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
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
            <td>{{ order.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons">
      <UIButton @click="handleEditOrder(selectedOrder)"
        >Изменить заказ</UIButton
      >
      <UIButton @click="handleNewOrder">Новый заказ</UIButton>
    </div>
  </main>
  <OrderModal :open="isOrderModalOpen" @close="closeOrderModal" />
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
