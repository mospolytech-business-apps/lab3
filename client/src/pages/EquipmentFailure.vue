<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useEquipmentFailuresStore } from "@/stores/equipmentFailures.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import EquipmentFailerModal from "@/components/EquipmentFailerModal.vue";

const isEquipmentFailureModalOpen = ref(false);

const editableEquipmentFailure = ref(null);

const openEquipmentFailureModal = () => {
  isEquipmentFailureModalOpen.value = true;
};

const closeEquipmentFailureModal = async () => {
  isEquipmentFailureModalOpen.value = false;
};

const handleNewEquipmentFailure = () => {
  openEquipmentFailureModal();
};

const { addEquipmentFailures, fetchEquipmentFailures } =
  useEquipmentFailuresStore();
const { allEquipmentFailures } = storeToRefs(useEquipmentFailuresStore());

const equipmentFailures = ref([]);
onMounted(async () => {
  watchEffect(async () => {
    equipmentFailures.value = allEquipmentFailures.value.length
      ? allEquipmentFailures.value
      : await fetchEquipmentFailures();
  });
});

const handleEditEquipmentFailure = (equipment) => {
  editableEquipmentFailure.value = equipment;
  openEquipmentFailureModal();
};
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <UIButton @click="handleNewEquipmentFailure">Новый</UIButton>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Equipment</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="equipmentFailure in equipmentFailures"
            :key="equipmentFailure.id"
          >
            <template v-if="equipmentFailure.complite == false">
              <td>
                {{ equipmentFailure.equipment.type.name }}
                {{ equipmentFailure.equipment.mark }}
              </td>
              <td>{{ equipmentFailure.date }}</td>
              <td>{{ equipmentFailure.time }}</td>
              <td>{{ equipmentFailure.reason }}</td>
              <td class="actions">
                <UIButton @click="handleEditEquipmentFailure(equipmentFailure)"
                  >Редактировать</UIButton
                >
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <EquipmentFailerModal
      :open="isEquipmentFailureModalOpen"
      @close="closeEquipmentFailureModal"
      :equipment="editableEquipmentFailure"
    />
  </main>
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
td,
th {
  border: 1px solid black;
  padding-inline-start: 0.25rem;
}

.actions {
  display: flex;
  justify-content: center;
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
</style>
