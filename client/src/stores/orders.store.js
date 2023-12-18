import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { api } from "@/api";
import Cookies from "js-cookie";
import { BASE_URL } from "@/config.js";

export const useOrdersStore = defineStore("orders", () => {
  const { addError } = useNotificationsStore();

  const allOrders = ref([]);

  const fetchOrders = async () => {
    const { res, err } = await api.fetchOrders(`${BASE_URL}/orders.json`);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allOrders.value = res;

    return res;
  };

  return {
    allOrders,
    fetchOrders,
  };
});
