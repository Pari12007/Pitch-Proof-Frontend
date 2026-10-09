import { createContext, useContext } from "react";

// Shared separately so hot updates to the provider keep the same context.
export const LanguageContext = createContext(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }
  return context;
}
