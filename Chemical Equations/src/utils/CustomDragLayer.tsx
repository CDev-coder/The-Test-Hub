// src/components/DragLayer.tsx
import { useDragLayer } from "react-dnd";
import { Molecule } from "../components/Molecule";
//import { Bond } from "../components/Bond";

export const CustomDragLayer = () => {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  console.log("item ", item);

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        left: currentOffset.x,
        top: currentOffset.y,
        transform: "translate(-50%, -50%)",
        zIndex: 10000,
      }}
    >
      <Molecule {...item} style={{ opacity: 0.8 }} />
    </div>
  );
};
