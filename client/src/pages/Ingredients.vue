<script setup>
import { ref, onUnmounted, onMounted, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useIngredientsStore } from "@/stores/ingredients.store";
import { useUsersStore } from "@/stores/users.store";
import EditIngredientModal from "@/components/EditIngredientModal.vue";
import ComfirmModal from "@/components/ComfirmModal.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";

const { userRole } = storeToRefs(useUsersStore());
const { fetchIngredients, deleteIngredient, updateIngredient } =
  useIngredientsStore();
const { allIngredients } = storeToRefs(useIngredientsStore());

const all = ref([]);
onMounted(async () => {
  watchEffect(async () => {
    all.value = allIngredients.value.length
      ? allIngredients.value
      : await fetchIngredients();
  });
});

const filterStartDate = ref(null);
const filterEndDate = ref(null);

const filteredArray = computed(() => {
  let result = {
    filteredIngredients: [],
    filteredDecorations: [],
    positions: null,
    cost: null,
  };
  if (filterStartDate.value == null && filterEndDate.value == null) {
    result.filteredIngredients = all.value.filter(
      (all) => all.isDecoration == false
    );
    result.filteredDecorations = all.value.filter(
      (all) => all.isDecoration == true
    );
  } else {
    let startDate = filterStartDate.value
      ? new Date(filterStartDate.value)
      : null;
    let endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;

    console.log(startDate, endDate, filterEndDate);

    result.filteredIngredients = all.value.filter((item) => {
      let expirationDate = item.expirationDate
        ? new Date(item.expirationDate)
        : null;
      return (
        (!startDate || expirationDate >= startDate) &&
        (!endDate || expirationDate <= endDate) &&
        item.isDecoration === false
      );
    });

    result.filteredDecorations = all.value.filter((item) => {
      let expirationDate = item.expirationDate
        ? new Date(item.expirationDate)
        : null;
      return (
        (!startDate || expirationDate >= startDate) &&
        (!endDate || expirationDate <= endDate) &&
        item.isDecoration === true
      );
    });
  }
  result.positions =
    result.filteredDecorations.length + result.filteredIngredients.length;
  result.filteredDecorations.forEach((e) => {
    result.cost += e.price;
  });
  result.filteredIngredients.forEach((e) => {
    result.cost += e.price;
  });
  return result;
});

const selectedObject = ref(null);
const editableObject = ref(null);

const selectObject = (obj) => {
  selectedObject.value = obj;
};

const handleDeleteObject = (obj) => {
  console.log(obj);
  openDeleteObjectModal();
};

const isEditObjectModalOpen = ref(null);
const isDeleteObjectModalOpen = ref(null);

const handleEditObject = (obj) => {
  editableObject.value = obj;
  if (editableObject.value === null) {
    addError("Error: Select object first!");
    return;
  }
  openEditObjectModal();
};

const deleteObject = (obj) => {
  deleteIngredient(obj);
};

const openEditObjectModal = () => {
  editableObject.value = selectedObject.value;
  isEditObjectModalOpen.value = true;
};

const closeEditObjectModal = () => {
  isEditObjectModalOpen.value = false;
  editableObject.value = null;
};

const openDeleteObjectModal = () => {
  console.log(selectedObject);
  isDeleteObjectModalOpen.value = true;
};

const closeDeleteObjectModal = () => {
  isDeleteObjectModalOpen.value = false;
};

const updateObject = (obj) => {
  console.log("Редактирование ", obj);
  updateIngredient(obj);
};
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <div>
      <div class="filter">
        <div class="dateFilter">
          <p class="section-heading">Срок годности:</p>
          <span>C</span>
          <input type="date" v-model="filterStartDate" />
          <span>по</span>
          <input type="date" v-model="filterEndDate" />
        </div>
        <div
          v-show="userRole !== 'Master' && userRole !== 'ClientManager'"
          class="buttons"
        ></div>
        <UIButton
          @click="handleEditObject(selectedObject)"
          :disabled="!selectedObject"
          >Редактировать</UIButton
        >
        <UIButton
          @click="handleDeleteObject(selectedObject)"
          :disabled="!selectedObject || selectedObject.amount !== 0"
          >Удалить объект</UIButton
        >
      </div>
      <p v-if="filterStartDate != null && filterEndDate != null">
        Количество выведенных позиций: {{ filteredArray.positions }}
      </p>
      <p v-if="filterStartDate != null && filterEndDate != null">
        Общая закупочная стоимость {{ filteredArray.cost }}
      </p>
    </div>
    <h2 class="section-heading">
      Ингредиенты
      <span v-if="filterStartDate != null && filterEndDate != null">{{
        filteredArray.filteredIngredients.length
      }}</span>
    </h2>
    <div class="table-wrapper">
      <table class="table">
        <thead class="thead">
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
            @click="selectObject(ingredient)"
            :class="{
              selected: ingredient === selectedObject,
            }"
          >
            <td>{{ ingredient?.article ?? "–" }}</td>
            <td>{{ ingredient?.name ?? "–" }}</td>
            <td>{{ ingredient?.amount ?? "–" }}</td>
            <td>{{ ingredient?.units ?? "–" }}</td>
            <td>${{ ingredient?.price ?? "–" }}</td>
            <td>{{ ingredient?.supplier ?? "–" }}</td>
            <td>{{ ingredient?.deliveryTime ?? "–" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 class="section-heading">
      Украшения
      <span v-if="filterStartDate != null && filterEndDate != null">{{
        filteredArray.filteredDecorations.length
      }}</span>
    </h2>
    <div class="table-wrapper">
      <table class="table">
        <thead class="thead">
          <tr>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Количество</th>
            <th>Ед. измерения</th>
            <th>Закупочная цена</th>
            <th>Осн. поставщик</th>
            <th>Срок годности</th>
            <th>Срок доставки</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="decoration in filteredArray.filteredDecorations"
            :key="decoration.id"
            @click="selectObject(decoration)"
            :class="{
              selected: decoration === selectedObject,
            }"
          >
            <td>{{ decoration?.article ?? "–" }}</td>
            <td>{{ decoration?.name ?? "–" }}</td>
            <td>{{ decoration?.amount ?? "–" }}</td>
            <td>{{ decoration?.units ?? "–" }}</td>
            <td>${{ decoration?.price ?? "–" }}</td>
            <td>{{ decoration?.supplier ?? "–" }}</td>
            <td>{{ decoration?.deliveryTime ?? "–" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
  <EditIngredientModal
    :open="isEditObjectModalOpen"
    :object="editableObject"
    @close="closeEditObjectModal"
    @updateData="updateObject"
  />
  <ComfirmModal
    :open="isDeleteObjectModalOpen"
    @close="closeDeleteObjectModal"
    @deleteData="deleteObject"
    :object="selectedObject"
  />
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
  padding-bottom: 4rem;
}
td,
th {
  border: 1px solid black;
  padding-inline-start: 0.25rem;
}
.table-wrapper {
  flex-grow: 1;
  width: 100%;
  height: 300px;
  border: 2px solid black;
  overflow: scroll;
}
.table {
  width: 100%;
  border-collapse: collapse;
  overflow: scroll;
}
.thead {
  position: sticky;
  top: 0px;
  background-color: white;
}

.selected {
  box-shadow: inset 0 0 0 2px black;
}

.filter {
  display: flex;
  gap: 3rem;
}
.dateFilter {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
