<script setup>
import UIHeader from "@/components/UIHeader.vue";
import {computed, ref, watchEffect} from "vue";
import UISelect from "@/components/UISelect.vue";
import UIButton from "@/components/UIButton.vue";

const props = defineProps({
  order: {type: Object, required: true},
  previousAssessment: { type: Array, required: true },
});

const emit = defineEmits(["close", "saveAssessment", "changeOrderStatus"]);

const assessment = ref([...props.previousAssessment]);
const chosenParameter = ref('')

const isAddAssessmentParameterFieldVisible = computed(() => {
  const metricsCount = props.order.metrics.length;
  return metricsCount > 0 && assessment.value.length < metricsCount;
})

const isChangeStatusButtonDisabled = computed(() => !assessment.value.every(el => el.result === 'done') ||
    assessment.value.length === 0)

const close = () => {
  emit("close");
};

const addAssessmentQuality = (e) => {
  e.preventDefault();
  assessment.value.push({
      name: chosenParameter.value,
      result: 'none',
      comment: ''
    })
}

const changeStatus = (e) => {
  e.preventDefault();
  emit("changeOrderStatus")
  saveAssessment(e);
}

const saveAssessment = (e) => {
  e.preventDefault();
  emit("saveAssessment", {
    orderId: props.order.id,
    metrics: assessment.value.filter(el => el.result !== 'none'),
  })
  close()
}

const filteredMetrics = computed(() => {
  return props.order.metrics.filter(metric => {
    return !assessment.value.some(el => el.name === metric.name)
  })
})

watchEffect(() => {
  if (filteredMetrics.value.length) {
    chosenParameter.value = filteredMetrics.value[0].name;
  }
})

</script>

<template>
  <div class="modal_wrapper">
    <div class="modal">
      <UIHeader title="Оценить заказ" :closeButtonHandler="close" />
      <main class="main">
        <form>
          <label
              v-for="(metric, idx) in assessment"
              :key="idx"
              class="label"
          >{{ metric.name }}
              <UISelect v-model="assessment[idx].result">
                <option value="done">+</option>
                <option value="needWorks">-</option>
              </UISelect>
              <div v-if="assessment[idx].result === 'needWorks'">
                <p>Комментарий</p>
                <input
                    v-model="assessment[idx].comment"
                    type="text"
                    class="input" />
              </div>
          </label>
          <label v-if="isAddAssessmentParameterFieldVisible">
            <p class="label_text">Добавить параметр качества</p>
            <div class="block">
              <UISelect
                  class="select_metric"
                  v-model="chosenParameter"
                  :modelValue="chosenParameter">
                <option
                    v-for="{name} in filteredMetrics"
                    :key="name"
                    :value="name"
                >{{ name }}</option>
              </UISelect>
              <UIButton @click="addAssessmentQuality" class="select">Добавить</UIButton>
            </div>
          </label>
          <div class="footer_button_container">
            <UIButton @click="saveAssessment" class="button">Сохранить</UIButton>
            <UIButton :disabled="isChangeStatusButtonDisabled" @click="changeStatus" class="button">Отметить как готовое</UIButton>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped>
.modal_wrapper {
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 50;
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: white;
  min-width: 450px;
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
  padding: 0.5rem 1.5rem 1.5rem;
  background-color: white;
}

.label_text {
  margin-top: 10px;
  display: inline-block;
}

.block {
  display: flex;
  gap: 10px;
  width: 100%;
}

.input {
  width: 100%;
}

.select_metric {
  flex-grow: 1;
}

.footer_button_container {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.button {
  white-space: nowrap;
}
</style>