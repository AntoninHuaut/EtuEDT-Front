<template>
  <v-tooltip :text="tooltip">
    <template v-slot:activator="{ props: tooltipProps }">
      <v-btn v-bind="{ ...$attrs,...tooltipProps }" :active="false" @click="onClick" :size="btnSize" elevation="0" :text="props.text" />
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const props = defineProps({
    text: String,
    onClick: Function,
    tooltip: {
        type: String,
        required: true,
    },
});

const btnSize = computed(() => {
    if (props.text) {
        // If button contains text
        return mobile.value ? undefined : "large"; // undefined is default value for v-btn
    }
    return mobile.value ? "small" : "48";
});
</script>
