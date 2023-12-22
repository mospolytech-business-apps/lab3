import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";

export const useEquipmentStore = defineStore("equipment", () => {
  const { addError } = useNotificationsStore();

  const allTools = ref([]);

  const fetchEquipment = async () => {
    const { res, err } = await api.fetchEquipment();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipment.value = res;

    return res;
  };

  const addEquipments = async (tool) => {
    const { res, err } = await api.addEquipment(tool);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allTools.value.push(res);

    return res;
  };

  return {
    allEquipment,
    fetchEquipment,
    addEquipments,
  };
});
