<script setup>
import { onMounted, ref, watchEffect, computed, toRaw } from "vue";
import { storeToRefs } from "pinia";
import { useProductSpecificationsStore } from "@/stores/productSpecification.store";
import { useOrdersStore } from "@/stores/orders.store";
import { useIngredientsStore } from "@/stores/ingredients.store";
import { useRoute, useRouter } from "vue-router";
import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

const { allProductSpecifications } = storeToRefs(
  useProductSpecificationsStore()
);
const { fetchProductSpecifications } = useProductSpecificationsStore();
const { allOrders } = storeToRefs(useOrdersStore());
const { allIngredients } = storeToRefs(useIngredientsStore());
const { fetchIngredients } = useIngredientsStore();
const { fetchOrders } = useOrdersStore();

const route = useRoute();
const router = useRouter();

const specification = ref([]);
const order = ref(null);
const ingredients = ref([]);

onMounted(() => {
  watchEffect(async () => {
    allOrders.value = await fetchOrders();
    allProductSpecifications.value = await fetchProductSpecifications();
    allIngredients.value = await fetchIngredients();
    ingredients.value = allIngredients.value;

    let orderId = route.params.id;
    order.value = allOrders.value.find((order) => order.id == orderId);

    specification.value = allProductSpecifications.value.find((specification) =>
      order.value?.specs?.includes(specification.id)
    );
  });
});

const relevantIngredients = computed(() => {
  const ingredientNames = [
    ...(specification.value.ingredients || []).map((i) => i.name),
    ...(specification.value.decorations || []).map((d) => d.name),
  ];

  return ingredients.value.filter((i) => ingredientNames.includes(i.name));
});

const minDeliveryTime = computed(() => {
  return relevantIngredients.value
    .map((i) => i.deliveryTime)
    .sort((a, b) => b - a)[0];
});

const totalCost = computed(() => {
  return relevantIngredients.value.reduce((total, i) => {
    return total + (i.price - 10);
  }, -20);
});
</script>

<template>
  <UIHeader />
  <UINav />

  <main class="main">
    <UIButton @click="router.push('/')">Назад</UIButton>
    <p>Оценка затрат для заказа №{{ order?.number ?? "0000000000" }}</p>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Название</th>
            <th>Требуемое кол-во</th>
            <th>Кол-во а складах</th>
            <th>Недостающее кол-во</th>
            <th>Закупочная цена</th>
            <th>Себестоимость</th>
            <th>Минимальное время доставки</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in specification?.ingredients">
            <td>
              {{
                ingredients.find((i) => i?.name === item?.name)?.article ?? "–"
              }}
            </td>
            <td>
              {{ ingredients.find((i) => i?.name === item?.name)?.name ?? "–" }}
            </td>
            <td>
              {{ item?.amount ?? "–" + item?.units ?? "–" }}
              {{ ingredients.find((i) => i?.name === item?.name)?.units ?? "" }}
            </td>
            <td>
              {{
                ingredients.find((i) => i?.name === item?.name)?.amount ?? "–"
              }}&nbsp;{{
                ingredients.find((i) => i?.name === item?.name)?.units ?? "–"
              }}
            </td>
            <td>
              {{
                +item?.amount -
                  +ingredients.find((i) => i?.name === item?.name)?.amount >
                0
                  ? +item?.amount -
                    +ingredients.find((i) => i?.name === item?.name)?.amount
                  : "–" ?? "–"
              }}&nbsp;{{
                ingredients.find((i) => i?.name === item?.name)?.amount > 0
                  ? item?.units
                  : ""
              }}
            </td>
            <td>
              ${{
                ingredients.find((i) => i?.name === item?.name)?.price ?? "–"
              }}
            </td>
            <td>
              ${{ ingredients.find((i) => i?.name === item?.name)?.price - 10 }}
            </td>
            <td>
              {{
                ingredients.find((i) => i?.name === item?.name)?.deliveryTime ??
                "–"
              }}
              дн.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="statistics">
      <p>Минимальное время на доставку: дн. {{ minDeliveryTime }}</p>
      <p>Общая cебестоимость: {{ totalCost }}</p>
    </div>
  </main>
</template>

<style scoped>
.main {
}

.main {
  margin: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}

.filter {
  align-items: center;
  display: flex;
  gap: 1rem;
}

.filter-title {
  margin: 0;
}

.status-filter {
  min-width: 10rem;
}

.align-center {
  text-align: center;
}

thead {
  background-color: lightgray;
  border-bottom: 2px solid black;
}

td,
th {
  border: 1px solid black;
  padding-inline-start: 0.25rem;
}

.selected {
  box-shadow: inset 0 0 0 2px black;
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

.statistics {
  display: flex;
  gap: 2rem;
}
</style>
