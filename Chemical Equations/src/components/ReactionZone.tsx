import { useDrop } from "react-dnd";
import { useRef } from "react";
import { BondItem, MoleculeItem, ReactionZoneItem } from "../types";
import BondLine from "./BondLine";
import { useLanguage } from "./translator";

interface ReactionZoneProps {
  reaction: ReactionZoneItem[];
  grid_size: number;
  grid_columns: number;
  grid_rows: number;
  onDrop: (item: MoleculeItem | BondItem, col: number, row: number) => void;
  onRemove: (col: number, row: number) => void;
  onClear: () => void;
}

export const ReactionZone = ({
  reaction,
  grid_size,
  grid_columns,
  grid_rows,
  onDrop,
  onRemove,
  onClear,
}: ReactionZoneProps) => {
  const { getText } = useLanguage();
  //const gridRef = useRef<HTMLDivElement>(null);
  const dropTargetRef = useRef<HTMLDivElement | null>(null);

  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const [, drop] = useDrop(() => ({
    accept: ["MOLECULE", "BOND"],
    drop: (item: MoleculeItem | BondItem, monitor) => {
      console.log("monitor: ", monitor);
      // Prefer getClientOffset first
      let dropOffset = monitor.getClientOffset();

      // Fallback to getSourceClientOffset if null
      if (!dropOffset && isTouchDevice()) {
        dropOffset = monitor.getSourceClientOffset();
      }

      if (!dropOffset || !dropTargetRef.current) return;
      const gridRect = dropTargetRef.current.getBoundingClientRect();

      // Use visualViewport if available (esp. for mobile Safari)
      const viewportOffsetTop = window.visualViewport?.offsetTop || 0;
      const viewportOffsetLeft = window.visualViewport?.offsetLeft || 0;

      // Adjusted for scrolling, zooming, and viewport panning
      const relativeX =
        dropOffset.x - gridRect.left - viewportOffsetLeft + window.scrollX;
      const relativeY =
        dropOffset.y - gridRect.top - viewportOffsetTop + window.scrollY;

      console.log("Adjusted X:", relativeX, "Y:", relativeY);

      const col = Math.round(relativeX / grid_size);
      const row = Math.round(relativeY / grid_size);
      console.log("COL :", col, "row:", row);
      if (col >= 0 && col < grid_columns && row >= 0 && row < grid_rows) {
        onDrop(item, col, row);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // drop(gridRef);

  const combinedRef = (node: HTMLDivElement | null) => {
    drop(node); // connect to DnD
    dropTargetRef.current = node; // save the ref for bounding box checks
  };

  const handleOnEnter = (e: { currentTarget: any }) => {
    // Access the button DOM node
    const button = e.currentTarget;
    console.log("handleOnEnter button ", button);
    const lastChild = button.lastElementChild as HTMLElement;
    if (lastChild) {
      lastChild.style.visibility = "visible";
    }
  };

  const handleOnLeave = (e: { currentTarget: any }) => {
    const button = e.currentTarget;
    console.log("handleOnLeave:", button);
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
        ref={combinedRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid_columns}, ${grid_size}px)`,
          gridTemplateRows: `repeat(${grid_rows}, ${grid_size}px)`,
          gap: "2px",
          marginBottom: "16px",
        }}
      >
        {/* Render all grid cells */}
        {Array.from({ length: grid_rows * grid_columns }).map((_, index) => {
          const col = index % grid_columns;
          const row = Math.floor(index / grid_columns);
          const item = reaction.find((i) => i.col === col && i.row === row);
          //console.log("SEE item is: ", item);
          return (
            <div
              className="reactionZoneDiv"
              id={"reactionZone_" + index}
              key={`${row}-${col}`}
              style={{
                width: grid_size,
                height: grid_size,
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
              onTouchStart={handleOnEnter}
              onTouchEnd={handleOnLeave}
              onTouchCancel={handleOnLeave}
            >
              {item && (
                <>
                  {item.formula && (
                    <>
                      <div
                        className={"dropImage " + item.formula + "_Image"}
                        style={{
                          width: `${grid_size}px`,
                          height: `${grid_size}px`,
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
                      parentWidth={grid_size}
                      parentHeight={grid_size}
                    />
                  )}
                  <button
                    className="reactionZoneButton"
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "3px",
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: `${grid_size / 3}px`,
                      height: `${grid_size / 3}px`,
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
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      onRemove(col, row);
                    }}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="equalAreaDiv">
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
