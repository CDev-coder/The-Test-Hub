import { createContext, useContext, useState, ReactNode } from "react";
import translationsData from "../lang/textData.json";

///////Lets make some d.ts data
type Language = "en" | "es" | "fr";
type TranslationKeys = keyof (typeof translationsData)[Language];
type Translations = {
  [key in Language]: Record<TranslationKeys, string>;
};

const translations = translationsData as Translations;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  getText: (key: TranslationKeys) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const totalLanguages: Language[] = ["en", "es", "fr"]; // Add more as needed
  const [language, setLanguage] = useState<Language>("en");

  const getText = (key: TranslationKeys): string => {
    return translations[language][key];
  };

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const currentIndex = totalLanguages.indexOf(prev);
      const nextIndex = (currentIndex + 1) % totalLanguages.length;
      return totalLanguages[nextIndex];
    });
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, getText, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
