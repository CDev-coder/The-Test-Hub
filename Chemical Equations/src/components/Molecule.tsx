import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";
import { MoleculeProps, MoleculeItem } from "../types";

export const Molecule = ({
  id,
  formula,
  width = 55,
  height = 55,
  parentId,
  spawnPoint,
  onDrop,
  onDetach,
  onReturnToSpawn,
  style,
}: MoleculeProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const scaleSize = hovered ? width + 5 : width;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MOLECULE",
    item: { id, formula, width, height, parentId, spawnPoint },
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
    <>
      <div
        className="moleculeDiv"
        id={"moleculeDiv_" + formula}
        ref={divRef}
        style={{
          width: `${scaleSize}px`,
          height: `${scaleSize}px`,
          border: parentId ? "1px dashed #666" : "2px solid #333",
          backgroundColor: spawnPoint
            ? "#e3f2fd"
            : isDragging
            ? "rgba(100, 200, 255, 0.7)"
            : "rgba(255, 255, 255, 0.9)",
          opacity: isDragging ? 0.7 : 1,
          zIndex: parentId ? 1 : 2,
          transform: isDragging ? "scale(1.1)" : "scale(1)",
          transition: "all 0.2s ease",
          fontSize: parentId ? "0.8em" : "1em",
          color: formula + "_Image" == "C_Image" ? "white" : "",
          ...style,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-testid={`molecule-${formula}`}
      >
        <div className={"moleculeImage " + formula + "_Image"} />
        <div className="moleculeLabel">{formula}</div>
        <div
          key={formula}
          style={{
            position: "absolute",
            left: `${width / 6}px`,
            top: `${scaleSize + 16}px`,
            fontSize: "12px",
            color: "#7f8c8d",
            backgroundColor: "#ecf0f1",
            padding: "0px 3px",
            borderRadius: "4px",
          }}
        >
          {spawnPoint && spawnPoint.name}
        </div>
      </div>
    </>
  );
};
