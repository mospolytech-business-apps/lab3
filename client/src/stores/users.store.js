import { defineStore } from "pinia";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";
import { generatePassword } from "@/helpers/generate-password";
import { computed, ref, onMounted } from "vue";
import Cookies from "js-cookie";

export const useUsersStore = defineStore("users", () => {
  const { addError } = useNotificationsStore();

  const allUsers = ref([]);
  const userRole = ref(Cookies.get("USER_ROLE"));
  const userID = ref(Cookies.get("USER_ID"));

  const currentUser = ref({});

  const fetchUserById = async (id) => {
    const { res, err } = await api.fetchUserById(id);

    console.log(res);

    if (err !== null) {
      addError(err.message);
      return;
    }

    currentUser.value = res;
    return res;
  };

  const clientManagers = computed(() => {
    return allUsers.value.filter((user) => user?.role === "ClientManager");
  });

  const customers = computed(() => {
    return allUsers.value.filter((user) => user?.role === "Customer");
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
    const data = {
      ...user,
      password: generatePassword(),
      role: "Customer",
    };

    const { res, err } = await api.addUser(data);
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
    userID,
    fetchUserById,
    currentUser,
    fetchUsers,
    clientManagers,
    customers,
  };
});
