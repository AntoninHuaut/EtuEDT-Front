export function getLanguage(withLocale: boolean) {
    if (withLocale) {
        return window.navigator.languages.find((l) => l.includes("-")) ?? "fr-FR";
    }
    return window.navigator.languages?.[0]?.split("-")?.[0] ?? "fr";
}
