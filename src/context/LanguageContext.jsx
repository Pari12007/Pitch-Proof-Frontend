import { LanguageContext } from "./languageStore";
import spanish from "../i18n/es.json";
import { createTranslator, formatDisplayDate } from "../i18n/translate";
import { useEffect, useState, useMemo } from "react";

const translations = {
    en: {
        language: "Language",
        openMenu: "Open navigation menu",
        ideas: "Ideas",
        categories: "Categories",
        browseCategories: "Browse by category",
        allCategories: "All Categories",
        postIdea: "Post your Idea",
        businesses: "My Businesses",
        login: "Login",
        signup: "Sign Up",
        profile: "Profile",
        home: "Home",
        myIdeas: "My Ideas",
        createBusiness: "Create Business",
        aiValidator: "AI Validator",
    },

    es: {
        language: "Idioma",
        openMenu: "Abrir menú de navegación",
        ideas: "Ideas",
        categories: "Categorías",
        browseCategories: "Explorar por categoría",
        allCategories: "Todas las categorías",
        postIdea: "Publica tu idea",
        businesses: "Mis negocios",
        login: "Iniciar sesión",
        signup: "Registrarse",
        profile: "Perfil",
        home: "Inicio",
        myIdeas: "Mis ideas",
        createBusiness: "Crear negocio",
        aiValidator: "Validador con IA",
    },
};


export function LanguageProvider ({ children }) {
    const [ language, setLanguage ] = useState(() => {
        try {
            return localStorage.getItem("pitchproof-language") === "es" ? "es" : "en";
        } catch (error) {
            return "en";
        }
    });

    useEffect(() => {
        document.documentElement.lang = language;

        try {
            localStorage.setItem("pitchproof-language", language);
        } catch {
            // Switching still works when browser storage is unavailable.
        }
    }, [language]);

    const changeLanguage = (value) => {
        if(value === "en" || value === "es") {
            setLanguage(value);
        }
    };

    const locale = language === "es" ? "es-ES" : "en-GB";
    const t = useMemo(() => createTranslator(language, { ...spanish, ...translations.es }, {
        ...translations.en,
        reviewCount_one: "{{count}} review", reviewCount_other: "{{count}} reviews",
        businessCount_one: "{{count}} business", businessCount_other: "{{count}} businesses",
    }), [language]);
    const formatDate = (value) => formatDisplayDate(value, locale);
    const formatNumber = (value) => new Intl.NumberFormat(locale).format(Number(value));
    const tError = (value) => {
        const translated = t(value);
        const knownSpanish = typeof value === "string" && [...Object.values(spanish), ...Object.values(translations.es)].includes(value);
        return language === "es" && translated === value && value && !knownSpanish
            ? t("Something went wrong. Please try again.") : translated;
    };

    // Native validation bubbles otherwise follow the browser's language.
    const validateField = (event) => {
        const field = event.target;
        if (typeof field.setCustomValidity !== "function") return;
        field.setCustomValidity("");
        const validity = field.validity;
        if (validity.valueMissing) field.setCustomValidity(t("Please complete this field."));
        else if (validity.typeMismatch && field.type === "email") field.setCustomValidity(t("Please enter a valid email address."));
        else if (validity.tooShort) field.setCustomValidity(t("Please use at least {{count}} characters.", { count: field.minLength }));
        else if (validity.tooLong) field.setCustomValidity(t("Please use no more than {{count}} characters.", { count: field.maxLength }));
        else if (validity.rangeUnderflow) field.setCustomValidity(t("Please choose a value of at least {{count}}.", { count: field.min }));
        else if (validity.rangeOverflow) field.setCustomValidity(t("Please choose a value no greater than {{count}}.", { count: field.max }));
        else if (!validity.valid) field.setCustomValidity(t("Please enter a valid value."));
    };
    const clearFieldValidity = (event) => event.target.setCustomValidity?.("");
    useEffect(() => {
        document.querySelectorAll("input, textarea, select").forEach(field => field.setCustomValidity(""));
    }, [language]);

    return (
        <LanguageContext.Provider value={{language, locale, changeLanguage, t, tError, formatDate, formatNumber, validateField, clearFieldValidity }}>
            {children}
        </LanguageContext.Provider>
    );
}
