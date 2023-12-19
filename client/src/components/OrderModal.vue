<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import CustomerModal from "@/components/CustomerModal.vue";

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

const isCustomerModalOpen = ref(true);

const editableCustomer = ref(null);
const selectedCustomer = ref(null);

const openCustomerModal = () => {
  isCustomerModalOpen.value = true;
};

const closeCustomerModal = async () => {
  isCustomerModalOpen.value = false;
  editableCustomer.value = null;
};


const handleNewCustomer = () => {
  openCustomerModal();
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Добавить заказ" :closeButtonHandler="close" />

    <main class="main">
      <form action="">
        <label class="label">Номер и дата заказа
          <input v-model="editedOrder.something" type="text" />
        </label>
        <label class="label">Наименование заказа
          <input v-model="editedOrder.something" type="text" />
        </label>
        <label class="label"> Статус заказа
          <UISelect v-model="editedOrder.something">
            <option value=""></option>
          </UISelect>
        </label>
        <label class="label">Стоимость заказа
          <input v-model="editedOrder.something" type="text" />
        </label>
        <label class="label">Заказчик
          <div class="customer">
            <UISelect v-model="editedOrder.something">
              <option value=""></option>
            </UISelect>
            <UIButton @click="handleNewCustomer" class="select">Добавить заказчика</UIButton>
          </div>
        </label>
        <label class="label">Запланированная дата выполнения
          <input v-model="editedOrder.something" type="text" />
        </label>
        <label class="label">Ответственный менеджер
          <UISelect v-model="editedOrder.something">
            <option value=""></option>
          </UISelect>
        </label>
        <label class="field">
          <span class="label">Please select the text file with the changes</span>
          <div class="file-input-wrapper">
            <input class="input" type="file" ref="fileInput" />
            <UIButton @click="importData">
              <img
                src="https://cdn.icon-icons.com/icons2/1122/PNG/512/downloaddownarrowsymbolinsquarebutton_79508.png"
                width="25"
                alt="Import icon"
              />
              Import
            </UIButton>
          </div>
        </label>
      </form>
      <div class="actions">
        <UIButton @click="applyRoleChanges">Apply</UIButton>
        <UIButton class="cancel-btn" @click="close">Cancel</UIButton>
      </div>
    </main>
  </div>
  <CustomerModal :open="isCustomerModalOpen" @close="closeCustomerModal" />
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
  display: flex;
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

.label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.customer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.select {
  flex-shrink: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-input-wrapper {
  display: flex;
  gap: 1rem;
  padding-inline: 1rem;
}

.field {
  width: 100%;
  display: flex;
  grid-column: 1 / -1;
  justify-content: space-between;
}

.input {
  /* padding: 1rem 0.25rem; */
  border: 1px solid black;
  flex-grow: 1;
  border-radius: 0.25rem;
  padding-top: 0.25rem;
  padding-inline-start: 1rem;
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