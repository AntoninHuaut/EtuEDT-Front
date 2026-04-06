import type { CalendarConfig } from "@schedule-x/calendar";
import colors from "vuetify/util/colors";

const calendarPalette = createCalendarPalette();
const viewingColorList = calendarPalette.colorKeys;
const lessonTitleHashToColor: Record<string, number> = {};

export function getCalendarsList(): CalendarConfig["calendars"] {
	return calendarPalette.calendars;
}

function createCalendarPalette() {
	const calendarList: CalendarConfig["calendars"] = {};
	const colorKeys: string[] = [];

	for (const [colorKey, colorValue] of Object.entries(colors)) {
		if (!("lighten3" in colorValue) || !("darken3" in colorValue)) continue;

		const lighten = colorValue.lighten3.replace("#", "").toUpperCase();
		const darken = colorValue.darken3.replace("#", "").toUpperCase();

		colorKeys.push(colorKey);
		calendarList[colorKey] = {
			colorName: colorKey,
			lightColors: {
				main: `#${lighten}`,
				container: `#${lighten}B3`, // B3 = 70% opacity
				onContainer: "#002859",
			},
			darkColors: {
				main: `#${darken}`,
				container: `#${darken}B3`, // B3 = 70% opacity
				onContainer: "#FFFFFF",
			},
		};
	}

	return {
		calendars: calendarList,
		colorKeys,
	};
}

export function getColorByLessonTitle(lessonTitle: string): string {
	if (viewingColorList.length === 0) {
		return "blue";
	}

	for (const get of ["TD", "TP", "CM", "CC", "CTP"]) {
		lessonTitle = lessonTitle.replace(/ /g, "").replace(get, "");
	}

	if (lessonTitleHashToColor[lessonTitle] === undefined) {
		lessonTitleHashToColor[lessonTitle] =
			hashString(lessonTitle) % viewingColorList.length;
	}

	return viewingColorList[lessonTitleHashToColor[lessonTitle]];
}

function hashString(str: string) {
	return Math.abs(
		str.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0),
	);
}
