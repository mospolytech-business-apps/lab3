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
    <h1 class="title">
      {{ props.title ?? router.currentRoute.value.meta?.title }}
    </h1>
    <button @click="closeButtonHandler" class="exit-btn">❌</button>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  background-color: #98d728;
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

@media print {
  .header {
    display: none;
  }
}
</style>
