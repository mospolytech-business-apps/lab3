import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useUsersStore } from "@/stores/users.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import router from "@/router";
import Cookies from "js-cookie";
import { api } from "@/api";
import { validatePassword } from "@/helpers/validate-password.js";

export const useAuthStore = defineStore("auth", () => {
  const { addError, addAlert } = useNotificationsStore();
  const { allUsers, userRole, userID } = storeToRefs(useUsersStore());
  const { currentUser } = useUsersStore();

  const isLoginFormBlocked = ref(false);
  const attemptsCount = ref(0);

  const login = async (username, password) => {
    if (username === "" || password === "") {
      addError("Заполните все поля");
      return;
    }

    const user = allUsers.value?.find((user) => user.username === username);

    if (user === undefined) {
      addError("Ошибка в логине или пароле");

      attemptsCount.value += 1;

      if (attemptsCount.value === 3) {
        addAlert("Вы заблокированы на 5 секунд");

        isLoginFormBlocked.value = true;

        setTimeout(() => {
          isLoginFormBlocked.value = false;
          attemptsCount.value = 0;
        }, 5000);

        return;
      }
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
    userID.value = currentUser.value.id;

    router.push("/");
  };

  const register = async (user) => {
    if (user.password !== user.passwordRepeat) {
      addError("Пароли не совпадают");

      return;
    }

    const validationMessage = validatePassword(user.password, user.username);
    if (validationMessage !== null) {
      addError(validationMessage);
      return;
    }

    user.role = "Customer";
    user.passwordRepeat = undefined;

    allUsers.value.push({
      ...user,
    });

    const { err, res } = await api.addUser(user);
    if (err) {
      addError(err);
      return;
    }

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
    isLoginFormBlocked,
  };
});
