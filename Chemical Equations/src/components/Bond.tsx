import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { BondProps, BondItem } from "../types";
import BondLine from "./BondLine";

export const Bond = ({
  id,
  bondType,
  width = 60,
  height = 60,
  parentId,
  spawnPoint,
  onDrop,
  onDetach,
  style,
}: BondProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOND",
    item: { id, bondType, width, height, parentId },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        if (parentId) {
          onDetach(item);
        } else if (spawnPoint) {
          // onReturnToSpawn(item);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "BOND",
    drop: (item: BondItem, monitor) => onDrop(item, monitor),
  }));

  drag(drop(divRef));

  return (
    <>
      <div
        className="bondDiv"
        id={"bondDiv_" + bondType}
        ref={divRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
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
          color: bondType + "_Image" == "C_Image" ? "white" : "",
          ...style,
        }}
        data-testid={`bond-${bondType}`}
      >
        <BondLine parentType="Bond" lineType={bondType} parentHeight={height} />
      </div>
    </>
  );
};
