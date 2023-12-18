<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";

import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/stores/users.store";

const { login, logout } = useUsersStore();
const { allUsers } = storeToRefs(useUsersStore());
const { getAllUsers } = useUsersStore();

const username = ref("");
const password = ref("");

const usernameInput = ref(null);

onMounted(async () => {
  usernameInput.value.focus();
  allUsers.value = await getAllUsers();
});
</script>

<template>
  <UIHeader title="Вход в систему" />
  <main class="main">
    <form class="form" @submit.prevent="login(username, password)">
      <label class="label">
        <span class="span">Username:</span>
        <input
          class="input"
          type="text"
          v-model="username"
          ref="usernameInput"
        />
      </label>
      <label class="label">
        <span class="span">Password:</span>
        <input class="input" type="password" v-model="password" />
      </label>
      <div class="buttons">
        <UIButton type="submit">Login</UIButton>
        <UIButton @click="logout()" type="reset">Exit</UIButton>
      </div>
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
  padding: 2rem;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.label {
  position: relative;
}
.span {
  position: absolute;
  left: -25%;
}

.input {
  min-width: 20rem;
}

.buttons {
  display: flex;
  gap: 1rem;
}
</style>
