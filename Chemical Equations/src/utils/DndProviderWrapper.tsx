import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  MultiBackend,
  createTransition,
  TouchTransition,
} from "dnd-multi-backend";

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: createTransition("pointerdown", () => {
        return !("ontouchstart" in window || navigator.maxTouchPoints > 0);
      }),
    },
    {
      backend: TouchBackend,
      options: {
        enableMouseEvents: true,
        enablePreview: true,
        ignoreContextMenu: true,
        delay: 200,
        delayTouchStart: 200,
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
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      {children}
    </DndProvider>
  );
};
