import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { api } from "@/api";
import { BASE_URL } from "@/config.js";

export const useEquipmentFailuresStore = defineStore("equipmentFailures", () => {
  const { addError } = useNotificationsStore();

  const allEquipmentFailures = ref([]);

  const fetchEquipmentFailures = async () => {
    const { res, err } = await api.fetchEquipmentFailures(`${BASE_URL}/equipmentFailures.json`);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipmentFailures.value = res;

    return res;
  };

  const addEquipmentFailures = (equipmentFailures) => {
    allEquipmentFailures.value.push(equipmentFailures);
  };

  return {
    allEquipmentFailures,
    fetchEquipmentFailures,
    addEquipmentFailures
  };
});