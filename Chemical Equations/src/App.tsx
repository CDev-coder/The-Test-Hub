import { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Molecule } from "./components/Molecule";
import { ReactionZone } from "./components/ReactionZone";
import { MoleculeItem, ReactionZoneItem } from "./types";

const SNAP_DISTANCE = 30;
const MOLECULE_SIZE = 60;
const SPAWN_POINTS = {
  H: { x: 50, y: 50 },
  O: { x: 150, y: 50 },
  C: { x: 250, y: 50 },
  N: { x: 350, y: 50 },
};

const combinationRules = [
  { reactants: ["H", "H"], product: "H₂" },
  { reactants: ["H", "O"], product: "OH" },
  { reactants: ["H₂", "O"], product: "H₂O" },
  { reactants: ["C", "O"], product: "CO" },
  { reactants: ["CO", "O"], product: "CO₂" },
];

export default function App() {
  const [molecules, setMolecules] = useState<MoleculeItem[]>(() => {
    return Object.entries(SPAWN_POINTS).flatMap(([formula, point], i) => [
      {
        id: `${formula.toLowerCase()}-${i}`,
        formula,
        ...point,
        width: MOLECULE_SIZE,
        height: MOLECULE_SIZE,
        spawnPoint: point,
      },
    ]);
  });

  const [reactionGrid, setReactionGrid] = useState<ReactionZoneItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle dropping onto the reaction grid
  const handleReactionZoneDrop = (
    item: MoleculeItem,
    col: number,
    row: number
  ) => {
    setReactionGrid((prev) => {
      // Remove any existing molecule in this grid position
      const filtered = prev.filter((i) => !(i.col === col && i.row === row));
      return [...filtered, { formula: item.formula, col, row }];
    });

    // Return original to spawn point (or create new copy)
    handleReturnToSpawn(item);
  };

  // Remove molecule from grid and return to spawn
  const handleRemoveFromGrid = (col: number, row: number) => {
    const removedItem = reactionGrid.find(
      (i) => i.col === col && i.row === row
    );
    if (!removedItem) return;

    setReactionGrid((prev) =>
      prev.filter((i) => !(i.col === col && i.row === row))
    );

    // Create new molecule at spawn point
    const spawnPoint = getSpawnPointForFormula(removedItem.formula);
    setMolecules((prev) => [
      ...prev,
      {
        id: `returned-${Date.now()}`,
        formula: removedItem.formula,
        ...spawnPoint,
        width: MOLECULE_SIZE,
        height: MOLECULE_SIZE,
        spawnPoint,
      },
    ]);
  };

  // Return molecule to its spawn point
  const handleReturnToSpawn = (item: MoleculeItem) => {
    if (!item.spawnPoint) return;

    setMolecules((prev) =>
      prev.map((mol) =>
        mol.id === item.id
          ? {
              ...mol,
              x: item.spawnPoint!.x,
              y: item.spawnPoint!.y,
              parentId: undefined,
            }
          : mol
      )
    );
  };

  const handleDetech = () => {
    console.log("handleDetech trigger");
  };

  // Handle molecule snapping in the workspace
  const handleDrop = (item: MoleculeItem, monitor: any) => {
    const offset = monitor.getClientOffset();
    if (!offset || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = offset.x - containerRect.left;
    const y = offset.y - containerRect.top;

    const didSnap = trySnapMolecules(item, x, y);

    if (!didSnap) {
      setMolecules((prev) =>
        prev.map((mol) => (mol.id === item.id ? { ...mol, x, y } : mol))
      );
    }
  };

  // Try to snap molecules together in workspace
  const trySnapMolecules = (
    draggedItem: MoleculeItem,
    x: number,
    y: number
  ): boolean => {
    let didSnap = false;

    setMolecules((prev) => {
      const potentialParents = prev.filter(
        (m) =>
          m.id !== draggedItem.id &&
          !m.parentId &&
          distance(x, y, m.x + (m.width || 0) / 2, m.y + (m.height || 0) / 2) <
            SNAP_DISTANCE
      );

      if (potentialParents.length > 0) {
        didSnap = true;
        const parent = potentialParents[0];
        const rule = combinationRules.find(
          (r) =>
            r.reactants.includes(parent.formula) &&
            r.reactants.includes(draggedItem.formula)
        );

        if (rule) {
          return prev.map((mol) => {
            if (mol.id === parent.id) {
              return {
                ...mol,
                formula: rule.product,
                attachedMolecules: [
                  ...(mol.attachedMolecules || []),
                  { ...draggedItem },
                ],
                width: (mol.width || 0) * 1.2,
                height: (mol.height || 0) * 1.2,
              };
            }
            if (mol.id === draggedItem.id) {
              return {
                ...mol,
                x: parent.x,
                y: parent.y,
                parentId: parent.id,
                width: (mol.width || 0) * 0.8,
                height: (mol.height || 0) * 0.8,
              };
            }
            return mol;
          });
        }
      }
      return prev;
    });

    return didSnap;
  };

  // Helper to get spawn point by formula
  const getSpawnPointForFormula = (formula: string) => {
    const baseFormula = formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/, "");
    return (
      SPAWN_POINTS[baseFormula as keyof typeof SPAWN_POINTS] || { x: 50, y: 50 }
    );
  };

  // Helper to calculate distance between points
  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={containerRef}
        style={{
          padding: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: "relative",
          height: "100vh",
          backgroundColor: "#f8f9fa",
          overflow: "hidden",
        }}
      >
        <h1 style={{ color: "#2c3e50", marginBottom: "24px" }}>
          Chemical Equation Builder
        </h1>

        <div style={{ display: "flex", gap: "24px" }}>
          {/* Workspace Area */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "#34495e", marginBottom: "12px" }}>
              Workspace
            </h3>
            <div
              style={{
                position: "relative",
                height: "400px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                padding: "20px",
              }}
            >
              {/* Render all molecules */}
              {molecules.map((molecule) => (
                <Molecule
                  key={molecule.id}
                  {...molecule}
                  onDetach={handleDetech}
                  onDrop={handleDrop}
                  onReturnToSpawn={handleReturnToSpawn}
                  style={{
                    ...(molecule.parentId && {
                      transform: "scale(0.8)",
                      opacity: 0.8,
                      borderStyle: "dashed",
                      zIndex: 1,
                    }),
                  }}
                />
              ))}

              {/* Spawn point labels */}
              {Object.entries(SPAWN_POINTS).map(([formula, point]) => (
                <div
                  key={formula}
                  style={{
                    position: "absolute",
                    left: `${point.x - 20}px`,
                    top: `${point.y + MOLECULE_SIZE + 5}px`,
                    fontSize: "12px",
                    color: "#7f8c8d",
                    backgroundColor: "#ecf0f1",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {formula} Spawn
                </div>
              ))}
            </div>
          </div>

          {/* Reaction Zone */}
          <div style={{ width: "350px" }}>
            <ReactionZone
              reaction={reactionGrid}
              onDrop={handleReactionZoneDrop}
              onRemove={handleRemoveFromGrid}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
