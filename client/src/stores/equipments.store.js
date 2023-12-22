import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { ref } from "vue";
import { api } from "@/api";

export const useEquipmentsStore = defineStore("equipment", () => {
  const { addError } = useNotificationsStore();

  const allEquipments = ref([]);

  const fetchEquipment = async () => {
    const { res, err } = await api.fetchEquipment();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipments.value = res;

    return res;
  };

  const addEquipment = async (equipment) => {
    const { res, err } = await api.addEquipment(equipment);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipments.value.push(res);

    return res;
  };

  const deleteEquipment = async (equipment) => {
    const { res, err } = await api.deleteEquipment(equipment);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipments.value = allEquipments.value.filter(
      (e) => e.id !== equipment.id
    );

    return res;
  };

  return {
    allEquipments,
    fetchEquipment,
    addEquipment,
    deleteEquipment,
  };
});
