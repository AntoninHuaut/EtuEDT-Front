import type { CalendarEvent } from "@schedule-x/calendar";
import type { Ref } from "vue";
export interface ICalendarEvents {
    id: number;
    title: string;
    description: string;
    start: Date;
    end: Date;
    allDay: boolean;
    color: string;
}

export enum ETheme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system",
}

export type TViewMode = "day" | "week" | "month-grid";

export interface IUseTimetable {
    calDate: Ref<Date>;
    events: Ref<CalendarEvent[]>;
    viewMode: Ref<TViewMode>;
    weekdays: Ref<number[]>;
}
