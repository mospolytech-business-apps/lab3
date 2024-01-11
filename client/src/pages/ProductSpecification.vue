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
import ListIngredients from '@/components/ListIngredients.vue'

const { fetchProductSpecifications, updateProductSpecification } = useProductSpecificationsStore();
const { allProductSpecifications } = storeToRefs(useProductSpecificationsStore());

const productSpecifications = ref([]);
onMounted(async () => {
  productSpecifications.value = allProductSpecifications.value.length ? allProductSpecifications.value : await fetchProductSpecifications();
  // watchEffect(async () => {
  //   console.log('watchEffect')
  //   productSpecifications.value = allProductSpecifications.value.length ? allProductSpecifications.value : await fetchProductSpecifications();
  // });
});

const editSpecification = (id) => {
  const specification = productSpecifications.value.find(el => el.id === id);

  specification.being_edited = true;
}

const saveEdited = (id) => {
  const specification = productSpecifications.value.find(el => el.id === id);
  console.log(specification);

  updateProductSpecification(specification);

  specification.being_edited = false;
}

const test = async () => {
  console.log(await fetchProductSpecifications());
}
</script>

<template>
  <UIHeader />
  <UINav />
  <UIButton @click="test">test</UIButton>

  <main class="main">

    <ul v-for="specification in productSpecifications">
      <div class="header">
        <h3>{{ specification.product }}</h3> 
        <UIButton v-if="!specification.being_edited" @click="editSpecification(specification.id)">Редактировать</UIButton>
        <UIButton v-else @click="saveEdited(specification.id)">Сохранить</UIButton>
      </div>
      

      <li>
        <h4>
          <span>Полуфабрикаты: </span>
          <span v-if="specification.semi_finished_products == null">–</span>
        </h4>
        
        <ol v-if="specification.semi_finished_products != null">
          <li v-for="semi_finished_product in specification.semi_finished_products">
            <span v-if="!specification.being_edited">{{ semi_finished_product.name }}</span>
            <input v-else type="text" v-model="semi_finished_product.name">
          </li>
        </ol>
      </li>

      <li>
        <ListIngredients 
          v-model:ingredients="specification.ingredients"
          header="Ингредиенты"
          :being_edited="specification.being_edited"
        />
      </li>

      <li>
        <ListIngredients 
          v-model:ingredients="specification.decorations"
          header="Украшения"
          :being_edited="specification.being_edited"
        />
      </li>

      <li>
        <h4>Операции:</h4>
        
        <ol>
          <li v-for="operation in specification.operations">
            <i v-if="!specification.being_edited">{{ operation.name }}</i>
            <input v-else type="text" v-model="operation.name">
            
            <ul>
              <li>
                <span>Тип оборудования: </span>
                <span v-if="!specification.being_edited">{{ operation.type_equipment }}</span>
                <input v-else type="text" v-model="operation.type_equipment">
              </li>
              <li>
                <span>Время на операцию: </span>

                <template v-if="!specification.being_edited">
                  <span>{{ operation.time_for_operation.amount }}</span>
                  <span>&nbsp;</span> <!-- пробел -->
                  <span>{{ operation.time_for_operation.units }}</span>
                </template>

                <template v-else>
                  <input type="text" v-model="operation.time_for_operation.amount">
                  <input type="text" v-model="operation.time_for_operation.units">
                </template>
                </li>
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
h3 {
  margin-top: 0;
}
h4 {
  margin-top: 0.5rem;
}
input {
  height: 1.2rem;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header h3 {
  margin-right: 1rem;
}
</style>
