<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import {useIngredientsStore} from "@/stores/ingredients.store";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, watchEffect} from "vue";
import UISelect from "@/components/UISelect.vue";
import {addDaysToDate, sortIngredientsOrDecorationsInDaysGroup} from "@/utils/helpers";

const { fetchIngredients } = useIngredientsStore();
const { allIngredients } = storeToRefs(useIngredientsStore());

const chosenElementsType = ref('ingredients');
const ingredientsType = ref('все');
const decorationsType = ref('все');

const elementTypes = computed(() => {
  return allIngredients.value.reduce((acc, cur) => {
    if ((chosenElementsType.value === 'ingredients' && !cur.isDecoration) ||
        (chosenElementsType.value === 'decorations' && cur.isDecoration)) {
      if (!acc.includes(cur.type)) {
        return acc.concat([cur.type]);
      }
    }
    return acc;
  }, [])
})

onMounted(async () => {
  await fetchIngredients()
});

watchEffect(() => {
  if (chosenElementsType.value === 'ingredients') {
    ingredientsType.value = 'все';
  } else {
    decorationsType.value = 'все';
  }
})

const filteredAndMappedElements = computed(() => {
  const type = chosenElementsType.value === 'ingredients' ?  ingredientsType.value : decorationsType.value;
  const elements = chosenElementsType.value === 'ingredients' ?
      allIngredients.value.filter(el => !el.isDecoration) :
      allIngredients.value.filter(el => el.isDecoration);

  const resultList = type === 'все' ?
      elements :
      elements.filter(el => el.type === type && new Date(el.expirationDate) > Date.now());
  resultList.sort((a, b) => new Date(a.expirationDate) -  new Date(b.expirationDate));

  return sortIngredientsOrDecorationsInDaysGroup(resultList)
})

</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
      <div class="control">
      <UISelect id="ingredientOrDecoration" v-model="chosenElementsType" :modelValue="chosenElementsType">
        <option value="ingredients">
          Список остатков ингредиентов
        </option>
        <option value="decorations">
          Список остатков украшений
        </option>
      </UISelect>
        <UISelect
            v-if="chosenElementsType === 'ingredients'"
            id="ingredientsType"
            v-model="ingredientsType"
            :modelValue="ingredientsType"
        >
          <option value="все">
            все
          </option>
          <option v-for="type in elementTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </UISelect>
        <UISelect
            v-if="chosenElementsType === 'decorations'"
            id="decorationsType"
            v-model="decorationsType"
            :modelValue="decorationsType"
        >
          <option value="все">
            все
          </option>
          <option v-for="type in elementTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </UISelect>
      </div>
    <table>
      <thead>
      <tr>
        <th>Название</th>
        <th>Количество</th>
        <th>Единица измерения</th>
        <th>Срок годности</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(dateGroupElements, date) in filteredAndMappedElements" :key="date">
        <tr><th colspan="4">срок годности {{ date }} - {{ addDaysToDate(date.split('.').reverse().join('.'), 3) }}</th></tr>
        <tr v-for="element in dateGroupElements" :key="element.id">
          <td>
            {{ element.name }}
          </td>
          <td>{{ element.amount }}</td>
          <td>{{ element.units }}</td>
          <td>{{ new Date(element.expirationDate).toLocaleDateString() }}</td>
        </tr>
      </template>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.main {
  margin: 1rem;
}

.control {
display: grid;
  grid-template-columns: 300px 200px;
  gap: 10px;
  margin-bottom: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

</style>
