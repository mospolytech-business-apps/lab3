<template>
  <div class="wrapper">
    <RouterView />
  </div>
  <UIError />
  <UIAlert />
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
  border: 2px solid black;
}
.main {
  height: calc(100% - 3.6rem);
}
</style>
