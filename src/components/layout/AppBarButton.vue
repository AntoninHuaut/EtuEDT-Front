<template>
  <v-tooltip :text="tooltip">
    <template v-slot:activator="{ props: tooltipProps }">
      <v-btn v-bind="{ ...buttonAttrs, ...tooltipProps }" :active="false" @click="onClick" :size="btnSize" elevation="0" :text="props.text" />
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue";
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

const attrs = useAttrs();

const isExternal = computed(() => {
  const url = (attrs as any).to ?? (attrs as any).href;
  return typeof url === "string" && /^(https?:)?\/\//.test(url);
});

const buttonAttrs = computed(() => {
  const base: Record<string, any> = { ...(attrs as Record<string, any>) };
  if (isExternal.value) {
    base.href = base.to ?? base.href;
    base.target = "_blank";
    base.rel = "noopener noreferrer";
    delete base.to;
  }
  return base;
});

const btnSize = computed(() => {
    if (props.text) {
        return mobile.value ? undefined : "large"; 
    }
    return mobile.value ? "small" : "48";
});
</script>
