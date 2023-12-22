<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useEquipmentStore } from "@/stores/equipment.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import { useUsersStore } from "@/stores/users.store";
import AddToolModal from "@/components/AddToolModal.vue";

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
            <th>Заказ</th>
            <th>Дата</th>
            <th>Наименование</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tool in tools"
            :key="tool.id"
            @click="selectOrder(order)"
            :class="{
              selected: order === selectedOrder,
            }"
          >
            <td>№{{ tool }}</td>
            <td>{{ tool }}</td>
            <td>{{ tool }}</td>
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
