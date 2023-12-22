<template>
  <div class="wrapper">
    <RouterView />
    <UIError class="err" />
    <UIAlert class="err" />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import UIError from "@/components/UIError.vue";
import UIAlert from "@/components/UIAlert.vue";
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-color: white;
  position: relative;
}

.err {
  position: fixed;
  top: 10px;
  right: 0;
}

.main {
  height: calc(100% - 3.6rem);
}
</style>
