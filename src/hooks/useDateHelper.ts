export const useDateHelper = () => {
	const skipWeekend = (
		date: Temporal.PlainDate,
		navigationType: "prev" | "today" | "next",
	): Temporal.PlainDate => {
		if (date.dayOfWeek === 6) {
			// Saturday
			return navigationType === "prev"
				? date.subtract({ days: 1 })
				: date.add({ days: 2 });
		}
		if (date.dayOfWeek === 7) {
			// Sunday
			return navigationType === "prev"
				? date.subtract({ days: 2 })
				: date.add({ days: 1 });
		}
		return date;
	};

	const getCurrentWeekday = () =>
		skipWeekend(Temporal.Now.zonedDateTimeISO().toPlainDate(), "next");

	return { skipWeekend, getCurrentWeekday };
};
