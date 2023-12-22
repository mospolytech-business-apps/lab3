import { createRouter, createWebHistory } from "vue-router";
import { useUsersStore } from "@/stores/users.store";
import { storeToRefs } from "pinia";

import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Orders from "@/pages/Orders.vue";
import EquipmentFailure from "@/pages/EquipmentFailure.vue";
import Ingredients from "@/pages/Ingredients.vue";
import WorkroomScheme from "@/pages/WorkroomScheme.vue";
import QualityControl from "@/pages/QualityControl.vue";
import EquipmentFailureReport from "@/pages/EquipmentFailureReport.vue";
import ProductSpecification from "@/pages/ProductSpecification.vue";
import Estimates from "@/pages/Estimates.vue";
import IngredientsReport from "@/pages/IngredientsReport.vue";
import Tools from "@/pages/Tools.vue";
import ToolsPurchaseReport from "@/pages/ToolsPurchaseReport.vue";

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
      path: "/",
      name: "orders",
      component: Orders,
      meta: { title: "Заказы", roles: roles },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { title: "Вход в систему", roles: roles },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { title: "Регистрация заказчика", roles: roles },
    },
    {
      path: "/tools",
      name: "tools",
      component: Tools,
      meta: { title: "Учет инструментов", roles: [roles[4]] },
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: Ingredients,
      meta: {
        title: "Учет ингредиентов и украшений для торта",
        roles: [roles[2], roles[4]],
      },
    },
    {
      path: "/workroom-scheme",
      name: "workroom-scheme",
      component: WorkroomScheme,
      meta: { title: "Планировка цехов", roles: [roles[4]] },
    },
    {
      path: "/quality-control",
      name: "quality-control",
      component: QualityControl,
      meta: { title: "Контроль качества", roles: [roles[3]] },
    },
    {
      path: "/equipment-failure",
      name: "equipment-failure",
      component: EquipmentFailure,
      meta: { title: "Неисправности оборудования", roles: [roles[3]] },
    },
    {
      path: "/product-specification",
      name: "product-specification",
      component: ProductSpecification,
      meta: { title: "Спецификация изделий", roles: [roles[4]] },
    },
    {
      path: "/estimates",
      name: "estimates",
      component: Estimates,
      meta: {
        title: "Оценка времени, затрат ингредиентов и украшений для тортов",
        roles: [roles[2]],
      },
    },
    {
      path: "/ingredients-report",
      name: "ingredients-report",
      component: IngredientsReport,
      meta: {
        title: "Отчет по ингредиентам и украшениям для торта",
        roles: [roles[2], roles[4]],
      },
    },
    {
      path: "/tools-purchase-report",
      name: "tools-purchase-report",
      component: ToolsPurchaseReport,
      meta: { title: "Отчет по закупкам инструмента", roles: [roles[4]] },
    },
    {
      path: "/equipment-failure-report",
      name: "equipment-failure-report",
      component: EquipmentFailureReport,
      meta: { title: "Отчет по сбоям оборудования", roles: [roles[4]] },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { userRole } = storeToRefs(useUsersStore());

  window.document.title =
    to.meta && to.meta.title ? to.meta.title : "Кондитерская";

  if (!["login", "register"].includes(to.name)) {
    if (!userRole.value) {
      // Redirect to login if not authenticated or invalid role
      next("/login");
    } else if (
      (to.meta.roles && !to.meta.roles.includes(userRole.value)) ||
      to.matched.length === 0
    ) {
      // Redirect to unauthorized page if the user does not have the required role
      next("/");
    } else {
      // Allow navigation
      next();
    }
  } else {
    if (userRole.value) {
      // Redirect to dashboard or user profile if already authenticated
      next("/"); // Adjust the route accordingly
    } else {
      // Allow navigation for login and register pages if not authenticated
      next();
    }
  }
});

export default router;
