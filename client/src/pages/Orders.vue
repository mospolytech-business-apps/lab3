<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/stores/orders.store";
import { useUsersStore } from "@/stores/users.store";
import Cookies from "js-cookie";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import OrderModal from "@/components/OrderModal.vue";

const { fetchOrders, statuses, changeStatus } = useOrdersStore();
const { allOrders } = storeToRefs(useOrdersStore());

const { customers, clientManagers, userRole, userID } = storeToRefs(
  useUsersStore()
);

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

const editOrder = (order) => {
  editableOrder.value = order;
  if (editableOrder.value === null) {
    addError("Error: Select order first!");
    return;
  }
  openEditOrderModal();
};

const openEditOrderModal = () => {
  editableOrder.value = selectedOrder.value;
  isEditOrderModalOpen.value = true;
  isEditing.value = true;
};

const closeEditOrderModal = () => {
  isEditOrderModalOpen.value = false;
  editableOrder.value = null;
  isEditing.value = null;
};

const closeOrderModal = async () => {
  if (isEditing.value) {
    closeEditOrderModal();
    return;
  }
  closeNewOrderModal();
  orders.value = await fetchOrders();
  console.log(orders.value);
};

const editableOrder = ref(null);
const selectedOrder = ref(null);

const selectOrder = (order) => {
  selectedOrder.value = order;
};

const isOrderModalOpen = computed(
  () => isNewOrderModalOpen.value || isEditOrderModalOpen.value
);

const selectedStatus = ref("all");

const orders = ref([]);
onMounted(async () => {
  orders.value = allOrders.value.length ? allOrders.value : await fetchOrders();
  userID.value = Cookies.get("USER_ID");
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

const roleFiltered = computed(() => {
  if (userRole.value === "Customer") {
    return filteredOrders.value.filter((order) => {
      return order.customer == userID.value;
    });
  } else if (userRole.value === "ClientManager") {
    return filteredOrders.value.filter(
      (order) => order.status === "new" || order.manager === userID.value
    );
  } else if (userRole.value === "Director") {
    return filteredOrders.value;
  } else if (userRole.value === "PurchaseManager") {
    return filteredOrders.value.filter(
      (order) => order.status === "procurement"
    );
  } else if (userRole.value === "Master") {
    return filteredOrders.value.filter(
      (order) => order.status === "production" || order.status === "checking"
    );
  }

  return filteredOrders.value;
});

// TODO: implement
const deleteOrder = (order) => {};

// TODO: implement
const cancelOrder = (order) => {};

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
      <UISelect v-model="selectedStatus" class="status-filter">
        <option value="all">Все</option>
        <option value="fresh">Новые</option>
        <option value="completed">Выполенные</option>
        <option value="current">Текущие</option>
        <option value="rejected">Отклоненные</option>
      </UISelect>
    </div>
    <div class="table-wrapper" @click.self="selectedOrder = null">
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
            v-for="order of roleFiltered"
            :key="order.id"
            @click.stop="selectOrder(order)"
            :class="{
              selected: order === selectedOrder,
            }"
          >
            <td>№{{ order.number }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.name }}</td>
            <td
              v-if="['Director', 'ClientManager'].includes(userRole)"
              class="status-cell"
            >
              <span>
                🔽
                {{ statuses.find((st) => st.status === order.status)?.title }}
              </span>
              <div class="popup">
                <ul class="status-list">
                  <li
                    :class="{
                      passed:
                        statuses.findIndex((o) => o.status === order.status) >
                        statuses.findIndex((o) => o.status === status.status),
                      canceled: order.status === 'cancelled',
                    }"
                    v-for="status in statuses"
                  >
                    {{ status.title }}
                  </li>
                </ul>
              </div>
            </td>
            <td v-else>
              {{ statuses.find((st) => st.status === order.status)?.title }}
            </td>

            <td>₽{{ order.price }}</td>
            <td>
              {{
                customers.find((customer) => customer.id === order.customer)
                  ?.firstName
              }}
              ({{
                customers.find((customer) => customer.id === order.customer)
                  ?.username
              }})
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
      <template v-if="userRole === 'Customer'">
        <UIButton @click="openNewOrderModal">Новый</UIButton>
        <UIButton :disabled="!selectedOrder" @click="deleteOrder(selectedOrder)"
          >Удалить</UIButton
        >
        <UIButton :disabled="!selectedOrder" @click="cancelOrder(selectedOrder)"
          >Отклонить</UIButton
        >
      </template>
      <template v-else-if="userRole === 'ClientManager'">
        <UIButton @click="openNewOrderModal">Новый</UIButton>
        <UIButton :disabled="!selectedOrder" @click="acceptOrderModal"
          >Принять заказ</UIButton
        >
        <UIButton :disabled="!selectedOrder" @click="changeStatus('accept')"
          >Изменить заказ</UIButton
        >
      </template>
      <template v-else-if="userRole === 'Director'">
        <UIButton @click="openNewOrderModal">Новый</UIButton>
        <UIButton :disabled="!selectedOrder" @click="deleteOrder(selectedOrder)"
          >Удалить</UIButton
        >
        <UIButton :disabled="!selectedOrder" @click="editOrder('accept')"
          >Изменить заказ</UIButton
        >
      </template>
      <template v-else-if="userRole === 'PurchaseManager'">
        <UIButton @click="openNewOrderModal">Новый</UIButton>
        <UIButton @click="changeStatus('production')">На производство</UIButton>
      </template>
      <template v-else-if="userRole === 'Master'">
        <UIButton :disabled="!selectedOrder" @click="openNewOrderModal"
          >На контроль</UIButton
        >
        <UIButton :disabled="!selectedOrder" @click="deleteOrder('finished')"
          >Готов</UIButton
        >
      </template>
    </div>
  </main>
  <OrderModal
    allOrders="orders"
    :open="isOrderModalOpen"
    :isEditing="isEditing"
    :order="editableOrder"
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

.popup {
  opacity: 0;
  width: 100%;
  position: absolute;
  min-height: 150px;
  background-color: #fff;
  top: 30px;
  left: 0;
  border: 1px solid black;
  border-top: 0px;
  padding: 1rem;
  z-index: 1;
  margin: 0;
  transition: opacity 0.5s ease; /* Set a shorter transition time */
}

.status-cell {
  position: relative;
  min-width: 200px;
}

.status-cell:hover .popup {
  opacity: 1;
  transition-delay: 0.5s; /* Add this line to delay the transition */
}
.status-cell:hover {
  background-color: rgba(200, 200, 200, 0.5);
}
.status-list {
  color: darkgray;
  list-style: none;
  font-size: 0.9rem;
  padding: 0;
  margin: 0;
}

.passed {
  color: green;
}
.canceled {
  color: red;
}
</style>
