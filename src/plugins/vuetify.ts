import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { getLanguage } from "@/utils/locale";
import { createVuetify } from "vuetify";

export default createVuetify({
    locale: {
        locale: getLanguage(false),
    },
    display: {
        thresholds: {
            sm: 650, // Default is 600
        },
    },
    theme: {
        themes: {
            light: {
                colors: {
                    primary: "#1976d2",
                },
            },
            dark: {
                colors: {
                    primary: "#145ea8",
                },
            },
        },
    },
});
