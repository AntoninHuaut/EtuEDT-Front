import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { en, fr } from "vuetify/locale";
import { getLanguage } from "@/utils/locale";

const locale = getLanguage();

export default createVuetify({
	blueprint: md3,
	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi,
		},
	},
	locale: {
		locale: locale,
		fallback: "en",
		messages: { fr, en },
	},
	theme: {
		defaultTheme: "system",
		themes: {
			light: {
				dark: false,
				colors: {
					primary: "#1976d2",
				},
			},
			dark: {
				dark: true,
				colors: {
					primary: "#145ea8",
				},
			},
		},
	},
});
