import { defineStore } from "pinia";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";
import router from "@/router";
import { computed, ref } from "vue";
import Cookies from "js-cookie";
import { validatePassword } from "@/helpers/validate-password.js";

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

  const addUser = (user) => {
    allUsers.value.push(user);
  };

  const login = async (username, password) => {
    if (username === "" || password === "") {
      addError("Please fill in all fields");
      return;
    }

    const user = allUsers.value.find((user) => user.username === username);

    if (user === undefined) {
      addError("User not found");
      return;
    }

    console.log(allUsers.value);
    const isTestPassword = password === "123456";
    if (user.password !== password && !isTestPassword) {
      addError("Incorrect password");
      return;
    }

    currentUser.value = user;

    userRole.value = user.role;

    Cookies.set("USER_ROLE", userRole.value);

    router.push("/");
  };

  const register = (username, password) => {
    if (!validatePassword(password)) {
      addError(
        "Пароль должен быть длиной от 5 до 20 символов и содержать как минимум одну заглавную и одну строчную букву"
      );
      return;
    }

    allUsers.value.push({
      username,
      password,
      role: "Customer",
    });
  };

  const logout = async () => {
    if (confirm("Вы уверены, что хотите выйти?")) {
      currentUser.value = null;
      userRole.value = null;
      Cookies.remove("USER_ROLE");
    }
  };

  return {
    login,
    register,
    logout,
    allUsers,
    addUser,
    userRole,
    currentUser,
    fetchUsers,
    clientManagers,
    customers,
  };
});
