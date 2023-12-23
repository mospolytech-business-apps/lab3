<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useEquipmentsStore } from "@/stores/equipments.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import AddEquipmentModal from "@/components/AddEquipmentModal.vue";
import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

const { allEquipments } = storeToRefs(useEquipmentsStore());
const { fetchEquipment, deleteEquipment } = useEquipmentsStore();
const { addAlert } = useNotificationsStore();

const isAddEquipmentModalOpen = ref(false);
const equipments = ref([]);

const selectedEquipment = ref(null);
const handleDelete = async (equipment) => {
  if (!equipment) {
    addAlert("Выберите оборудование для удаления");
    return;
  }
  try {
    await deleteEquipment(equipment);
    addAlert("Оборудование успешно удален");
  } catch (error) {
    addAlert("Не удалось удалить оборудование");
  }
};

onMounted(() => {
  watchEffect(async () => {
    equipments.value = allEquipments.value?.length
      ? allEquipments.value
      : await fetchEquipment();
  });
});
</script>

<template>
  <UIHeader />
  <UINav />

  <main class="main">
    <div class="table-wrapper" @click.self="selectedEquipment = null">
      <table class="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Бренд</th>
            <th>Тип</th>
            <th>Спецификация</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="equipment in equipments"
            @click="selectedEquipment = equipment"
            :class="{
              selected: equipment === selectedEquipment,
            }"
          >
            <td>{{ equipment?.name ?? "–" }}</td>
            <td>{{ equipment?.brand ?? "–" }}</td>
            <td>{{ equipment?.type ?? "–" }}</td>
            <td>{{ equipment?.specifications ?? "–" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons">
      <UIButton @click="isAddEquipmentModalOpen = true"
        >Добавить оборудование</UIButton
      >
      <UIButton
        @click="handleDelete(selectedEquipment)"
        class="button"
        type="button"
        >Удалить оборудование</UIButton
      >
    </div>
  </main>
  <AddEquipmentModal
    :open="isAddEquipmentModalOpen"
    @close="isAddEquipmentModalOpen = false"
  />
</template>

<style scoped>
.main {
}

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

.selected {
  box-shadow: inset 0 0 0 2px black;
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
