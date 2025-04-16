import { useDrop } from "react-dnd";
import { useRef } from "react";
import { MoleculeItem, ReactionZoneItem } from "../types";
import BondLine from "./BondLine";
import { useLanguage } from "./translator";

interface ReactionZoneProps {
  reaction: ReactionZoneItem[];
  GRID_CELL_SIZE: number;
  onDrop: (item: MoleculeItem, col: number, row: number) => void;
  onRemove: (col: number, row: number) => void;
  onClear: () => void;
}

//const GRID_CELL_SIZE = 70; // Size of each grid cell
const GRID_COLUMNS = 15; // Number of columns
const GRID_ROWS = 6; // Number of rows

export const ReactionZone = ({
  reaction,
  GRID_CELL_SIZE,
  onDrop,
  onRemove,
  onClear,
}: ReactionZoneProps) => {
  const { getText } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: ["MOLECULE", "BOND"],
    drop: (item: MoleculeItem & { snapDistance?: number }, monitor) => {
      const dropOffset = monitor.getClientOffset();
      if (!dropOffset || !gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const relativeX = dropOffset.x - gridRect.left;
      const relativeY = dropOffset.y - gridRect.top;

      const snapDistance =
        item.snapDistance || (window.innerWidth <= 768 ? 18 : 22); // Mobile vs desktop default

      // Snap to grid function
      const snapToGrid = (value: number) => {
        return Math.round(value / snapDistance) * snapDistance;
      };

      const snappedX = snapToGrid(relativeX);
      const snappedY = snapToGrid(relativeY);

      // Convert to grid coordinates
      const col = Math.floor(snappedX / GRID_CELL_SIZE);
      const row = Math.floor(snappedY / GRID_CELL_SIZE);

      if (col >= 0 && col < GRID_COLUMNS && row >= 0 && row < GRID_ROWS) {
        onDrop(item, col, row);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(gridRef);

  const handleOnEnter = (e: { currentTarget: any }) => {
    const button = e.currentTarget;
    const lastChild = button.lastElementChild as HTMLElement;
    if (lastChild) {
      lastChild.style.visibility = "visible";
    }
  };

  const handleOnLeave = (e: { currentTarget: any }) => {
    const button = e.currentTarget;
    //console.log("handleOnLeave:", button);
    const lastChild = button.lastElementChild as HTMLElement;
    if (lastChild) {
      lastChild.style.visibility = "hidden";
    }
  };

  const buildEquation = () => {
    const currentFormula = reaction
      .map((item) => (item.formula ? item.formula : ""))
      .filter((formula) => formula !== "");
    return <>{currentFormula.join(" + ")}</>;
  };

  return (
    <div className="reactionSpace">
      <div className="reactionHeader">
        <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#333" }}>
          {getText("reactionTitle")}
        </h3>
        <div className="reactionHeaderButtonDiv">
          <button
            className="reactionHeaderButton"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            {getText("clearButton")}
          </button>
        </div>
      </div>
      <div
        className="GridContainer"
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${GRID_CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${GRID_CELL_SIZE}px)`,
          gap: "2px",
          marginBottom: "16px",
        }}
      >
        {Array.from({ length: GRID_ROWS * GRID_COLUMNS }).map((_, index) => {
          const col = index % GRID_COLUMNS;
          const row = Math.floor(index / GRID_COLUMNS);
          const item = reaction.find((i) => i.col === col && i.row === row);
          return (
            <div
              key={`${row}-${col}`}
              style={{
                width: GRID_CELL_SIZE,
                height: GRID_CELL_SIZE,
                border: "1px solid #000000",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: item ? "#e6f7ff" : "white",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={handleOnEnter}
              onMouseLeave={handleOnLeave}
            >
              {item && (
                <>
                  {item.formula && (
                    <>
                      <div
                        className={"dropImage " + item.formula + "_Image"}
                        style={{
                          width: `${GRID_CELL_SIZE}px`,
                          height: `${GRID_CELL_SIZE}px`,
                        }}
                      />
                      <span className={"dropSpan " + item.formula + "_Text"}>
                        {item.formula}
                      </span>
                    </>
                  )}
                  {item.bondType && (
                    <BondLine
                      parentType="Grid"
                      lineType={item.bondType}
                      parentWidth={GRID_CELL_SIZE}
                      parentHeight={GRID_CELL_SIZE}
                    />
                  )}
                  <button
                    className="removeButton"
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "3px",
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      visibility: "visible",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(col, row);
                    }}
                    aria-label={`Remove ${item.formula}`}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: "12px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "0.9em", marginBottom: "4px" }}>
          {getText("equationTitle")}
        </div>
        <div style={{ fontSize: "1.2em", fontWeight: 500 }}>
          {reaction.length > 0 ? buildEquation() : <span>Empty</span>}
        </div>
      </div>
    </div>
  );
};
