<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";

import { ref, reactive, onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/stores/orders.store";

const { editOrder } = useOrdersStore();
const { allOrders, fetchOrders } = storeToRefs(useOrdersStore());

const props = defineProps({
  open: { type: Boolean, required: true },
  order: { type: Object || null, required: true },
});

const emit = defineEmits(["close"]);

const editedOrder = ref({});

// TODO: replace by watchEffect
watch(
  () => props.order,
  (newVal) => {
    editedOrder.value = {
      ...newVal,
    };
  },
  { immediate: true }
);

const applyOrderChanges = () => {
  editOrder(editedOrder.value.id, {
    ...editedOrder.value,
  });
  emit("updateData");
  emit("close");
};

const orders = ref([]);
onMounted(async () => {
  orders.value = allOrders.value.length ? allOrders.value : await fetchOrders();
});

const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Добавить заказ" :closeButtonHandler="close" />

    <main class="main">
      <label for="firstName" class="label">Something</label>
      <input v-model="editedOrder.something" type="text" id="something" />

      <div class="actions">
        <UIButton @click="applyRoleChanges">Apply</UIButton>
        <UIButton class="cancel-btn" @click="close">Cancel</UIButton>
      </div>
    </main>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  min-width: 40%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  box-shadow: 0 0 2rem black;
}

.main {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 2fr;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.5rem 4rem;
  background-color: white;
}

.title {
  margin-bottom: 1rem;
}

.field {
  width: 100%;
  display: flex;
  grid-column: 1 / -1;
  justify-content: space-between;
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

.actions {
  grid-row: -1;
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.cancel-btn:hover {
  background-color: salmon;
}
</style>
