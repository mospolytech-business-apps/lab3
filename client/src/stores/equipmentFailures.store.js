import { ref } from "vue";
import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { api } from "@/api";
import { BASE_URL } from "@/config.js";

export const useEquipmentFailuresStore = defineStore(
  "equipmentFailures",
  () => {
    const { addError } = useNotificationsStore();

    const reasons = [
      "Плохое обслуживание и неисправности",
      "Износ материалов",
      "Неправильная эксплуатация",
      "Перебои в электроснабжении",
      "Механические повреждения",
      "Ошибки оператора",
    ];

    const allEquipmentFailures = ref([]);

    const fetchEquipmentFailures = async () => {
      const { res, err } = await api.fetchEquipmentFailures(
        `${BASE_URL}/equipmentFailures`
      );

      if (err !== null) {
        addError(err.message);
        return;
      }

      allEquipmentFailures.value = res;

      return res;
    };

    const addEquipmentFailures = async (equipmentFailures) => {
      const { res, err } = await api.addEquipmentFailures(equipmentFailures);
      if (err !== null) {
        addError(err.message);
        return;
      }

      return res;
    };

    const editEquipmentFailures = async (equipmentFailures) => {
      const { res, err } = await api.editEquipmentFailures(equipmentFailures);
      if (err !== null) {
        addError(err.message);
        return;
      }

      return res;
    };

    return {
      allEquipmentFailures,
      fetchEquipmentFailures,
      addEquipmentFailures,
      editEquipmentFailures,
      reasons,
    };
  }
);
