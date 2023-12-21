<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useEquipmentsStore } from "@/stores/equipments.store";
import { useEquipmentFailuresStore } from "@/stores/equipmentFailures.store";
import { storeToRefs } from "pinia";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  open: { type: Boolean, required: true },
  equipment: { type: Object || null, required: true}
});

const reasons = ref(["Плохое обслуживание и неисправности","Износ материалов","Неправильная эксплуатация","Перебои в электроснабжении","Механические повреждения","Ошибки оператора",])

const { addEquipments, fetchEquipments } = useEquipmentsStore();
const { allEquipments } = storeToRefs(useEquipmentsStore());

const equipments = ref([]);
onMounted(async () => {
  equipments.value = allEquipments.value.length ? allEquipments.value : await fetchEquipments();
});

const { addEquipmentFailures, fetchEquipmentFailures } = useEquipmentFailuresStore();
const { allEquipmentFailures } = storeToRefs(useEquipmentFailuresStore());

const equipmentFailures = ref([]);
onMounted(async () => {
  equipmentFailures.value = allEquipmentFailures.value.length ? allEquipmentFailures.value : await fetchEquipmentFailures();
});

const editedEquipmentFailures = ref({
    id: equipmentFailures.value.length + 1,
    complite: false
});

const close = () => {
  emit("close");
  editedEquipmentFailures.value = {
    id: equipmentFailures.value.length + 1,
    complite: false
  }
};

watch(
  () => props.equipment,
  (newVal) => {
    editedEquipmentFailures.value = {
      ...newVal,
    };
  },
  { immediate: true }
);

//TODO: adding equipment failure

const applyEquipmentFailuresChanges = () => {
    console.log(editedEquipmentFailures.equipment)
}
</script>

<template>
  <div class="modal" v-if="props.open">
    <UIHeader title="Добавить заказ" :closeButtonHandler="close" />
    <main class="main">
      <div>
        <label class="label"
          >Дата и время сбоя
          <div class="date">
            <input v-model="editedEquipmentFailures.date" type="date" :disabled="editedEquipmentFailures.complite == true"/>
            <input v-model="editedEquipmentFailures.time" type="time" :disabled="editedEquipmentFailures.complite == true"/>
          </div>
        </label>
        <label class="label"
          >Оборудование
          <UISelect v-model="editedEquipmentFailures.reason" placeholder="Статус заказа" :disabled="editedEquipmentFailures.complite == true">
            <option v-for="(reason,index) in reasons" :key="index" :value="reason">{{ reason }}</option>
          </UISelect>
        </label>
        <label class="label">
          Причина сбоя
          <UISelect v-model="editedEquipmentFailures.equipment" placeholder="Статус заказа" :disabled="editedEquipmentFailures.complite == true">
            <option v-for="equipment in equipments" :key="equipment.id" :value="JSON.parse(JSON.stringify(equipment))">{{ equipment.type.name }} {{ equipment.mark }}</option>
          </UISelect>
        </label>
        <label class="label date">
          Сбой устранён: 
          <input type="checkbox" v-model="editedEquipmentFailures.complite" :disabled="!editedEquipmentFailures.date || !editedEquipmentFailures.time || !editedEquipmentFailures.equipment || !editedEquipmentFailures.reason">
        </label>
        <label class="label" v-if="editedEquipmentFailures.complite == true"
          >Дата и время устранения неполадки
          <div class="date">
            <input v-model="editedEquipmentFailures.result_date" type="date" />
            <input v-model="editedEquipmentFailures.result_time" type="time" />
          </div>
        </label>
        <div class="actions">
            <UIButton @click="applyEquipmentFailuresChanges()">Apply</UIButton>
            <UIButton class="cancel-btn" @click="close">Cancel</UIButton>
        </div>
    </div>
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

.date{
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