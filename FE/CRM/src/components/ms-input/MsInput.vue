<template>
  <div class="ms-input-field" :class="fieldClass">
    <label v-if="label" class="ms-input-label">
      {{ label }}
      <span v-if="required" class="ms-input-required">*</span>
    </label>

    <div class="ms-input-control">
      <span v-if="prefixIcon || $slots.prefix" class="ms-input-icon ms-input-icon--prefix">
        <slot name="prefix">
          <span :class="['icon', prefixIcon, iconSizeClass]"></span>
        </slot>
      </span>

      <input class="ms-input" :class="inputClass" :type="type" :value="modelValue" :placeholder="placeholder"
        :disabled="disabled" :readonly="readonly" @input="onInput" @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)" @keydown.enter="$emit('enter', $event)" />

      <button v-if="clearable && !!modelValue && !disabled && !readonly" type="button" class="ms-input-clear"
        aria-label="Clear" @click="onClear">
        <span class="icon icon-close icon-16"></span>
      </button>

      <span v-if="suffixIcon || $slots.suffix" class="ms-input-icon ms-input-icon--suffix">
        <slot name="suffix">
          <span :class="['icon', suffixIcon, iconSizeClass]"></span>
        </slot>
      </span>
    </div>

    <div v-if="error || hint" class="ms-input-hint" :class="{ 'is-error': !!error }">
      {{ error || hint }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  prefixIcon: {
    type: String,
    default: '',
  },
  suffixIcon: {
    type: String,
    default: '',
  },
  iconSize: {
    type: [Number, String],
    default: 16,
  },
  size: {
    type: String,
    default: 'md', // sm | md | lg
  },
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'enter', 'clear']);

const iconSizeClass = computed(() => `icon-${props.iconSize}`);

const fieldClass = computed(() => ({
  'is-disabled': props.disabled,
  'has-error': !!props.error,
}));

const inputClass = computed(() => [`ms-input--${props.size}`]);

function onInput(e) {
  emit('update:modelValue', e.target.value);
}

function onClear() {
  emit('update:modelValue', '');
  emit('clear');
}
</script>

<style scoped>
.ms-input-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-input-label {
  font-size: 13px;
  color: #374151;
}

.ms-input-required {
  color: #ef4444;
  margin-left: 2px;
}

.ms-input-control {
  position: relative;
  display: flex;
  align-items: center;
}

.ms-input {
  width: 100%;
  padding: 0 8px;
}

/* sizes align with global ms-input height */
.ms-input--sm {
  height: 28px;
  font-size: 12px;
}

.ms-input--md {
  height: 32px;
  font-size: 13px;
}

.ms-input--lg {
  height: 36px;
  font-size: 14px;
}

.ms-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.ms-input-icon--prefix {
  left: 8px;
}

.ms-input-icon--suffix {
  right: 8px;
}

.ms-input-icon--prefix~.ms-input {
  padding-left: 30px;
}

.ms-input-icon--suffix~.ms-input {
  padding-right: 30px;
}

.ms-input-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.ms-input-clear:hover {
  background: #f3f4f6;
}

.ms-input-hint {
  font-size: 12px;
  color: #6b7280;
}

.ms-input-hint.is-error {
  color: #ef4444;
}

.is-disabled .ms-input {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.has-error .ms-input {
  border-color: #ef4444;
}
</style>
