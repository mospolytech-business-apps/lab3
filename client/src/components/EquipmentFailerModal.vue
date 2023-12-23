<script setup>
import UIHeader from "@/components/UIHeader.vue";

import { ref, onMounted, watch, watchEffect } from "vue";
import { useEquipmentFailuresStore } from "@/stores/equipmentFailures.store";
import { useEquipmentsStore } from "@/stores/equipments.store";
import { storeToRefs } from "pinia";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";

const { allEquipments } = storeToRefs(useEquipmentsStore());
const { fetchEquipment } = useEquipmentsStore();

const {
  reasons,
  addEquipmentFailures,
  editEquipmentFailures,
  fetchEquipmentFailures,
} = useEquipmentFailuresStore();
const { allEquipmentFailures } = storeToRefs(useEquipmentFailuresStore());

const failure = ref({
  break: null,
  fix: null,
  equipment: null,
  reason: null,
  complete: false,
});

const props = defineProps({
  open: { type: Boolean, required: true },
  failure: { type: Object || null, required: true },
  isEditing: { type: Boolean, required: true },
});

const equipments = ref([]);
onMounted(async () => {
  equipments.value = allEquipments.value.length
    ? allEquipments.value
    : await fetchEquipment();
});

const equipmentFailures = ref([]);
onMounted(async () => {
  equipmentFailures.value = allEquipmentFailures.value.length
    ? allEquipmentFailures.value
    : await fetchEquipmentFailures();
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
  failure.value = {
    date: null,
    time: null,
    equipment: null,
    reason: null,
    complete: false,
  };
};

const isFixed = (failure) =>
  !failure.date || !failure.time || !failure.equipment || !failure.reason;

onMounted(() => {
  watchEffect(() => {
    failure.value = props.isEditing
      ? {
          date: new Date(props.failure.break).toISOString().slice(0, 10),
          time: new Date(props.failure.break).toISOString().slice(11, 16),
          equipment: props.failure.equipment,
          reason: props.failure.reason,
          complete: props.failure.complete,
        }
      : failure.value;
  });
});

const handleAddEquipmentFailures = () => {
  if (!props.isEditing) {
    addEquipmentFailures({
      break: new Date(
        `${failure.value.date}T${failure.value.time}:00.000Z`
      ).toISOString(),
      fix:
        failure?.value.result_date && failure?.value.result_time
          ? new Date(
              `${failure.value?.result_date}T${failure?.value.result_time}:00.000Z`
            ).toISOString()
          : null,
      equipment: failure.value.equipment,
      reason: failure.value.reason,
      complete: failure.value.complete,
    });
  } else {
    editEquipmentFailures({
      id: props.failure.id,
      break: new Date(
        `${failure.value.date}T${failure.value.time}:00.000Z`
      ).toISOString(),
      fix:
        failure?.value.result_date && failure?.value.result_time
          ? new Date(
              `${failure.value?.result_date}T${failure?.value.result_time}:00.000Z`
            ).toISOString()
          : null,
      equipment: failure.value.equipment,
      reason: failure.value.reason,
      complete: failure.value.complete,
    });
  }

  close();
};
</script>

<template>
  <div class="modal" v-if="props.open">
    <UIHeader title="Новый сбой" :closeButtonHandler="close" />
    <main class="main">
      <form @submit.prevent="handleAddEquipmentFailures">
        <label class="label"
          >Дата и время сбоя
          <div class="date">
            <input
              v-model="failure.date"
              type="date"
              :disabled="failure.complete == true"
              required
            />
            <input
              v-model="failure.time"
              type="time"
              :disabled="failure.complete == true"
              required
            />
          </div>
        </label>
        <label class="label"
          >Оборудование
          <UISelect
            v-model="failure.equipment"
            :disabled="failure.complete == true"
            required
          >
            <option v-for="equipment in equipments" :value="equipment.id">
              {{ equipment.name }}
            </option>
          </UISelect>
        </label>
        <label class="label">
          Причина сбоя
          <UISelect
            v-model="failure.reason"
            :disabled="failure.complete == true"
            required
          >
            <option v-for="reason in reasons" :value="reason">
              {{ reason }}
            </option>
          </UISelect>
        </label>
        <label class="label date">
          Сбой устранён:
          <input
            type="checkbox"
            v-model="failure.complete"
            :disabled="isFixed(failure)"
          />
        </label>
        <label class="label" v-if="failure.complete == true"
          >Дата и время устранения неполадки
          <div class="date">
            <input v-model="failure.result_date" type="date" />
            <input v-model="failure.result_time" type="time" />
          </div>
        </label>
        <div class="actions">
          <UIButton
            @click="applyEquipmentFailuresChanges"
            :required="isFixed(failure)"
            >Применить</UIButton
          >
          <UIButton
            class="cancel-btn"
            @click="close"
            :required="isFixed(failure)"
            >Отмена</UIButton
          >
        </div>
      </form>
    </main>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.5rem 4rem;
  background-color: white;
}

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

.label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
}

.date {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}
.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.cancel-btn:hover {
  background-color: salmon;
}
</style>
