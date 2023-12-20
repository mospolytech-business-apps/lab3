<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";

import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";
import UINav from "../components/UINav.vue";

const { register } = useUsersStore();
const { allUsers } = storeToRefs(useUsersStore());
const { getAllUsers } = useUsersStore();

const userData = ref({
  username: null,
  firstName: null,
  lastName: null,
  password: null,
  role: null,
});

const usernameInput = ref(null);

onMounted(async () => {
  usernameInput.value.focus();
  allUsers.value = await getAllUsers();
});
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <form class="form" @submit.prevent="register(userData)">
      <label class="label">
        <span class="span">Логин</span>
        <input v-model="userData.username" class="input" type="text" required />
      </label>
      <label class="label">
        <span class="span">Имя</span>
        <input
          v-model="userData.firstName"
          class="input"
          type="text"
          required
        />
      </label>
      <label class="label">
        <span class="span">Фамилия</span>
        <input v-model="userData.lastName" class="input" type="text" required />
      </label>
      <label class="label">
        <span class="span">Пароль</span>
        <input
          v-model="userData.firstName"
          class="input"
          type="text"
          required
        />
      </label>
      <label class="label">
        <span class="span">Подтверждение пароля</span>
        <input
          v-model="userData.firstName"
          class="input"
          type="text"
          required
        />
      </label>

      <UIButton class="button" type="submit">Войти</UIButton>
    </form>
  </main>
</template>

<style scoped>
.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: scroll;
}
.login-page {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.form {
  display: flex;
  padding: 2rem;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.label {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input {
  min-width: 20rem;
}

.button {
  width: 100%;
  /* width: 100%; */
  text-align: center;
}
</style>
