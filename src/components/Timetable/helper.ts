import type { CalendarConfig } from "@schedule-x/calendar";
import colors from "vuetify/util/colors";

export const selectColorsList = [colors.blue.darken3, colors.blue.base, colors.green.darken2, colors.green.lighten1, colors.orange.darken2, colors.orange.lighten1];
const viewingColorList: string[] = [];
const lessonTitleHashToColor: Record<string, number> = {};

export function getCalendarsList(): CalendarConfig["calendars"] {
    const calendarList: CalendarConfig["calendars"] = {};
    for (const [colorKey, colorValue] of Object.entries(colors)) {
        if (!("lighten3" in colorValue) || !("darken3" in colorValue)) continue;

        const lighten = colorValue.lighten3.replace("#", "").toUpperCase();
        const darken = colorValue.darken3.replace("#", "").toUpperCase();

        viewingColorList.push(colorKey);
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

    return calendarList;
}

export function getColorByLessonTitle(lessonTitle: string): string {
    for (const get of ["TD", "TP", "CM", "CC", "CTP"]) {
        // biome-ignore lint/style/noParameterAssign: skip
        lessonTitle = lessonTitle.replace(/ /g, "").replace(get, "");
    }

    if (lessonTitleHashToColor[lessonTitle] === undefined) {
        lessonTitleHashToColor[lessonTitle] = hashString(lessonTitle) % Object.keys(viewingColorList).length;
    }

    return viewingColorList[lessonTitleHashToColor[lessonTitle]];
}

function hashString(str: string) {
    return Math.abs(str.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0));
}
