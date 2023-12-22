<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useIngredientsStore } from "@/stores/ingredients.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

const { fetchIngredients } = useIngredientsStore();
const { allIngredients } = storeToRefs(useIngredientsStore());

const ingredients = ref([]);
onMounted(async () => {
  ingredients.value = allIngredients.value.length ? allIngredients.value : await fetchIngredients();
});
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Equipment</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ingredient in ingredients"
            :key="ingredient.id"
          >
            <td>{{ ingredient.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.main {
  margin: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}
</style>
