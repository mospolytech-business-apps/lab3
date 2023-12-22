import { defineStore } from "pinia";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";
import { computed, ref } from "vue";
import Cookies from "js-cookie";

export const useUsersStore = defineStore("users", () => {
  const { addError } = useNotificationsStore();

  const currentUser = ref({});
  const allUsers = ref([]);
  const userRole = ref(Cookies.get("USER_ROLE"));

  const clientManagers = computed(() => {
    return allUsers.value.filter((user) => user.role === "ClientManager");
  });

  const customers = computed(() => {
    return allUsers.value.filter((user) => user.role === "Customer");
  });

  const fetchUsers = async () => {
    const { res, err } = await api.fetchUsers();
    if (err !== null) {
      addError(err.message);
      return;
    }

    allUsers.value = res;
    return res;
  };

  const addUser = async (user) => {
    const { res, err } = await api.addUser(user);
    if (err !== null) {
      addError(err.message);
      return;
    }

    allUsers.value.push(user);
    return res;
  };

  return {
    allUsers,
    addUser,
    userRole,
    currentUser,
    fetchUsers,
    clientManagers,
    customers,
  };
});
