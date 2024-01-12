<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useProductSpecificationsStore } from "@/stores/productSpecification.store.js";
import { useOrdersStore } from "@/stores/orders.store.js";
import UIHeader from "@/components/UIHeader.vue";
import UIButton from "@/components/UIButton.vue";
import ListIngredients from "@/components/ListIngredients.vue";
import { BASE_URL } from "@/config";
import Gant from "./Gant.vue";

const {
  fetchProductSpecifications,
  updateProductSpecification,
  addSpecification,
} = useProductSpecificationsStore();
const { allProductSpecifications } = storeToRefs(
  useProductSpecificationsStore()
);
const { updateOrder, fetchOrders } = useOrdersStore();

const props = defineProps({
  open: { type: Boolean, required: true },
  order: { type: Object, required: true },
});

const emit = defineEmits(["close"]);

const printSpec = () => {
  const printWindow = window.open("", "_blank");
  const printDocument = printWindow.document;

  // Include all stylesheets
  const stylesheets = document.styleSheets;
  for (let i = 0; i < stylesheets.length; i++) {
    const stylesheet = stylesheets[i].href ? stylesheets[i].href : null;
    if (stylesheet) {
      const link = printDocument.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheet;
      printDocument.head.appendChild(link);
    }
  }

  // Include print-specific styles
  const styleElements = document.querySelectorAll(
    'style, link[rel="stylesheet"]'
  );
  styleElements.forEach((styleElement) => {
    if (styleElement.media === "print") {
      const clonedStyleElement = styleElement.cloneNode(true);
      printDocument.head.appendChild(clonedStyleElement);
    }
  });

  // Clone and append the content
  const tableClone = document.querySelector("#spec").cloneNode(true);
  printDocument.body.appendChild(tableClone);

  // Hide all buttons in the print window
  const buttonsInPrintWindow = printDocument.querySelectorAll("button");
  buttonsInPrintWindow.forEach((button) => {
    button.style.display = "none";
  });

  // Print and close the window
  printWindow.print();
  printWindow.onafterprint = function () {
    printWindow.close();
  };
};

const allSpecs = ref([]);
const productSpecifications = ref([]);
onMounted(async () => {
  allSpecs.value = allProductSpecifications.value.length
    ? allProductSpecifications.value
    : await fetchProductSpecifications();
});

watchEffect(async () => {
  productSpecifications.value = allSpecs.value.filter((el) =>
    props?.order?.specs?.includes(el.id)
  );
});

const editSpecification = (id) => {
  const specification = productSpecifications.value.find((el) => el.id === id);

  specification.being_edited = true;
};

const saveEdited = (id) => {
  const specification = productSpecifications.value.find((el) => el.id === id);

  updateProductSpecification(specification);

  specification.being_edited = false;
};

const addSpec = async () => {
  const newSpec = {
    product: "",
    semi_finished_products: [
      {
        id: 1,
        name: "Полуфабрикат 1",
      },
    ],
    ingredients: [
      {
        id: 1,
        name: "Ингредиент 1",
        amount: 0,
        units: "шт.",
      },
    ],
    decorations: [
      {
        id: 1,
        name: "Украшение 1",
        amount: 0,
        units: "шт.",
      },
    ],
    operations: [
      {
        id: 1,
        name: "",
        type_equipment: "без оборудования",
        time_for_operation: {
          amount: 0,
          units: "часов",
        },
      },
    ],
    description: "test",
    being_edited: true,
  };

  const spec = await addSpecification(newSpec);

  const specs = props.order.specs || [];

  await updateOrder({
    ...props.order,
    specs: [...specs, spec.id],
  });

  await fetchOrders();

  await fetchProductSpecifications();
};

const close = () => {
  allSpecs.value.map((s) => (s.being_edited = false));
  emit("close");
};
</script>

<template>
  <div v-if="props.open" class="modal">
    <UIHeader title="Спецификации" :closeButtonHandler="close" />
    <main class="main">
      <UIButton class="button print-btn" @click="printSpec">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3022/3022251.png"
          width="20"
          height="20"
          alt="print icon"
        />
      </UIButton>
      <div class="parameters">
        <p>Параметры изделия</p>
        <ul>
          <li v-for="metric in props?.order?.metrics">
            {{ metric.name }}: {{ metric.value + metric.unit }}
          </li>
        </ul>
        <p>Изображения</p>
        <div class="gallery">
          <img
            class="img"
            width="100"
            height="100"
            v-for="src in props?.order?.images"
            :src="`${BASE_URL}${src}`"
            :alt="props?.order?.name"
          />
        </div>
      </div>
      <ul v-for="specification in productSpecifications">
        <div class="header">
          <h3>{{ specification?.product }}</h3>
          <UIButton
            class="button"
            v-if="!specification?.being_edited"
            @click="editSpecification(specification.id)"
            >Редактировать</UIButton
          >
          <UIButton class="button" v-else @click="saveEdited(specification.id)"
            >Сохранить</UIButton
          >
        </div>

        <li>
          <ListIngredients
            v-model:ingredients="specification.semi_finished_products"
            header="Полуфабрикаты"
            :being_edited="specification?.being_edited"
          />
        </li>

        <li>
          <ListIngredients
            v-model:ingredients="specification.ingredients"
            header="Ингредиенты"
            :being_edited="specification?.being_edited"
          />
        </li>

        <li>
          <ListIngredients
            v-model:ingredients="specification.decorations"
            header="Украшения"
            :being_edited="specification?.being_edited"
          />
        </li>

        <li>
          <ListIngredients
            v-model:ingredients="specification.operations"
            header="Операции"
            :being_edited="specification?.being_edited"
          />
        </li>

        <li>
          <Gant 
            :data="specification.operations"
          />
        </li>

        <li>
          <h4>Словесное описание</h4>
          <template v-if="!specification?.being_edited">
            <span>{{ specification?.description }}</span>
          </template>

          <template v-else>
            <textarea
              style="width: 100%"
              rows="5"
              v-model="specification.description"
            />
          </template>
        </li>
      </ul>
      <UIButton class="button" @click="addSpec">Добавить</UIButton>
    </main>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  z-index: 2;
  height: 80vh;
  display: flex;
  flex-direction: column;
  min-width: 60%;
  transform: translate(-50%, -10%);
  border: 1px solid black;
  box-shadow: 0 0 2rem black;
  justify-content: center;
}

.print-btn {
  position: absolute;
  top: 30px;
  right: 0;
}

.main {
  gap: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  flex-grow: 1;
  padding: 1.5rem 4rem;
  background-color: white;
  margin-bottom: 0.5rem;
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

.parameters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gallery {
  overflow-x: scroll;
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  height: 100px;
}
.img {
  display: block;
  min-width: 100px;
  height: 100%;
}
</style>
