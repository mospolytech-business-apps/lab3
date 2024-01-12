<template>
  <div class="list-ingredients">
    <h4 class="header">
      {{ header }}: <span v-if="ingredients == null">–</span>
    </h4>

    <template v-if="header === 'Операции'">
      <ol v-if="ingredients != null">
        <li v-for="operation in ingredients" :key="operation.id">
          <i v-if="!being_edited">{{ operation.name }}</i>
          <input v-else type="text" v-model="operation.name" />

          <ul>
            <li>
              <span>Тип оборудования: </span>
              <span v-if="!being_edited">{{ operation.type_equipment }}</span>
              <input v-else type="text" v-model="operation.type_equipment" />
            </li>
            <li>
              <span>Время на операцию: </span>
              <template v-if="!being_edited">
                <span>{{ operation.time_for_operation.amount }}</span>
                <span>&nbsp;</span>
                <!-- пробел -->
                <span>{{ operation.time_for_operation.units }}</span>
              </template>
              <template v-else>
                <input
                  type="text"
                  v-model="operation.time_for_operation.amount"
                />
                <input
                  type="text"
                  v-model="operation.time_for_operation.units"
                />
              </template>
            </li>
          </ul>
        </li>
      </ol>
      <UIButton class="add-button" v-if="being_edited" @click="addOperation"
        >Добавить</UIButton
      >
    </template>
    <template v-else>
      <ol v-if="ingredients != null">
        <template v-if="!being_edited">
          <li v-for="ingredient in ingredients" :key="ingredient.id">
            <span>{{ ingredient.name }}</span>
            <span> – </span>
            <span>{{ ingredient.amount }}</span>
            <span>&nbsp;</span>
            <!-- пробел -->
            <span>{{ ingredient.units }}</span>
          </li>
        </template>

        <template v-else @input="onInput">
          <li v-for="ingredient in modifiedIngredients">
            <input type="text" v-model="ingredient.name" @input="onInput" />
            <span> – </span>
            <input type="text" v-model="ingredient.amount" @input="onInput" />
            <span>&nbsp;</span>
            <!-- пробел -->
            <input type="text" v-model="ingredient.units" @input="onInput" />
          </li>
        </template>
      </ol>
      <UIButton class="add-button" v-if="being_edited" @click="addIngredient"
        >Добавить</UIButton
      >
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import UIButton from "@/components/UIButton.vue";
const props = defineProps(["ingredients", "header", "being_edited"]);
const modifiedIngredients = ref(props.ingredients);

const emit = defineEmits();
const onInput = (id) => {
  emit("update:ingredients", modifiedIngredients.value);
};
const addIngredient = () => {
  let id;
  if (modifiedIngredients.value === null) {
    modifiedIngredients.value = [];
    id = 1;
  }
  if (!id)
    id = modifiedIngredients.value[modifiedIngredients.value.length - 1].id + 1;

  modifiedIngredients.value.push({
    id,
    name: "Ингредиент",
    amount: 0,
    units: "г",
  });

  emit("update:ingredients", modifiedIngredients.value);
};

const addOperation = () => {
  let id;
  if (modifiedIngredients.value === null) {
    modifiedIngredients.value = [];
    id = 1;
  }
  if (!id) {
    id = modifiedIngredients.value[modifiedIngredients.value.length - 1].id + 1;
  }

  modifiedIngredients.value.push({
    id,
    name: "Операция",
    type_equipment: "",
    time_for_operation: {
      amount: 0,
      units: "ч",
    },
  });

  emit("update:ingredients", modifiedIngredients.value);
};
</script>

<style scoped>
.header {
  margin-top: 0.5rem;
}
input {
  height: 1.2rem;
}
.add-button {
  margin-top: 0.3rem;
}
</style>
