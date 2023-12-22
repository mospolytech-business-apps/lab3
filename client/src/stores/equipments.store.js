import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { api } from "@/api";
import { BASE_URL } from "@/config.js";

export const useEquipmentsStore = defineStore("equipments", () => {
  const { addError } = useNotificationsStore();

  const allEquipments = ref([]);

  const fetchEquipments = async () => {
    const { res, err } = await api.fetchEquipments(`${BASE_URL}/equipments.json`);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allEquipments.value = res;

    return res;
  };

  return {
    allEquipments,
    fetchEquipments,
  };
});