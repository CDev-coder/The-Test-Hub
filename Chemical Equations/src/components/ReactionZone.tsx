import { useDrop } from "react-dnd";
import { useRef } from "react";
import { MoleculeItem } from "../types";

interface ReactionZoneProps {
  reaction: string[];
  onDrop: (item: MoleculeItem) => void;
  onReturnToSpawn: (item: MoleculeItem) => void;
}

export const ReactionZone = ({
  reaction,
  onDrop,
  onReturnToSpawn,
}: ReactionZoneProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "MOLECULE",
    drop: (item: MoleculeItem) => {
      onDrop(item);
    },
    hover: (item: MoleculeItem) => {
      console.log("hover: " + item);
      // Optional: Add visual feedback while hovering
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  drop(divRef);

  const handleDoubleClick = () => {
    // Return all molecules to spawn on double click
    reaction.forEach((formula, index) => {
      onReturnToSpawn({
        id: `return-${index}-${Date.now()}`,
        formula,
        x: 0,
        y: 0,
        spawnPoint: getSpawnPointForFormula(formula),
      });
    });
  };

  // Helper to determine spawn point by formula
  const getSpawnPointForFormula = (formula: string) => {
    const baseFormula = formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, "");
    return (
      Object.entries(SPAWN_POINTS).find(([f]) => f === baseFormula)?.[1] || {
        x: 50,
        y: 50,
      } // Default spawn
    );
  };

  return (
    <div
      ref={divRef}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "absolute",
        right: "20px",
        bottom: "20px",
        minHeight: "150px",
        minWidth: "250px",
        border: `2px dashed ${
          isOver ? "#4CAF50" : canDrop ? "#FFC107" : "#666"
        }`,
        backgroundColor: isOver
          ? "rgba(76, 175, 80, 0.1)"
          : "rgba(255, 255, 255, 0.9)",
        padding: "15px",
        borderRadius: "8px",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      title="Double click to clear"
    >
      <h3 style={{ marginTop: 0 }}>Reaction Zone</h3>
      <p>Drag molecules here or double-click to reset</p>

      <div
        style={{
          marginTop: "10px",
          minHeight: "50px",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
        }}
      >
        {reaction.length > 0 ? (
          <>
            <div style={{ fontSize: "1.2em", marginBottom: "5px" }}>
              {reaction.join(" + ")} → ?
            </div>
            <button
              onClick={() => {
                reaction.forEach((formula, index) => {
                  onReturnToSpawn({
                    id: `return-${index}-${Date.now()}`,
                    formula,
                    x: 0,
                    y: 0,
                    spawnPoint: getSpawnPointForFormula(formula),
                  });
                });
              }}
              style={{
                padding: "5px 10px",
                fontSize: "0.8em",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear Reaction
            </button>
          </>
        ) : (
          <div style={{ color: "#999", fontStyle: "italic" }}>
            No molecules added yet
          </div>
        )}
      </div>
    </div>
  );
};

// Define spawn points (should match your App.tsx)
const SPAWN_POINTS = {
  H: { x: 50, y: 50 },
  O: { x: 150, y: 50 },
  C: { x: 250, y: 50 },
};
