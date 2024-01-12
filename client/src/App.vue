<template>
    <div class="wrapper">
        <!-- поддержка асинхронности -->
        <Suspense>
        <!-- component with nested async dependencies -->
            <router-view v-slot="{ Component }">
                <!-- кэширование страниц -->
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>

            <!-- loading state via #fallback slot -->
            <template #fallback>
                Loading...
            </template>
        </Suspense>

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

.red {
    background-color: rgba(255, 0, 0, 0.5);
}
.green {
    background-color: rgba(0, 128, 0, 0.5);
}
.gray {
    background-color: rgba(128, 128, 128, 0.5);
}
.yellow {
    background-color: rgba(255, 255, 0, 0.5);
}

thead {
  background-color: lightgray;
  border-bottom: 2px solid black;
}

.min-time {
  margin-top: 0.3rem;
}

td,
th {
  border: 1px solid black;
  padding-inline-start: 0.25rem;
}
th {
  text-align: left;
}
td {
  min-width: 50px;
}
</style>
