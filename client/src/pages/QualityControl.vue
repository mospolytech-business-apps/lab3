<script setup>
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/stores/orders.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import { computed, onMounted, ref } from "vue";
import UIButton from "@/components/UIButton.vue";
import AssessProductQualityModal from "@/components/AssessProductQualityModal.vue";

const { fetchOrders } = useOrdersStore();
const { allOrders } = storeToRefs(useOrdersStore());

const selectedOrder = ref(null);
const isAssessProductModalVisible = ref(false);
const ordersAssessments = ref([]);

const openAssessProductModal = (id) => {
  isAssessProductModalVisible.value = true;
  selectedOrder.value = allOrders.value.find((order) => order.id === id);
};

const closeAssessProductModal = () => {
  isAssessProductModalVisible.value = false;
  selectedOrder.value = null;
};

const saveOrderAssessment = (newAssessment) => {
  const existAssessment = ordersAssessments.value.find(
    (el) => el.orderId === newAssessment.orderId
  );
  existAssessment.metrics = newAssessment.metrics;
};

const changeOrderStatus = () => {
  allOrders.value.find((el) => el.id === selectedOrder.value.id).status =
    "done";
  selectedOrder.value = null;
};

const controlOrders = computed(() => {
  return allOrders.value.filter((order) => order.status === "checking");
});

const selectedOrderPreviousAssessment = computed(() => {
  return (
    ordersAssessments.value.find(
      (el) => el.orderId === selectedOrder.value?.id
    ) || []
  );
});

onMounted(async () => {
  allOrders.value.length ? allOrders.value : await fetchOrders();
  ordersAssessments.value = allOrders.value.flatMap((order) => {
    if (order.status === "checking") {
      return [
        {
          orderId: order.id,
          metrics: [],
        },
      ];
    }
    return [];
  });
});
</script>

<template>
  <UIHeader />
  <UINav />
  <AssessProductQualityModal
    v-if="isAssessProductModalVisible"
    :previous-assessment="selectedOrderPreviousAssessment.metrics"
    :order="selectedOrder"
    @close="closeAssessProductModal"
    @saveAssessment="saveOrderAssessment"
    @changeOrderStatus="changeOrderStatus"
  />
  <main class="main">
    <p class="title">Заказы, требующие оценки качества</p>
    <ul class="list">
      <li v-for="order in controlOrders" :key="order.id" class="order">
        <p class="order_name" :title="order.name">{{ order.name }}</p>
        <UIButton @click="() => openAssessProductModal(order.id)"
          >Оценить</UIButton
        >
      </li>
    </ul>
  </main>
</template>

<style scoped>
.main {
  margin: 1rem;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  width: 300px;
}

.order {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.order_name {
  max-width: 20ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
