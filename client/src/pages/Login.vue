<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";

import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";
import UINav from "../components/UINav.vue";

const { login } = useUsersStore();
const { allUsers } = storeToRefs(useUsersStore());
const { fetchUsers } = useUsersStore();

const username = ref("");
const password = ref("");

const usernameInput = ref(null);

onMounted(async () => {
  usernameInput.value.focus();
  allUsers.value = await fetchUsers();
});
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <form class="form" @submit.prevent="login(username, password)">
      <label class="label">
        <span class="span">Логин</span>
        <input
          class="input"
          type="text"
          v-model="username"
          ref="usernameInput"
        />
      </label>
      <label class="label">
        <span class="span">Пароль</span>
        <input class="input" type="password" v-model="password" />
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
}
</style>
