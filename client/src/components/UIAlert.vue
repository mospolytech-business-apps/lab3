<script setup>
import { useNotificationsStore } from "@/stores/notifications.store";
import { storeToRefs } from "pinia";

const errorStore = useNotificationsStore();
const { removeAlert } = errorStore;
const { alerts } = storeToRefs(errorStore);

errorStore.$subscribe((state) => {
  if (state.events.target.length > 0) {
    setTimeout(() => {
      removeAlert(alerts.value[0]);
    }, 3000);
  }
});
</script>

<template>
  <div class="err" v-show="alerts.length">
    <span class="message"> {{ "🔔 " + alerts?.at(-1) }}</span>
  </div>
</template>

<style scoped>
.err {
  background-color: rgb(192, 255, 46);
  display: flex;
  min-width: 10rem;
  padding: 2rem 6rem;
  border: 1px solid black;
  transform: translate(-50%, 0);
}

.message {
}
</style>
