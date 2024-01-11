<script setup>
import { ref, onUnmounted, onMounted, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useProductSpecificationsStore } from "@/stores/productSpecification.store.js";
import EditIngredientModal from "@/components/EditIngredientModal.vue";
import ComfirmModal from "@/components/ComfirmModal.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";

const { fetchProductSpecifications, deleteIngredient, updateIngredient } = useProductSpecificationsStore();
const { allProductSpecifications } = storeToRefs(useProductSpecificationsStore());

const all = ref([]);
onMounted(async () => {
  watchEffect(async () => {
    all.value = allProductSpecifications.value.length ? allProductSpecifications.value : await fetchProductSpecifications();
  });
});
</script>

<template>
  <UIHeader />
  <UINav />

  <main class="main">

    <ul v-for="specification in all">
      <h3>{{ specification.product }}</h3>

      <li>
        <h4>Полуфабрикаты: <span v-if="specification.semi_finished_products == null">–</span></h4>
        
        <ol v-if="specification.semi_finished_products != null">
          <li v-for="semi_finished_product in specification.semi_finished_products">{{ semi_finished_product.name }}</li>
        </ol>
      </li>

      <li> <!-- по хорошому сделать компонент -->
        <h4>Ингредиенты: <span v-if="specification.ingredients == null">–</span></h4>

        <ol v-if="specification.ingredients != null">
          <li v-for="ingredient in specification.ingredients"> 
            <span>{{ ingredient.name }}</span>
            <span> – </span>
            <span>{{ ingredient.amount }}</span>
            <span>&nbsp;</span> <!-- пробел -->
            <span>{{ ingredient.units }}</span>
          </li>
        </ol>
        
      </li>

      <li> <!-- по хорошому сделать компонент -->
        <h4>Украшения: <span v-if="specification.decorations == null">–</span></h4>

        <ol v-if="specification.decorations != null">
          <li v-for="decoration in specification.decorations"> 
            <span>{{ decoration.name }}</span>
            <span> – </span>
            <span>{{ decoration.amount }}</span>
            <span>&nbsp;</span> <!-- пробел -->
            <span>{{ decoration.units }}</span>
          </li>
        </ol>
      </li>

      <li>
        <h4>Операции:</h4>
        
        <ol>
          <li v-for="operation in specification.operations">
            <i>{{ operation.name }}</i>
            
            <ul>
              <li>Тип оборудования: {{ operation.type_equipment }}</li>
              <li>Время на операцию: {{ operation.time_for_operation.amount }} {{ operation.time_for_operation.units }}</li>
            </ul>
          </li>
        </ol>
      </li>

    </ul>


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
  width: 50%;
  margin: 0 auto;
}
h4 {
  margin-top: 0.5rem;
}
</style>
