import { createRouter, createWebHistory } from "vue-router";
import { useUsersStore } from "@/stores/users.store";
import { storeToRefs } from "pinia";

import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Home from "@/pages/Home.vue";
import Equipment from "@/pages/Equipment.vue";
import Ingredients from "@/pages/Ingredients.vue";
import WorkroomScheme from "@/pages/WorkroomScheme.vue";
import QualityControl from "@/pages/QualityControl.vue";
import EquipmentFailure from "@/pages/EquipmentFailure.vue";
import ProductSpecification from "@/pages/ProductSpecification.vue";
import Estimates from "@/pages/Estimates.vue";
import IngredientsReport from "@/pages/IngredientsReport.vue";
import PurchaseReport from "@/pages/PurchaseReport.vue";
import EquipmentFailureReport from "@/pages/EquipmentFailureReport.vue";

const roles = [
  "Customer",
  "ClientManager",
  "PurchaseManager",
  "Master",
  "Director",
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { roles: roles },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { roles: roles },
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { roles: roles },
    },
    {
      path: "/equipment",
      name: "equipment",
      component: Equipment,
      meta: { roles: [roles[4]] },
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: Ingredients,
      meta: { roles: [roles[2], roles[4]] },
    },
    {
      path: "/workroom-scheme",
      name: "workroom-scheme",
      component: WorkroomScheme,
      meta: { roles: [roles[4]] },
    },
    {
      path: "/quality-control",
      name: "quality-control",
      component: QualityControl,
      meta: { roles: [roles[3]] },
    },
    {
      path: "/equipment-failure",
      name: "equipment-failure",
      component: EquipmentFailure,
      meta: { roles: [roles[3]] },
    },
    {
      path: "/product-specification",
      name: "product-specification",
      component: ProductSpecification,
      meta: { roles: [roles[4]] },
    },
    {
      path: "/estimates",
      name: "estimates",
      component: Estimates,
      meta: { roles: [roles[2]] },
    },
    {
      path: "/ingredients-report",
      name: "ingredients-report",
      component: IngredientsReport,
      meta: { roles: [roles[2], roles[4]] },
    },
    {
      path: "/purchase-report",
      name: "purchase-report",
      component: PurchaseReport,
      meta: { roles: [roles[4]] },
    },
    {
      path: "/equipment-failure-report",
      name: "equipment-failure-report",
      component: EquipmentFailureReport,
      meta: { roles: [roles[4]] },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { userRole } = storeToRefs(useUsersStore());

  if (
    to.meta.roles &&
    to.meta.roles.length > 0 &&
    !["login", "register"].includes(to.name)
  ) {
    if (!userRole.value || !roles.includes(userRole.value)) {
      next("/login");
    } else if (!to.meta.roles.includes(userRole.value)) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
