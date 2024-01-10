<template>
  <div class="select-wrapper">
    <select
      @change="changeOption"
      :class="{
        placeholderUnderline: props.placeholder && props.placeholderUnderline,
        placeholderBlue: props.placeholder && props.placeholderBlue,
        placeholder: true,
      }"
      :value="props.modelValue"
      v-bind="$attrs"
      placeholder="Select an option"
      class="select-inner"
      id="select"
    >
      <option v-if="props.placeholder" disabled selected value="">
        {{ props.placeholder }}
      </option>
      <hr />
      <slot />
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: { type: String },
  placeholderBlue: { type: Boolean },
  placeholderUnderline: { type: Boolean },
  modelValue: { type: String },
});

const emit = defineEmits(["update:modelValue"]);

const changeOption = (event) => {
  emit("update:modelValue", event.currentTarget.value);
};
</script>

<style scoped>
.select-inner {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.2em 0.5em 0.2em 0.5em;
  background-color: #fff
  border: 0.1px solid #757575
  color: #000;
  cursor: pointer;
  padding-inline-end: 30px;
  &:disabled {
    background-color: lightgray;
    opacity: 0.2;
    cursor: not-allowed;
  }
}

.select-wrapper {
  position: relative;
  flex-grow: 1;
  &::after {
    content: "▾";
    position: absolute;
    display: block;
    width: 28px;
    height: 32px;
    padding-top: 0.3rem;
    padding-inline: 0.48rem;
    top: 0;
    right: 0;
    background-size: contain;
    pointer-events: none;
    border-left: 1px solid #757575;
  }
  &:has(.select:disabled)::after {
    opacity: 0.2;
  }
}

.placeholder {
  padding-left: 0.25rem;
}

.placeholderBlue {
  color: blue;
}

.placeholderUnderline {
  text-decoration: underline;
}
</style>
