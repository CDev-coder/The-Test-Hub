import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";
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
  const [hovered, setHovered] = useState(false);

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
        className="bondMaster"
        id={"bondMaster_" + bondType}
        style={{
          width: `${width}px`,
          height: `${height + 45}px`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="bondDiv"
          id={"bondDiv_" + bondType}
          ref={divRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: parentId ? "1px dashed #666" : "2px solid #333",
            backgroundColor: hovered
              ? "	rgb(129, 212, 250)"
              : spawnPoint
              ? "#e3f2fd"
              : isDragging
              ? "rgba(100, 200, 255, 0.7)"
              : "rgba(255, 255, 255, 0.9)",
            opacity: isDragging ? 0.7 : 1,
            zIndex: parentId ? 1 : 2,
            transform: isDragging ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease",
            fontSize: parentId ? "0.8em" : "1em",
            ...style,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-testid={`bond-${bondType}`}
        >
          <BondLine
            parentType="Bond"
            lineType={bondType}
            parentHeight={height}
          />
        </div>
        <div className="obj_Label">{spawnPoint && spawnPoint.name}</div>
      </div>
    </>
  );
};
