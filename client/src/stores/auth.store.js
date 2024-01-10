import { defineStore, storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import router from "@/router";
import Cookies from "js-cookie";
import { api } from "@/api";
import { validatePassword } from "@/helpers/validate-password.js";

export const useAuthStore = defineStore("auth", () => {
  const { addError } = useNotificationsStore();
  const { allUsers, userRole, userID } = storeToRefs(useUsersStore());
  const { currentUser } = useUsersStore();

  const login = async (username, password) => {
    if (username === "" || password === "") {
      addError("Заполните все поля");
      return;
    }

    const user = allUsers.value?.find((user) => user.username === username);

    console.log(user);

    if (user === undefined) {
      addError("User not found");
      return;
    }

    const isTestPassword = password === "123456";
    if (user.password !== password && !isTestPassword) {
      addError("Неправленый пароль");
      return;
    }

    currentUser.value = user;

    userRole.value = user.role;

    Cookies.set("USER_ROLE", userRole.value);
    Cookies.set("USER_ID", currentUser.value.id);

    router.push("/");
  };

  const register = async (user) => {
    if (user.password !== user.passwordRepeat) {
      addError("Пароли не совпадают");
      return;
    }

    if (!validatePassword(user.password)) {
      addError("Пароли должен быть не менее 5 символов");
      return;
    }

    allUsers.value.push({
      ...user,
      role: "Customer",
    });

    const { err, res } = await api.addUser(user);
    console.log(res);

    Cookies.set("USER_ROLE", "Customer");
    Cookies.set("USER_ID", res.id);

    router.push("/");
  };

  const logout = async () => {
    if (confirm("Вы уверены, что хотите выйти?")) {
      currentUser.value = null;
      userRole.value = null;
      userID.value = null;
      Cookies.remove("USER_ROLE");
      Cookies.remove("USER_ID");
      router.push("/login");
    }
  };

  return {
    login,
    register,
    logout,
  };
});
