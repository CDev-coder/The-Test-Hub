import { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Molecule } from "./components/Molecule";
import { ReactionZone } from "./components/ReactionZone";
import { MoleculeItem, CombinationRule } from "./types";

const SNAP_DISTANCE = 30;
const MOLECULE_SIZE = 60;
const SPAWN_POINTS = {
  H: { x: 50, y: 50 },
  O: { x: 150, y: 50 },
  C: { x: 250, y: 50 },
};

const combinationRules: CombinationRule[] = [
  { reactants: ["H", "H"], product: "H₂", snapDistance: SNAP_DISTANCE },
  { reactants: ["H", "O"], product: "OH", snapDistance: SNAP_DISTANCE },
  { reactants: ["H₂", "O"], product: "H₂O", snapDistance: SNAP_DISTANCE },
];

export default function App() {
  const [molecules, setMolecules] = useState<MoleculeItem[]>([
    {
      id: "h1",
      formula: "H",
      ...SPAWN_POINTS.H,
      width: MOLECULE_SIZE,
      height: MOLECULE_SIZE,
      spawnPoint: SPAWN_POINTS.H,
    },
    {
      id: "h2",
      formula: "H",
      ...SPAWN_POINTS.H,
      width: MOLECULE_SIZE,
      height: MOLECULE_SIZE,
      spawnPoint: SPAWN_POINTS.H,
    },
    {
      id: "o1",
      formula: "O",
      ...SPAWN_POINTS.O,
      width: MOLECULE_SIZE,
      height: MOLECULE_SIZE,
      spawnPoint: SPAWN_POINTS.O,
    },
  ]);

  const [reaction, setReaction] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const trySnapMolecules = (
    draggedItem: MoleculeItem,
    x: number,
    y: number
  ): boolean => {
    let didSnap = false;

    setMolecules((prev) => {
      // Find potential molecules to snap to (only parents)
      const potentialParents = prev.filter(
        (m) =>
          m.id !== draggedItem.id &&
          !m.parentId && // Don't snap to already child molecules
          distance(x, y, m.x + (m.width || 0) / 2, m.y + (m.height || 0) / 2) <
            SNAP_DISTANCE
      );

      if (potentialParents.length > 0) {
        didSnap = true;
        const parent = potentialParents[0];

        // Check if this combination is allowed
        const rule = combinationRules.find(
          (r) =>
            r.reactants.includes(parent.formula) &&
            r.reactants.includes(draggedItem.formula)
        );

        if (rule) {
          // Create new parent with combined formula
          return prev.map((mol) => {
            if (mol.id === parent.id) {
              return {
                ...mol,
                formula: rule.product,
                attachedMolecules: [
                  ...(mol.attachedMolecules || []),
                  { ...draggedItem },
                ],
                width: (mol.width || 0) * 1.2, // Slightly enlarge parent
                height: (mol.height || 0) * 1.2,
              };
            }
            if (mol.id === draggedItem.id) {
              return {
                ...mol,
                x: parent.x,
                y: parent.y,
                parentId: parent.id,
                width: (mol.width || 0) * 0.8, // Slightly shrink child
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

  const handleDetachMolecule = (item: MoleculeItem) => {
    setMolecules((prev) => {
      // If has parent, return both to original formulas
      if (item.parentId) {
        return prev.map((mol) => {
          if (mol.id === item.parentId) {
            // Find original formula by removing child's formula
            const originalFormula =
              combinationRules
                .find((r) => r.product === mol.formula)
                ?.reactants.find((f) => f !== item.formula) || mol.formula;

            return {
              ...mol,
              formula: originalFormula,
              attachedMolecules: mol.attachedMolecules?.filter(
                (m) => m.id !== item.id
              ),
              width: MOLECULE_SIZE,
              height: MOLECULE_SIZE,
            };
          }
          if (mol.id === item.id) {
            return {
              ...mol,
              parentId: undefined,
              x: mol.x + 20, // Offset slightly when detaching
              y: mol.y + 20,
              width: MOLECULE_SIZE,
              height: MOLECULE_SIZE,
            };
          }
          return mol;
        });
      }
      return prev;
    });
  };

  const handleReactionZoneDrop = (item: MoleculeItem) => {
    setReaction((prev) => [...prev, item.formula]);
    // Don't remove from molecules array - just return to spawn
    handleReturnToSpawn(item);
  };

  // Helper function to calculate distance between points
  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={containerRef}
        style={{
          padding: "20px",
          fontFamily: "Arial",
          position: "relative",
          height: "500px",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        <h1>Chemical Equation Builder</h1>

        {/* Render all molecules */}
        {molecules.map((molecule) => (
          <Molecule
            key={molecule.id}
            {...molecule}
            onDrop={handleDrop}
            onDetach={handleDetachMolecule}
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

        <ReactionZone
          reaction={reaction}
          onDrop={handleReactionZoneDrop}
          onReturnToSpawn={handleReturnToSpawn}
        />

        {/* Spawn point labels */}
        {Object.entries(SPAWN_POINTS).map(([formula, point]) => (
          <div
            key={formula}
            style={{
              position: "absolute",
              left: `${point.x - 20}px`,
              top: `${point.y + MOLECULE_SIZE + 5}px`,
              fontSize: "12px",
              color: "#666",
            }}
          >
            {formula} Spawn
          </div>
        ))}
      </div>
    </DndProvider>
  );
}
