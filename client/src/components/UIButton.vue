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
  background-color: white;
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  position: relative;
}
.btn:hover {
  background-color: lightgray;
}

.btn:active {
  background-color: grey;
}

.btn:disabled {
  opacity: 0.5;
  cursor: initial;
}

.btn:disabled:hover {
  background: white;
}
</style>
