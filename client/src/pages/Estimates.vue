<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { useProductSpecificationsStore } from "@/stores/productSpecification.store.js";
import { useIngredientsStore } from "@/stores/ingredients.store";
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/stores/orders.store";
import { useUsersStore } from "@/stores/users.store";
import Cookies from "js-cookie";

import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import OrderModal from "@/components/OrderModal.vue";

const { fetchOrders, statuses, changeStatus } = useOrdersStore();
const { allOrders } = storeToRefs(useOrdersStore());
const { fetchIngredients, deleteIngredient, updateIngredient } = useIngredientsStore();
const { allIngredients } = storeToRefs(useIngredientsStore());
const ingredients = ref([]);
ingredients.value = allIngredients.value.length ? allIngredients.value : await fetchIngredients();
const { customers, clientManagers, userRole, userID } = storeToRefs(
  useUsersStore()
);

const selectedOrder = ref(null);


const selectedStatus = ref("all");

const orders = ref([]);
orders.value = allOrders.value.length ? allOrders.value : await fetchOrders();
userID.value = Cookies.get("USER_ID");

// onMounted(async () => {
  
// });

const filteredOrders = computed(() => {
  if (selectedStatus.value === null) {
    return allOrders.value;
  } else if (selectedStatus.value === "fresh") {
    return allOrders.value.filter((order) =>
      ["new", "specification", "approving"].includes(order.status)
    );
  } else if (selectedStatus.value === "completed") {
    return allOrders.value.filter((order) =>
      ["ready", "finished"].includes(order.status)
    );
  } else if (selectedStatus.value === "current") {
    return allOrders.value.filter((order) =>
      ["procurement", "production", "checking"].includes(order.status)
    );
  } else if (selectedStatus.value === "rejected") {
    return allOrders.value.filter((order) =>
      ["cancelled"].includes(order.status)
    );
  }

  return allOrders.value;
});

const roleFiltered = computed(() => {
  if (userRole.value === "Customer") {
    return filteredOrders.value.filter((order) => {
      return order.customer == userID.value;
    });
  } else if (userRole.value === "ClientManager") {
    return filteredOrders.value.filter(
      (order) => order.status === "new" || order.manager === userID.value
    );
  } else if (userRole.value === "Director") {
    return filteredOrders.value;
  } else if (userRole.value === "PurchaseManager") {
    return filteredOrders.value.filter(
      (order) => order.status === "procurement"
    );
  } else if (userRole.value === "Master") {
    return filteredOrders.value.filter(
      (order) => order.status === "production" || order.status === "checking"
    );
  }

  return filteredOrders.value;
});


onUnmounted(() => {
  selectedOrder.value = null;
});

const { fetchProductSpecifications, updateProductSpecification } = useProductSpecificationsStore();
const { allProductSpecifications } = storeToRefs(useProductSpecificationsStore());

const productSpecifications = ref([]);
productSpecifications.value = allProductSpecifications.value.length ? allProductSpecifications.value : await fetchProductSpecifications();

function getIdsProductSpecifications(id, productSpecifications) {
    const getIdsRecursively = (id, productSpecifications, ids) => {
        const productSpecification = productSpecifications.find(el => el.id == id);
        ids.push(id);

        if (!productSpecification.semi_finished_products) {
            return;
        } else {
            productSpecification.semi_finished_products.forEach(semi_finished_product => {
                const productSpecification = productSpecifications.find(productSpecification => semi_finished_product.name == productSpecification.product);
                
                getIdsRecursively(productSpecification.id, productSpecifications, ids);
            })
        }
    }

    const ids = [];
    getIdsRecursively(id, productSpecifications, ids);
    return ids;
}

function getIngredients(ids, type, productSpecifications, ingredients) {
    let arr = [];

    ids.forEach(id => {
        const productSpecification = productSpecifications.find(el => el.id == id);

        if (productSpecification[type]) {
          arr.push(...productSpecification[type].map(el => {
            const ingredient = ingredients.find(ingredient => ingredient.article == el.article);

            el.inWarehouses = ingredient;

            return el;
          }));
        }
    })
    
    return arr;
}

const ids = getIdsProductSpecifications(1, productSpecifications.value);
console.log(getIngredients(ids, "ingredients", productSpecifications.value, ingredients.value));
console.log(getIngredients(ids, "decorations", productSpecifications.value, ingredients.value));


console.log(ingredients.value.length);

const lack = (a, b) => {
  const difference = b - a;
  return difference < 0 ? 0 : difference;
}
</script>

<template>
  <UIHeader />
  <UINav />

  <table>
    <thead>
      <tr>
        <th>Артикул</th>
        <th>Наименование</th>
        <th>Требуемое кол-во</th>
        <th>Ед. измерения</th>
        <th>Имеется на складах</th>
        <th>Ед. измерения</th>
        <th>Недостающее кол-во</th>
        <th>Закупочная цена</th>
        <th>Себестоимость</th>
        <th>Минимальное время необходимое для доставки</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="ingredient in getIngredients(ids, 'ingredients', productSpecifications, ingredients)">
        <td>{{ ingredient.article }}</td>
        <td>{{ ingredient.name }}</td>
        <td>{{ ingredient.amount }}</td>
        <td>{{ ingredient.units }}</td>
        <td>{{ ingredient.inWarehouses.amount }}</td>
        <td>{{ ingredient.inWarehouses.units }}</td>
        <td>{{ lack(ingredient.inWarehouses.amount, ingredient.amount) }}</td>
        <td>{{ ingredient.inWarehouses.price }}</td>
        <td>{{ ingredient.inWarehouses.price + 5 }}</td>
        <td>{{ ingredient.inWarehouses.deliveryTime }}</td>
      </tr>
    </tbody>
  </table>
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

.selected {
  box-shadow: inset 0 0 0 2px black;
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

.buttons {
  display: flex;
  gap: 5rem;
}

.popup {
  opacity: 0;
  width: 100%;
  position: absolute;
  min-height: 150px;
  background-color: #fff;
  top: 30px;
  left: 0;
  border: 1px solid black;
  border-top: 0px;
  padding: 1rem;
  z-index: 1;
  margin: 0;
  transition: opacity 0.5s ease; /* Set a shorter transition time */
}

.status-cell {
  position: relative;
  min-width: 200px;
}

.status-cell:hover .popup {
  opacity: 1;
  transition-delay: 0.5s; /* Add this line to delay the transition */
}
.status-cell:hover {
  background-color: rgba(200, 200, 200, 0.5);
}
.status-list {
  color: darkgray;
  list-style: none;
  font-size: 0.9rem;
  padding: 0;
  margin: 0;
}

.passed {
  color: green;
}
.canceled {
  color: red;
}
</style>
