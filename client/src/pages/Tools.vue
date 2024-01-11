<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useToolsStore } from "@/stores/tools.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import AddToolModal from "@/components/AddToolModal.vue";
import UIButton from "@/components/UIButton.vue";
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";

const { allTools } = storeToRefs(useToolsStore());
const { fetchTools, deleteTool } = useToolsStore();
const { addAlert } = useNotificationsStore();

const isAddToolModalOpen = ref(false);
const tools = ref([]);

const selectedTool = ref(null);
const handleDelete = async (tool) => {
  if (!tool) {
    addAlert("Выберите инструмент для удаления");
    return;
  }
  try {
    await deleteTool(tool);
    addAlert("Инструмент успешно удален");
  } catch (error) {
    addAlert("Не удалось удалить инструмент");
  }
};

onMounted(() => {
  watchEffect(async () => {
    tools.value = allTools.value?.length ? allTools.value : await fetchTools();
  });
});
</script>

<template>
  <UIHeader title="Инструменты" />
  <UINav />

  <main class="main">
    <div class="table-wrapper" @click.self="selectedTool = null">
      <table class="table">
        <thead style="position: sticky">
          <tr>
            <th>Наименование</th>
            <th>Тип</th>
            <th>Возраст</th>
            <th>Количество</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tool in tools"
            :key="tool.id"
            @click="selectedTool = tool"
            :class="{
              selected: tool === selectedTool,
            }"
          >
            <td>{{ tool.name }}</td>
            <td>{{ tool.type }}</td>
            <td>{{ tool.wearStage }}</td>
            <td>{{ tool.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons">
      <UIButton @click="isAddToolModalOpen = true"
        >Добавить инструмент</UIButton
      >
      <UIButton @click="handleDelete(selectedTool)" class="button" type="button"
        >Удалить инструмент</UIButton
      >
    </div>
  </main>
  <AddToolModal
    :open="isAddToolModalOpen"
    @close="isAddToolModalOpen = false"
  />
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

.buttons {
  display: flex;
  gap: 5rem;
}
</style>
