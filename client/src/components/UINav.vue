<script setup>
import { useUsersStore } from "@/stores/users.store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
const router = useRouter();

const { userRole } = storeToRefs(useUsersStore());

const showRoute = (route) => {
  const pageRoute = router.currentRoute.value.path;
  const isAuthPageOpen = pageRoute === "/login" || pageRoute === "/register";

  if (isAuthPageOpen) {
    if (route.path === "/login" || route.path === "/register") {
      return true;
    }
    return false;
  } else {
    return route.path !== "/login" && route.path !== "/register"
      ? route.meta?.roles?.includes(userRole.value)
      : false;
  }
};
</script>

<template>
  <nav
    class="nav-menu"
    v-show="!['Customer'].includes(userRole)"
  >
    <a
      v-for="route in router.options.routes"
      :class="{
        active: router.currentRoute.value.path === route.path,
      }"
      v-show="showRoute(route)"
      @click="$router.push(route.path)"
    >
      {{ route.meta?.title }}
    </a>
  </nav>
</template>

<style>
.nav-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding-left: 0.5rem;
  gap: 3rem;
  row-gap: 0.5rem;
  font-weight: 400;
  border-bottom: 2px solid black;
  background-color: whitesmoke;
  padding: 1rem;
}

.nav-menu > * {
  background: 0;
  border: 0;
  text-align: center;
  max-width: 12rem;
  width: max-content;
  cursor: pointer;
}

.nav-menu > *:hover {
  text-decoration: underline;
}

.nav-menu > *:active {
  color: blue;
}

.active {
  color: darkgreen;
}

@media print {
  .nav-menu {
    display: none;
  }
}
</style>
