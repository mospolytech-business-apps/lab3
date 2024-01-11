<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";

const props = defineProps({
  open: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Отклонить заказ" :closeButtonHandler="close" />
    <main class="main">
      <form class="form" @submit.prevent="close">
        Уточните причину отклонения заказа
        <textarea cols="40" rows="10"></textarea>
        <UIButton class="cerate-order" type="submit">Отклонить</UIButton>
      </form>
    </main>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  z-index: 2;
  display: flex;
  flex-direction: column;
  max-width: 45%;
  max-height: 80%;
  overflow-y: scroll;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  box-shadow: 0 0 2rem black;
  justify-content: center;
}

.main {
  gap: 1rem;
  display: flex;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  padding: 1.5rem 4rem;
  background-color: white;
  margin-bottom: 0.5rem;
}
</style>
