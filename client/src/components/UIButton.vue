<template>
  <button class="btn" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<script setup></script>

<style scoped>
.btn {
  padding: 0.25rem 2rem;
  border: 0.1px solid black;
  border-radius: 0px;
  background-color: rgb(255, 215, 127);
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  position: relative;
}
.btn:hover {
  background-color: rgb(255, 153, 51);
}

.btn:active {
  background-color: rgb(233, 230, 177);
}

.btn:disabled {
  opacity: 0.5;
  cursor: initial;
}

.btn:disabled:hover {
  background: white;
}
</style>
