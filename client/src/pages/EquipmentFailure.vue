<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useEquipmentFailuresStore } from "@/stores/equipmentFailures.store";
import { useEquipmentsStore } from "@/stores/equipments.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import EquipmentFailerModal from "@/components/EquipmentFailerModal.vue";

const { allEquipments } = storeToRefs(useEquipmentsStore());
const { fetchEquipment } = useEquipmentsStore();

const equipments = ref([]);

const isEquipmentFailureModalOpen = ref(false);
const editableEquipmentFailure = ref(null);

const openEquipmentFailureModal = () => {
  isEquipmentFailureModalOpen.value = true;
};

const closeEquipmentFailureModal = async () => {
  isEquipmentFailureModalOpen.value = false;
  equipmentFailures.value = await fetchEquipmentFailures();
};

const handleNewEquipmentFailure = () => {
  openEquipmentFailureModal();
};

const { addEquipmentFailures, fetchEquipmentFailures } =
  useEquipmentFailuresStore();
const { allEquipmentFailures } = storeToRefs(useEquipmentFailuresStore());

const equipmentFailures = ref([]);

const handleEditEquipmentFailure = (equipment) => {
  editableEquipmentFailure.value = equipment;
  openEquipmentFailureModal();
};

onMounted(() => {
  watchEffect(async () => {
    equipments.value = allEquipments.value.length
      ? allEquipments.value
      : await fetchEquipment();

    equipmentFailures.value = allEquipmentFailures.value.length
      ? allEquipmentFailures.value
      : await fetchEquipmentFailures();
  });
});
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
            <th>Название</th>
            <th>Дата и время поломки</th>
            <th>Причина</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipmentFailure in equipmentFailures">
            <template v-if="equipmentFailure.complete == false">
              <td>
                {{
                  equipments.find((e) => e.id == equipmentFailure.equipment)
                    .name
                }}
              </td>
              <td>
                {{
                  new Date(equipmentFailure.break).toLocaleString("ru-RU", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "Europe/London",
                  })
                }}
              </td>
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
      :failure="editableEquipmentFailure"
      :isEditing="!!editableEquipmentFailure"
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
