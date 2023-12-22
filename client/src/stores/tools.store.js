import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/api";
import { useNotificationsStore } from "@/stores/notifications.store";

export const useToolsStore = defineStore("tools", () => {
  const { addError } = useNotificationsStore();

  const allTools = ref([]);

  const fetchTools = async () => {
    const { res, err } = await api.fetchTools();

    if (err !== null) {
      addError(err.message);
      return;
    }

    allTools.value = res;

    return res;
  };

  const addTool = async (tool) => {
    const { res, err } = await api.addTool(tool);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allTools.value.push(res);

    return res;
  };

  const deleteTool = async (tool) => {
    console.log(tool);
    const { res, err } = await api.deleteTool(tool);

    if (err !== null) {
      addError(err.message);
      return;
    }

    allTools.value = allTools.value.filter((t) => t.id !== tool.id);

    return res;
  };

  return {
    allTools,
    fetchTools,
    addTool,
    deleteTool,
  };
});
