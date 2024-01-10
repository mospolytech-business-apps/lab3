<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const props = defineProps({
  closeButtonHandler: {
    type: Function,
    required: false,
    default: async () => {
      const { logout } = useAuthStore();
      logout();
    },
  },
  title: { type: String, required: false },
});

const modalTitle = computed(
  () => props.title || router.currentRoute.value.meta?.title
);

const router = useRouter();
</script>
<template>
  <header class="header">
    <a class="link-logo" href="/">
      <img src="../assets/logo.png" alt="logo" class="logo">
    </a>
    <h1 class="title">
      {{ props.title ?? router.currentRoute.value.meta?.title }}
    </h1>
    <button @click="closeButtonHandler" class="exit-btn">
      <img src="../assets/cross-icon.png" alt="logo" class="close">
    </button>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 215, 127);
}

.title {
  font-size: 1rem;
  margin: 0;
  padding-inline-start: 0.5rem;
}

.exit-btn {
  border: 0;
  background: 0;
}

.exit-btn:hover {
  cursor: pointer;
}

.logo{
  width: 38px;
  background-color: white;
  border-radius: 20px;
}

.link-logo{ 
  text-decoration: none;
}

.close {
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 20px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid black;
    background-color: rgb(233, 230, 177);
  }
}

@media print {
  .header {
    display: none;
  }
}
</style>
