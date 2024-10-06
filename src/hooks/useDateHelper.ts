import { useDate } from "vuetify";

export const useDateHelper = () => {
    const adapter = useDate();

    const skipWeekend = (date: Date, navigationType: "prev" | "today" | "next"): Date => {
        if (date.getDay() === 6) {
            // Saturday
            return adapter.addDays(date, navigationType === "prev" ? -1 : 2) as Date;
        }
        if (date.getDay() === 0) {
            // Sunday
            return adapter.addDays(date, navigationType === "prev" ? -2 : 1) as Date;
        }
        return date;
    };

    return { skipWeekend };
};
