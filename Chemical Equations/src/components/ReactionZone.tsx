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
  const gridRef = useRef<HTMLDivElement>(null);

  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const [, drop] = useDrop(() => ({
    accept: ["MOLECULE", "BOND"],
    drop: (item: MoleculeItem | BondItem, monitor) => {
      //console.log("DROPPING IN RZ");
      const dropOffset = isTouchDevice()
        ? monitor.getSourceClientOffset()
        : monitor.getClientOffset();

      //console.log("dropOffset: ", dropOffset);
      if (!dropOffset || !gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();

      // Adjust for potential mobile viewport issues
      const viewportOffsetTop = isTouchDevice()
        ? window.visualViewport?.offsetTop || 0
        : 0;
      const viewportOffsetLeft = isTouchDevice()
        ? window.visualViewport?.offsetLeft || 0
        : 0;
      //console.log("viewportOffsetLeft, ", viewportOffsetLeft);
      //console.log("viewportOffsetTop, ", viewportOffsetTop);
      const relativeX = dropOffset.x - gridRect.left - viewportOffsetLeft;
      const relativeY = dropOffset.y - gridRect.top - viewportOffsetTop;
      //console.log("Adjusted coordinates - X:", relativeX, "Y:", relativeY);
      //console.log("BEFORE ROW: " + relativeX / grid_size);
      //console.log("BEFORE Col: " + relativeY / grid_size);
      const col = Math.floor(relativeX / grid_size);
      const row = Math.floor(relativeY / grid_size);
      //console.log("DROPPING INTO ROW: " + row + " | COL: " + col);
      if (col >= 0 && col < grid_columns && row >= 0 && row < grid_rows) {
        onDrop(item, col, row);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(gridRef);

  const handleOnEnter = (e: { currentTarget: any }) => {
    // Access the button DOM node
    const button = e.currentTarget;
    //console.log("handleOnEnter button ", button);

    const lastChild = button.lastElementChild as HTMLElement;
    if (lastChild) {
      lastChild.style.visibility = "visible";
    }

    // Read a custom attribute
    //const customAttr = button.getAttribute("data-something");
    //console.log("Hovered button attribute:", customAttr);

    // Read computed or inline styles
    //console.log("Background color:", button.style.backgroundColor);
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
