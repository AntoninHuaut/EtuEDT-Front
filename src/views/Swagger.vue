<template>
    <div :class="{ 'swagger-ui-dark': theme.global.name.value === 'dark' }" id="swagger-ui"></div>
</template>

<script lang="ts" setup>
import { BASE_API_URL } from "@/api/api_requests";
import SwaggerUI from "@/assets/swagger-ui/swagger-ui-es-bundle.js";
import "@/assets/swagger-ui/swagger-ui.css";
import { onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

onMounted(() => {
    SwaggerUI({
        url: `${BASE_API_URL}/openapi`,
        dom_id: "#swagger-ui",
        syntaxHighlight: {
            activate: true,
            theme: "idea",
        },
    });
});
</script>

<style>
.swagger-ui-dark {
    filter: invert(88%) hue-rotate(180deg);
}

.swagger-ui-dark .microlight {
    filter: invert(100%) hue-rotate(180deg);
}
</style>