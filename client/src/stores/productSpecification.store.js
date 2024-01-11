import { ref } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";

export const useProductSpecificationsStore = defineStore("productSpecifications", () => {
  const { addError } = useNotificationsStore();

  const allProductSpecifications = ref([]);

  const fetchProductSpecifications = async () => {
    const { res, err } = await api.fetchProductSpecifications();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allProductSpecifications.value = res;

    return res;
  };

  const updateProductSpecification = async (productSpecification) => {
    const { res, err } = await api.updateProductSpecification(productSpecification);

    if (err !== null) {
      addError(err.message);
      return;
    }

    await fetchProductSpecifications();
    return res;
  };

//   const deleteIngredient = async (obj) => {
//     console.log(obj.id)
//     const { res, err } = await api.deleteIngredient(obj);
//     // if (err !== null) {
//     //   addError(err.message);
//     //   return;
//     // }
//     allIngredients.value = allIngredients.value.filter((o) => o.id !== obj.id);
//     return res;
//   };



  return {
    allProductSpecifications,
    fetchProductSpecifications,
    updateProductSpecification
    // deleteIngredient,
    // updateIngredient,
  };
});
