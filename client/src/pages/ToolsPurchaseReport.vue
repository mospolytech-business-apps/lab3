<script setup>
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import { ref, onMounted } from "vue";

const toolsReport = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3002/tools");
    const data = await response.json();
    generateToolsReport(data);
  } catch (error) {
    console.error("Error loading data", error);
  }
});

const generateToolsReport = (toolsData) => {
  const toolsMap = new Map();
  for (const tool of toolsData) {
    const name = tool.name;
    const supplier = tool.supplier;
    const amount = tool.amount;
    if (toolsMap.has(name)) {
      toolsMap.get(name).amount += amount;
    } else {
      toolsMap.set(name, { name, supplier, amount });
    }
  }

  const sortedToolsReport = Array.from(toolsMap.values()).sort(
    (a, b) => b.amount - a.amount
  );

  toolsReport.value = sortedToolsReport;
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
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <UIButton @click="printTable">Печать отчета</UIButton>
    <table>
      <thead>
        <tr>
          <th>Название оборудования</th>
          <th>Поставщик</th>
          <th>Количество инструментов</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(report, index) in toolsReport" :key="index">
          <td>{{ report.name }}</td>
          <td>{{ report.supplier }}</td>
          <td>{{ report.amount }}</td>
        </tr>
      </tbody>
    </table>
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
</style>
