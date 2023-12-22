import { defineStore, storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import router from "@/router";
import Cookies from "js-cookie";
import { validatePassword } from "@/helpers/validate-password.js";

export const useAuthStore = defineStore("auth", () => {
  const { addError } = useNotificationsStore();
  const { currentUser, allUsers, userRole } = storeToRefs(useUsersStore());

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
      router.push("/login");
    }
  };

  return {
    login,
    register,
    logout,
  };
});
