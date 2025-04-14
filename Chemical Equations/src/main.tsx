import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./components/translator";
import "./index.css";
import "./App.css";
import App from "./App.tsx";
import { DndProviderWrapper } from "./utils/DndProviderWrapper";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DndProviderWrapper>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </DndProviderWrapper>
  </StrictMode>
);
