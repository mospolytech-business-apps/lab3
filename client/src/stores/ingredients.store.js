import { ref } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";

export const useIngredientsStore = defineStore("ingredients", () => {
  const { addError } = useNotificationsStore();

  const allIngredients = ref([]);

  const fetchIngredients = async () => {
    const { res, err } = await api.fetchIngredients();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allIngredients.value = res;

    return res;
  };

  const deleteIngredient = async (obj) => {
    console.log(obj.id)
    const { res, err } = await api.deleteIngredient(obj);
    // if (err !== null) {
    //   addError(err.message);
    //   return;
    // }
    allIngredients.value = allIngredients.value.filter((o) => o.id !== obj.id);
    return res;
  };

  const updateIngredient = (updatedObj) => {
    const index = allIngredients.value.findIndex((o) => o.id === updatedObj.id);
    if (index !== -1) {
      allIngredients.value.splice(index, 1, updatedObj);
    }
  };

  return {
    allIngredients,
    fetchIngredients,
    deleteIngredient,
    updateIngredient,
  };
});
