const DEFAULT_LOCALE = "en-GB";

export function getLocale(defaultLocale = DEFAULT_LOCALE): string {
	const languages = window.navigator.languages ?? [];
	const candidate =
		languages.find((locale) => locale.includes("-")) ?? defaultLocale;

	try {
		return Intl.getCanonicalLocales(candidate)[0] ?? defaultLocale;
	} catch {
		return defaultLocale;
	}
}

export function getLanguage(): string {
	const language = getLocale().split("-")[0]?.toLowerCase();
	return ["fr", "en"].includes(language)
		? language
		: DEFAULT_LOCALE.split("-")[0].toLowerCase();
}
