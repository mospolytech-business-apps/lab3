<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useIngredientsStore } from "@/stores/ingredients.store";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

const { fetchIngredients } = useIngredientsStore();
const { allIngredients } = storeToRefs(useIngredientsStore());

const all = ref([]);
onMounted(async () => {
  all.value = allIngredients.value.length ? allIngredients.value : await fetchIngredients();
});

const inputedDate = ref(null);

const filteredArray = computed(() => {
  let result = {
    filteredIngredients: [],
    filteredDecorations: [],
    positions: null,
    cost: null
  }
  if (inputedDate.value == null){
    result.filteredIngredients = all.value.filter((all) =>
      all.isDecoration == false)
    result.filteredDecorations = all.value.filter((all) =>
      all.isDecoration == true)
  } else {
    let endDate = new Date(inputedDate.value)
    result.filteredIngredients = all.value.filter((all) => {
      let startDate = new Date(all.expirationDate)
      return (endDate < startDate && all.isDecoration == false)
    })
    result.filteredDecorations = all.value.filter((all) => {
      let startDate = new Date(all.expirationDate)
      return (endDate < startDate && all.isDecoration == true)
    })
  }
  result.positions = result.filteredDecorations.length + result.filteredIngredients.length
  result.filteredDecorations.forEach((e) => {result.cost += e.price})
  result.filteredIngredients.forEach((e) => {result.cost += e.price})
  return result
})

onUnmounted(() => {
  inputedDate.value = null;
});
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <div class="filter">
      <input type="date" v-model="inputedDate">
      <p v-if="inputedDate != null">Количество выведенных позиций: {{ filteredArray.positions }}</p>
      <p v-if="inputedDate != null">Общая закупочная стоимость {{ filteredArray.cost }}</p>
    </div>
    <h2 class="section-heading">Ингредиенты <span v-if="inputedDate != null">{{ filteredArray.filteredIngredients.length }}</span></h2>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Количество</th>
            <th>Ед. измерения</th>
            <th>Закупочная цена</th>
            <th>Осн. поставщик</th>
            <th>Срок доставки</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ingredient in filteredArray.filteredIngredients"
            :key="ingredient.id"
          >
            <td>{{ ingredient.articul }}</td>
            <td>{{ ingredient.name }}</td>
            <td>{{ ingredient.amount }}</td>
            <td>{{ ingredient.units }}</td>
            <td>{{ ingredient.price }}</td>
            <td>{{ ingredient.supplier }}</td>
            <td>{{ ingredient.expirationDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 class="section-heading">Украшения <span v-if="inputedDate != null">{{ filteredArray.filteredDecorations.length }}</span></h2>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Количество</th>
            <th>Ед. измерения</th>
            <th>Закупочная цена</th>
            <th>Осн. поставщик</th>
            <th>Срок доставки</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="decoration in filteredArray.filteredDecorations"
            :key="decoration.id"
          >
            <td>{{ decoration.articul }}</td>
            <td>{{ decoration.name }}</td>
            <td>{{ decoration.amount }}</td>
            <td>{{ decoration.units }}</td>
            <td>{{ decoration.price }}</td>
            <td>{{ decoration.supplier }}</td>
            <td>{{ decoration.expirationDate }}</td>
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
td,
th {
  border: 1px solid black;
  padding-inline-start: 0.25rem;
}
.table-wrapper {
  flex-grow: 1;
  width: 100%;
  border: 2px solid black;
  overflow: scroll;
}
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: scroll;
}
</style>
