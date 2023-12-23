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
    v-show="!['Customer', 'ClientManager'].includes(userRole)"
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
  background-color: rgb(252, 238, 255);
  padding: 1rem;
}

.nav-menu a {
  border: 1px solid #840069;
  padding: 4px;
  line-height: 1.3;
  &:hover {
    background-color: #e064c8;
  }
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
  color: rgb(255, 0, 238);
}

.active {
  background-color: #e277cd;
  color: rgb(100, 0, 92);
}
</style>
