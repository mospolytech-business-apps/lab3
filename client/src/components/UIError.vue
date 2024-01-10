<script setup>
import { useNotificationsStore } from "@/stores/notifications.store";
import { storeToRefs } from "pinia";

const errorStore = useNotificationsStore();
const { removeError } = errorStore;
const { errors } = storeToRefs(errorStore);

errorStore.$subscribe((state) => {
  if (state.events.target.length > 0) {
    setTimeout(() => {
      removeError(errors.value[0]);
    }, 3000);
  }
});
</script>

<template>
  <div class="err" v-show="errors.length">
    <span class="message" v-show="errors.length">
      {{ "🚨 " + errors?.at(-1) }}</span
    >
  </div>
</template>

<style scoped>
.err {
  background-color: #ff8a63;
  display: flex;
  min-width: 10rem;
  padding: 2rem 6rem;
  border: 1px solid black;
  transform: translate(-50%, 0);
}
</style>
