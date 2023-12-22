import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { ref } from "vue";

export const useEquipmentStore = defineStore("equipment", () => {
  const { addError } = useNotificationsStore();

  const allEquipment = ref([]);

  const fetchEquipment = async () => {
    const { res, err } = await api.fetchEquipment();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipment.value = res;

    return res;
  };

  const addEquipment = async (tool) => {
    const { res, err } = await api.addEquipment(tool);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allTools.value.push(res);

    return res;
  };

  const deleteEquipment = async (tool) => {
    const { res, err } = await api.deleteEquipment(tool);

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
    addEquipment,
    deleteEquipment,
  };
});
