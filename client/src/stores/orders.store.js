import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useNotificationsStore } from "@/stores/notifications.store";
import { api } from "@/api";
import { BASE_URL } from "@/config.js";

export const useOrdersStore = defineStore("orders", () => {
  const { addError } = useNotificationsStore();

  const allOrders = ref([]);

  const statuses = [
    {
      title: "Новый",
      status: "new",
    },
    {
      title: "Составление спецификации",
      status: "specification",
    },
    {
      title: "Подтверждение",
      status: "approving",
    },
    {
      title: "Закупка",
      status: "procurement",
    },
    {
      title: "Производство",
      status: "production",
    },
    {
      title: "Контроль",
      status: "checking",
    },
    {
      title: "Готов",
      status: "ready",
    },
    {
      title: "Выполнен",
      status: "finished",
    },
    {
      title: "Отменен",
      status: "cancelled",
    },
  ];

  const numberOfOrdersToday = computed(() => {
    const today = new Date().toLocaleDateString();

    return allOrders.value.filter((order) => order.date === today).length;
  });

  const fetchOrders = async () => {
    const { res, err } = await api.fetchOrders(`${BASE_URL}/orders.json`);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allOrders.value = res;

    return res;
  };

  const addOrder = async (order) => {
    const { res, err } = await api.addOrder(order);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allOrders.value.push(res);

    return res;
  };

  const updateOrder = async (order) => {
    const { res, err } = await api.updateOrder(order);

    if (err !== null) {
      addError(err.message);
      return;
    }

    return res;
  };

  const changeStatus = async (order, status) => {
    const { res, err } = await updateOrder({
      ...order,
      status,
    });

    if (err !== null) {
      addError(err.message);
      return;
    }

    return res;
  };

  return {
    allOrders,
    fetchOrders,
    addOrder,
    updateOrder,
    statuses,
    numberOfOrdersToday,
    changeStatus,
  };
});
