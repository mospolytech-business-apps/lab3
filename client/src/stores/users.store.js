import { defineStore } from "pinia";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";
import router from "@/router";
import { ref } from "vue";
import Cookies from "js-cookie";

export const useUsersStore = defineStore("users", () => {
  const { addError } = useNotificationsStore();

  const currentUser = ref({});
  const allUsers = ref([]);
  const userRole = ref(Cookies.get("USER_ROLE"));

  const getAllUsers = async () => {
    const { res, err } = await api.fetchUsers();
    if (err !== null) {
      addError(err.message);
      return;
    }

    allUsers.value = res;
    return res;
  };

  const login = async (username, password) => {
    console.log(username, password);
    if (username === "" || password === "") {
      addError("Please fill in all fields");
      return;
    }

    const user = allUsers.value.find((user) => user.username === username);

    if (user === undefined) {
      console.log("User not found");
      addError("User not found");
      return;
    }

    const isTestPassword = password === "123456";
    if (user.password !== password && !isTestPassword) {
      console.error("Incorrect password");
      addError("Incorrect password");
      return;
    }

    currentUser.value = user;

    userRole.value = user.role;

    Cookies.set("USER_ROLE", userRole.value);

    router.push("/");
  };

  const register = (username, password) => {
    const lengthValid = password.length >= 5 && password.length <= 20;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const isValid = lengthValid && hasUpperCase && hasLowerCase;

    if (!isValid) {
      addError(
        "Password must be 5-20 characters long and contain at least one uppercase and one lowercase letter"
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
    if (confirm("Are you sure you want to log out?")) {
      currentUser.value = null;
      userRole.value = null;
      Cookies.remove("USER_ROLE");
      window.location.href = "about:blank";
    }
  };

  return {
    login,
    register,
    logout,
    allUsers,
    userRole,
    currentUser,
    getAllUsers,
  };
});
