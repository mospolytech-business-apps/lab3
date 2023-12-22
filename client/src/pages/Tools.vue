<script setup>
import { storeToRefs } from "pinia";
// import { useToolsStore } from "@/stores/tools.store";
// import { useNotificationsStore } from "@/stores/notifications.store";
// import AddToolModal from "@/components/AddToolModal.vue";

// const { allTools } = storeToRefs(useToolsStore());
// const { addAlert } = useNotificationsStore();

const MONTH_IN_MS = 2.628e9;
const getEquipmentAge = (date) => {
  return Math.round((Date.now() - new Date(date)) / MONTH_IN_MS);
};
</script>

<template>
  <UIHeader title="Инструменты" />
  <UINav />

  <main class="main">
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Тип</th>
            <th>Возраст</th>
            <th>Количество</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tool in allTools"
            :key="tool.id"
            @click="selectOrder(order)"
            :class="{
              selected: order === selectedOrder,
            }"
          >
            <td>{{ tool.name }}</td>
            <td>{{ tool.InstanceType }}</td>
            <td>{{ tool.usageDegree }}</td>
            <td>{{ tool.amount }}</td>
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
  <AddToolModal />
</template>

<style scoped>
.main {
}
</style>
