import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";

export const useIngredientsStore = defineStore("ingredients", () => {
  const { addError } = useNotificationsStore();

  const allIngredients = ref([]);

  const fetchIngredients = async () => {
    const { res, err } = await api.fetchEquipment();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allIngredients.value = res;

    return res;
  };

  return {
    allIngredients,
    fetchIngredients,
  };
});
