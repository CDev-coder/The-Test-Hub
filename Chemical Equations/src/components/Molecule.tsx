import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { MoleculeProps, MoleculeItem } from "../types";

export const Molecule = ({
  id,
  formula,
  x,
  y,
  width = 60,
  height = 60,
  parentId,
  spawnPoint,
  onDrop,
  onDetach,
  onReturnToSpawn,
  style,
}: MoleculeProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MOLECULE",
    item: { id, formula, x, y, width, height, parentId, spawnPoint },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        if (parentId) {
          onDetach(item);
        } else if (spawnPoint) {
          onReturnToSpawn(item);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "MOLECULE",
    drop: (item: MoleculeItem, monitor) => onDrop(item, monitor),
  }));

  drag(drop(divRef));

  return (
    <div
      className="moleculeDiv"
      ref={divRef}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        padding: "4px",
        border: parentId ? "1px dashed #666" : "2px solid #333",
        borderRadius: "4px",
        backgroundColor: spawnPoint
          ? "#e3f2fd"
          : isDragging
          ? "rgba(100, 200, 255, 0.7)"
          : "rgba(255, 255, 255, 0.9)",
        cursor: "move",
        opacity: isDragging ? 0.7 : 1,
        zIndex: parentId ? 1 : 2,
        transform: isDragging ? "scale(1.1)" : "scale(1)",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: parentId ? "0.8em" : "1em",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        color: formula + "_Image" == "C_Image" ? "white" : "",
        ...style,
      }}
      data-testid={`molecule-${formula}`}
    >
      <div className={"moleculeImage " + formula + "_Image"} />
      {formula}
    </div>
  );
};
