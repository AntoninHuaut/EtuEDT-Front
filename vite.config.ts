import { URL, fileURLToPath } from "node:url";

// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
// https://vitejs.dev/config/
export default {
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        vuetify({
            autoImport: true,
            styles: {
                configFile: "src/styles/App.scss",
            },
        }),
    ],
    css: {
        preprocessorOptions: {
            sass: {
                api: "modern",
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
        port: 3000,
    },
    optimizeDeps: {
        include: ["@/assets/swagger-ui/swagger-ui-es-bundle.js"],
    },
    build: {
        commonjsOptions: {
            include: [/assets\/swagger-ui\/swagger-ui-es-bundle.js$/],
        },
    },
};
