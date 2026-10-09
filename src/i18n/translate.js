export function createTranslator(language, spanish, english = {}) {
  const normalize = (value) => value.replace(/\s+/g, " ").trim();
  const lookup = new Map(Object.entries(spanish).map(([key, value]) => [normalize(key), value]));
  const reverse = new Map(Object.entries(spanish).map(([key, value]) => [normalize(value), key]));
  const pluralRules = new Intl.PluralRules(language === "es" ? "es-ES" : "en-GB");
  return function t(value, params = {}) {
    if (typeof value !== "string") return value ?? "";
    let key = value;
    if (!lookup.has(normalize(key)) && reverse.has(normalize(key))) key = reverse.get(normalize(key));
    if (typeof params.count === "number") {
      const pluralKey = key + "_" + pluralRules.select(params.count);
      if (Object.hasOwn(spanish, pluralKey) || Object.hasOwn(english, pluralKey)) key = pluralKey;
    }
    const fieldError = key.match(/^Please complete the (title|idea|problem|solution|category) field\.$/);
    if (fieldError && language === "es") return "Completa el campo " + spanish[fieldError[1]] + ".";
    const result = language === "es" ? (lookup.get(normalize(key)) ?? english[key] ?? key) : (english[key] ?? key);
    return result.replace(/\{\{(\w+)\}\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name]) : match);
  };
}

// Date-only deadlines must not shift to another day in a different timezone.
export function formatDisplayDate(value, locale) {
  if (!value) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(dateOnly ? value + "T12:00:00Z" : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric", month: "short", year: "numeric",
    ...(dateOnly ? { timeZone: "UTC" } : {}),
  }).format(date);
}
