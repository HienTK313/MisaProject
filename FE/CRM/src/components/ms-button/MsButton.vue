<template>
    <button :type="type" class="ms-btn" :class="btnClass" :disabled="disabled || loading" @click="onClick">
        <span v-if="loading" class="ms-btn__spinner" aria-hidden="true"></span>

        <span v-if="$slots['icon-left'] || iconLeft" class="ms-btn__icon ms-btn__icon--left">
            <slot name="icon-left">
                <span :class="['icon', iconLeft, iconSizeClass]"></span>
            </slot>
        </span>

        <span v-if="$slots.default" class="ms-btn__text">
            <slot />
        </span>

        <span v-if="$slots['icon-right'] || iconRight" class="ms-btn__icon ms-btn__icon--right">
            <slot name="icon-right">
                <span :class="['icon', iconRight, iconSizeClass]"></span>
            </slot>
        </span>
    </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    variant: {
        type: String,
        default: "primary", // primary | ghost | secondary | danger | link
    },
    size: {
        type: String,
        default: "md", // sm | md | lg
    },
    type: {
        type: String,
        default: "button",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    block: {
        type: Boolean,
        default: false,
    },
    iconLeft: {
        type: String,
        default: "",
    },
    iconRight: {
        type: String,
        default: "",
    },
    iconSize: {
        type: [Number, String],
        default: 16,
    },
});

const emit = defineEmits(["click"]);

const btnClass = computed(() => [
    `ms-btn--${props.variant}`,
    `ms-btn--${props.size}`,
    { "ms-btn--block": props.block, "is-loading": props.loading },
]);

const iconSizeClass = computed(() => `icon-${props.iconSize}`);

function onClick(e) {
    if (props.disabled || props.loading) return;
    emit("click", e);
}
</script>

<style scoped>
/**
 * Base Button Styles
 * - Box sizing locked to prevent border height increase
 * - Line-height and font normalized for visual alignment
 */
.ms-btn {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    /* chống tăng height do text wrap / line-height UA */
    white-space: nowrap;
    line-height: 1;
    font: inherit;

    /* giúp không bị "nhảy" cao khi variant add border */
    border: 1px solid transparent;

    cursor: pointer;
    user-select: none;
    vertical-align: middle;
}

/**
 * Button Size Variants
 * Height values are fixed to ensure consistent dimensions
 */
.ms-btn--sm {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
}

.ms-btn--md {
    height: 32px;
    /** Use fixed height instead of min-height for consistent sizing */
    padding: 0 12px;
    font-size: 13px;
}

.ms-btn--lg {
    height: 36px;
    /** Use fixed height instead of min-height for consistent sizing */
    padding: 0 14px;
    font-size: 14px;
}

.ms-btn--block {
    width: 100%;
}

.ms-btn__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.ms-btn__text {
    display: inline-flex;
    align-items: center;
    line-height: 1;
}

/** Gentle disabled state styling */
.ms-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/** Loading spinner animation */
.ms-btn__spinner {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-top-color: rgba(255, 255, 255, 1);
    animation: spin 0.8s linear infinite;
    margin-right: 6px;
}

/** Loading state - reduces opacity and disables interaction */
.is-loading {
    opacity: 0.9;
    pointer-events: none;
}

/** Rotation animation for loading spinner */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
