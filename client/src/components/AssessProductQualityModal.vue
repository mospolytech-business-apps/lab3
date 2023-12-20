<script setup>
import UIHeader from "@/components/UIHeader.vue";
import {computed, onMounted, ref, toRef} from "vue";
import UISelect from "@/components/UISelect.vue";
import UIButton from "@/components/UIButton.vue";

const props = defineProps({
  order: {type: Object, required: true},
  previousAssessment: { type: Array, required: true },
});

const emit = defineEmits(["close"]);

const assessmentList = toRef(props, 'previousAssessment');
const chosenParameter = ref('')

const isAddAssessmentParameterFieldVisible = computed(() => {
  const metricsCount = props.order.metrics.length;
  return metricsCount > 0 && assessmentList.value.length < metricsCount;
})
const close = () => {
  emit("close");
};

const addAssessmentQuality = (e) => {
  e.preventDefault();
  console.log(chosenParameter.value)
}

onMounted(() => {
  if (props.order.metrics.length) {
    chosenParameter.value = props.order.metrics[0].name;
  }
})

</script>

<template>
  <div class="modal">
    <UIHeader title="Оценить заказ" :closeButtonHandler="close" />
    <main class="main">
      <form>
        <label
            v-for="(assessment, idx) in assessmentList"
            :key="idx"
            class="label"
        >{{ assessment.metricName }}
            <UISelect v-model="assessmentList[idx].result">
              <option value="done">+</option>
              <option value="needWorks">-</option>
            </UISelect>
        </label>
        <label v-if="isAddAssessmentParameterFieldVisible" class="label">Добавить параметр качества
          <div class="block">
            <UISelect
                class="select_metric"
                v-model="chosenParameter"
                :modelValue="chosenParameter">
              <option
                  v-for="metric in order.metrics"
                  :key="metric.name"
                  v-if="assessmentList.every(el => el.metricName !== metric.name)"
                  :value="metric.name"
              >{{ metric.name }}</option>
            </UISelect>
            <UIButton @click="addAssessmentQuality" class="select">Добавить</UIButton>
          </div>
        </label>
      </form>
    </main>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  min-width: 400px;
  max-width: 40%;
  z-index: 100;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  box-shadow: 0 0 2rem black;
}

.main {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  background-color: white;
}

.block {
  display: flex;
  gap: 10px;
  width: 100%;
}

.select_metric {
  flex-grow: 1;
}
</style>