import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { TouchTransition } from "dnd-multi-backend/dist/esm";

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
    },
    {
      backend: TouchBackend,
      options: {
        enableMouseEvents: true,
        ignoreContextMenu: true,
        enableTouchEvents: true,
        enableKeyboardEvents: true,
        delay: 0,
        touchSlop: 0,
      },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

export const DndProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [MultiBackend, setMultiBackend] = useState<any>(null);

  useEffect(() => {
    //console.log("Starting dynamic import...");
    // Ensure the import only happens once
    const loadBackend = async () => {
      try {
        const module = await import("dnd-multi-backend/dist/esm");
        //console.log("Module loaded:", module);
        //console.log("Module exports:", Object.keys(module)); // Log the keys to inspect the exports

        if (module.MultiBackend) {
          setMultiBackend(() => module.MultiBackend);
        } else {
          console.error("MultiBackend export not found");
        }
      } catch (err) {
        console.error("Error importing MultiBackend:", err);
      }
    };

    loadBackend();
  }, []); // The empty dependency array ensures this runs only once

  useEffect(() => {
    //console.log("MultiBackend state changed:", MultiBackend);
  }, [MultiBackend]); // Logs changes to the MultiBackend state

  if (!MultiBackend) {
    //console.log("Loading MultiBackend...");
    return <div>Loading drag-and-drop...</div>; // Debug loading screen
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {children}
    </DndProvider>
  );
};
