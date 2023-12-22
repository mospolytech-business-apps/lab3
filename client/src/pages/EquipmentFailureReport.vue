<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";

// import { useEquipmentFailureStore } from "@/stores/equipmentFailures.store";

const { allEquipmentFailures } = storeToRefs(useEquipmentFailureStore());

const failures = ref([]);
const reportData = ref([]);
const sortDirection = ref(true);
const selectedReason = ref(null);

const availableReasons = ref(["Износ материалов", "Истечение гарантии"]);

onMounted(async () => {
  try {
    const response = await fetch("/src/data/equipmentFailures.json");
    const data = await response.json();
    reportData.value = data;
    failures.value = processFailures(data);
    availableReasons.value = getAvailableReasons(data);
  } catch (error) {
    console.error("Error loading data", error);
  }
});

const processFailures = (data) => {
  return data.map((item) => {
    const duration = calculateDuration(item);
    return {
      equipmentName: item.equipment.type.name + " " + item.equipment.mark,
      reason: item.reason,
      time: item.date + " " + item.time,
      result_time:
        item.complite && item.result_date && item.result_time
          ? item.result_date + " " + item.result_time
          : null,
      duration: duration !== null ? duration + " минут" : null,
    };
  });
};

const calculateDuration = (currentFailure) => {
  if (
    currentFailure.complite &&
    currentFailure.result_date &&
    currentFailure.result_time &&
    currentFailure.date &&
    currentFailure.time
  ) {
    const startDateTime = new Date(
      `${currentFailure.date}T${currentFailure.time}`
    );
    const endDateTime = new Date(
      `${currentFailure.result_date}T${currentFailure.result_time}`
    );
    const durationInMinutes = (endDateTime - startDateTime) / (1000 * 60);
    return Math.round(durationInMinutes);
  }
  return null;
};

const calculateTotalTime = (failures) => {
  const totalDuration = failures.reduce((sum, failure) => {
    return sum + (failure.duration ? parseInt(failure.duration) : 0);
  }, 0);
  return totalDuration;
};

const printTable = () => {
  const printWindow = window.open("", "_blank");
  const printDocument = printWindow.document;

  // Копируем стили из текущего документа в новое окно
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

  // Копируем содержимое таблицы в новое окно
  const tableClone = document.querySelector("table").cloneNode(true);
  printDocument.body.appendChild(tableClone);

  // Вызываем окно печати для нового документа
  printWindow.print();
  printWindow.onafterprint = function () {
    printWindow.close();
  };
};

const toggleSort = () => {
  sortDirection.value = !sortDirection.value;
  failures.value = sortData(failures.value);
};

const sortData = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    const order = sortDirection.value ? 1 : -1;
    return a.reason.localeCompare(b.reason) * order;
  });
  return sortedData;
};

const getAvailableReasons = (data) => {
  const uniqueReasons = new Set(data.map((item) => item.reason));
  return ["Все", ...Array.from(uniqueReasons)];
};

const filterByReasons = () => {
  failures.value = processFailures(
    selectedReasons.value.includes("Все")
      ? reportData.value
      : reportData.value.filter((item) =>
          selectedReasons.value.includes(item.reason)
        )
  );
};
onMounted(() => {
  document
    .getElementById("reasonSelect")
    .addEventListener("change", filterByReasons);
});
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <div class="controls">
      <label for="reasonSelect">Выберите причину: </label>
      <UISelect id="reasonSelect" v-model="selectedReason">
        <option
          v-for="reason in availableReasons"
          :key="reason"
          :value="reason"
        >
          {{ reason }}
        </option>
      </UISelect>
    </div>
    <table>
      <thead>
        <tr>
          <th>Название оборудования</th>
          <th @click="toggleSort">Причина сбоя</th>
          <th>Время начала сбоя</th>
          <th>Время устранения сбоя</th>
          <th>Длительность устранения</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(failure, index) in failures" :key="index">
          <td>{{ failure.equipmentName }}</td>
          <td>{{ failure.reason }}</td>
          <td>{{ failure.time }}</td>
          <td>{{ failure.result_time || "Не завершено" }}</td>
          <td>{{ failure.duration || "N/A" }}</td>
        </tr>
      </tbody>
    </table>
    <div class="summary">
      <p>
        Суммарное время сбоев: {{ calculateTotalTime(failures) ?? 0 }} минут
      </p>
    </div>
    <UIButton @click="printTable">Печать отчета</UIButton>
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
}
.controls {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
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

.summary {
  margin-top: 1rem;
}

@media print {
  /* Стили для печати, например, убираем ненужные элементы и задаем отступы */
  .controls,
  .summary,
  button {
    display: none;
  }

  table {
    margin-top: 0.5rem;
  }
}
</style>
