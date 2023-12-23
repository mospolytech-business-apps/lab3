<script setup>
import { ref, onMounted, watchEffect, computed } from "vue";
import { storeToRefs } from "pinia";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UIButton from "@/components/UIButton.vue";
import UISelect from "@/components/UISelect.vue";
import { useEquipmentFailuresStore } from "@/stores/equipmentFailures.store";
import { useEquipmentsStore } from "@/stores/equipments.store";

const { fetchEquipmentFailures, reasons } = useEquipmentFailuresStore();
const { allEquipments } = storeToRefs(useEquipmentsStore());
const { fetchEquipment } = useEquipmentsStore();

const equipments = ref([]);
const failures = ref([]);
const reportData = ref([]);
const sortDirection = ref(true);
const selectedReason = ref("Все");

const calculateTotalTime = (failures) => {
  const totalDuration = failures.reduce(
    (acc, failure) => {
      const breakDate = new Date(failure.break);
      const fixDate = new Date(failure.fix);

      const durationInMilliseconds = fixDate - breakDate;

      // Convert duration to hours and minutes
      const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );

      return {
        totalHours: acc.totalHours + hours,
        totalMinutes: acc.totalMinutes + minutes,
      };
    },
    { totalHours: 0, totalMinutes: 0 }
  );

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

  const tableClone = document.querySelector("table").cloneNode(true);
  printDocument.body.appendChild(tableClone);

  printWindow.print();
  printWindow.onafterprint = function () {
    printWindow.close();
  };
};

const filteredFailures = computed(() => {
  return failures.value.filter((item) =>
    selectedReason.value === "Все" ? item : item.reason === selectedReason.value
  );
});

const calculateDuration = (breakTime, fixTime) => {
  const breakDate = new Date(breakTime);
  const fixDate = new Date(fixTime);

  const durationInMilliseconds = fixDate - breakDate;

  // Convert duration to days, hours, minutes, seconds
  const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

const formatDateTime = (dateTime) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return new Date(dateTime).toLocaleString("en-US", options);
};

onMounted(() => {
  watchEffect(async () => {
    failures.value = await fetchEquipmentFailures();
    equipments.value = allEquipments.value.length
      ? allEquipments.value
      : await fetchEquipment();
  });
});
</script>

<template>
  <UIHeader />
  <UINav />
  <main class="main">
    <div class="controls">
      <label for="reasonSelect">Выберите причину: </label>
      <UISelect id="reasonSelect" v-model="selectedReason">
        <option value="Все">Все</option>
        <option v-for="reason in reasons" :key="reason" :value="reason">
          {{ reason }}
        </option>
      </UISelect>
    </div>
    <table>
      <thead>
        <tr>
          <th>Название оборудования</th>
          <th>Причина сбоя</th>
          <th>Начало сбоя</th>
          <th>Устранение сбоя</th>
          <th>Длительность устранения</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="failure in filteredFailures">
          <td>
            {{ equipments?.find((e) => e.id == failure.equipment)?.name }}
          </td>
          <td>{{ failure.reason }}</td>
          <td>{{ new Date(failure.break).toLocaleString() }}</td>
          <td>{{ new Date(failure.fix).toLocaleString() }}</td>
          <td>{{ calculateDuration(failure.break, failure.fix) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="summary">
      <p>
        Суммарное время сбоев:
        {{ calculateTotalTime(filteredFailures).totalHours }} часов
        {{ calculateTotalTime(filteredFailures).totalMinutes }} минут
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
  align-items: center;
  gap: 0.25rem;
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
