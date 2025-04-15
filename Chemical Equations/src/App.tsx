import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Molecule } from "./components/Molecule";
import { ReactionZone } from "./components/ReactionZone";
import { BondItem, MoleculeItem, ReactionZoneItem } from "./types";
import { Bond } from "./components/Bond";
import { useLanguage } from "./components/translator";
import { DndProviderWrapper } from "./utils/DndProviderWrapper";
import { CustomDragLayer } from "./utils/CustomDragLayer";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toggleLanguage, getText, language } = useLanguage();

  const SNAP_DISTANCE = 30;
  const MOLECULE_SIZE = 60;

  const MOD_OBJ = useMemo(
    () => ({
      H: { name: getText("hydrogenOption") },
      O: { name: getText("oxygenOption") },
      C: { name: getText("carbonOption") },
      N: { name: getText("nitrogenOption") },
    }),
    [language]
  );

  const BON_OBJ = useMemo(
    () => ({
      V1: { name: getText("singleBondOption") },
      V1S: { name: getText("singleBondOption") },
      V1D1: { name: getText("singleBondOption") },
      V1D2: { name: getText("singleBondOption") },
      V2: { name: getText("doubleBondOption") },
      V2S: { name: getText("doubleBondOption") },
      V2D1: { name: getText("doubleBondOption") },
      V2D2: { name: getText("doubleBondOption") },
    }),
    [language]
  );

  const [reactionGrid, setReactionGrid] = useState<ReactionZoneItem[]>([]);
  const [molecules, setMolecules] = useState<MoleculeItem[]>([]);

  // Call this function whenever language or MOD_OBJ changes
  const updateMolecules = useCallback(() => {
    const newMolecules = Object.entries(MOD_OBJ).flatMap(
      ([formula, point], i) => [
        {
          id: `${formula.toLowerCase()}-${i}`,
          formula,
          ...point,
          width: MOLECULE_SIZE,
          height: MOLECULE_SIZE,
          spawnPoint: point,
        },
      ]
    );
    setMolecules(newMolecules);
  }, [MOD_OBJ, MOLECULE_SIZE]);

  // Update when language or MOD_OBJ changes
  useEffect(() => {
    updateMolecules();
  }, [language, updateMolecules]);

  ////////setBonds has to be mimicd like the setMole to handle the snapping.
  const [bonds, setBonds] = useState<BondItem[]>([]);

  const updateBonds = useCallback(() => {
    const newBonds = Object.entries(BON_OBJ).flatMap(([bondType, point], i) => [
      {
        id: `${bondType.toLowerCase()}-${i}`,
        bondType,
        ...point,
        width: MOLECULE_SIZE,
        height: MOLECULE_SIZE,
        spawnPoint: point,
      },
    ]);
    setBonds(newBonds);
  }, [BON_OBJ, MOLECULE_SIZE]);

  useEffect(() => {
    updateBonds();
  }, [language, updateBonds]);

  const combinationRules = [
    { reactants: ["H", "H"], product: "H₂" },
    { reactants: ["H", "O"], product: "OH" },
    { reactants: ["H₂", "O"], product: "H₂O" },
    { reactants: ["C", "O"], product: "CO" },
    { reactants: ["CO", "O"], product: "CO₂" },
  ];

  const handleReactionZoneDrop = useCallback(
    (item: MoleculeItem | BondItem, col: number, row: number) => {
      // Create a clone for the reaction grid
      if ("formula" in item) {
        const cloneId = `clone-${Date.now()}-${item.formula}`;

        setReactionGrid((prev) => {
          const filtered = prev.filter(
            (i) => !(i.col === col && i.row === row)
          );
          return [
            ...filtered,
            { formula: item.formula, col, row, id: cloneId },
          ];
        });
        // Return original to spawn (only if it's not already a clone)
        if (!item.id.startsWith("clone-")) {
          handleReturnToSpawn(item);
        }
      } else {
        console.log("Its a Bond");
        const cloneId = `clone-${Date.now()}-${item.bondType}`;

        setReactionGrid((prev) => {
          const filtered = prev.filter(
            (i) => !(i.col === col && i.row === row)
          );
          return [
            ...filtered,
            { bondType: item.bondType, col, row, id: cloneId },
          ];
        });
        // Return original to spawn (only if it's not already a clone)
        if (!item.id.startsWith("clone-")) {
          handleReturnToSpawn(item);
        }
      }
    },
    []
  );

  // Remove molecule from grid and return to spawn
  const handleRemoveFromGrid = useCallback((col: number, row: number) => {
    // Simply remove from grid without creating new molecules
    setReactionGrid((prev) =>
      prev.filter((i) => !(i.col === col && i.row === row))
    );
  }, []);

  const handleClearGrid = () => {
    setReactionGrid([]);
  };

  const handleLangaugeChange = () => {
    toggleLanguage();
    console.log("CHANGING TO: ", language);
  };

  // Return molecule to its spawn point
  const handleReturnToSpawn = (item: MoleculeItem | BondItem) => {
    // Only return original molecules (not clones) to spawn
    if (!item.id.includes("clone-")) {
      setMolecules((prev) =>
        prev.map((mol) =>
          mol.id === item.id
            ? {
                ...mol,
                parentId: undefined,
              }
            : mol
        )
      );
    }
  };

  const handleReturnBondToSpawn = (item: BondItem) => {
    // Only return original molecules (not clones) to spawn
    if (!item.id.includes("clone-")) {
      setBonds((prev) =>
        prev.map((bon) =>
          bon.id === item.id
            ? {
                ...bon,
                parentId: undefined,
              }
            : bon
        )
      );
    }
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

  const handleBondDrop = (item: BondItem, monitor: any) => {
    const offset = monitor.getClientOffset();
    if (!offset || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = offset.x - containerRect.left;
    const y = offset.y - containerRect.top;

    const didSnap = trySnapBonds(item, x, y);

    if (!didSnap) {
      setBonds((prev) =>
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
          distance(x, y, (m.width || 0) / 2, (m.height || 0) / 2) <
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
  const trySnapBonds = (
    draggedItem: BondItem,
    x: number,
    y: number
  ): boolean => {
    let didSnap = false;

    setBonds((prev) => {
      const potentialParents = prev.filter(
        (m) =>
          m.id !== draggedItem.id &&
          !m.parentId &&
          distance(x, y, (m.width || 0) / 2, (m.height || 0) / 2) <
            SNAP_DISTANCE
      );

      if (potentialParents.length > 0) {
        didSnap = true;
        const parent = potentialParents[0];
        const rule = combinationRules.find(
          (r) =>
            r.reactants.includes(parent.bondType) &&
            r.reactants.includes(draggedItem.bondType)
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

  // Helper to calculate distance between points
  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  //////USE MEMO
  const reactionZoneProps = useMemo(
    () => ({
      reaction: reactionGrid,
      GRID_CELL_SIZE: MOLECULE_SIZE,
      onDrop: handleReactionZoneDrop,
      onRemove: handleRemoveFromGrid,
      onClear: handleClearGrid,
    }),
    [
      reactionGrid,
      handleReactionZoneDrop,
      handleRemoveFromGrid,
      handleClearGrid,
    ]
  );

  return (
    <DndProviderWrapper>
      <CustomDragLayer />
      <div className="parentDiv" ref={containerRef}>
        <h1 style={{ color: "#2c3e50", marginBottom: "24px" }}>
          <a href="" style={{ marginRight: "5px" }}>
            <img className="chemLogo" src="./chemical-formula.svg" />
          </a>
          {getText("titleText")}
        </h1>

        <div className="workSpaceAreaDiv">
          <div className="langDiv">
            <button
              className="langButton"
              onClick={(e) => {
                e.stopPropagation();
                handleLangaugeChange();
              }}
            >
              {getText("langButton")}
            </button>
          </div>
          <div className="draggableAreaDiv">
            <div className="moleculeSectionContainer">
              <h3
                style={{
                  color: "#34495e",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                {getText("moleculeSection")}
              </h3>
              <div className="moleculeSectionDiv">
                <div className="moleculeWrapper">
                  {molecules
                    .filter((mol) => !mol.id.startsWith("clone-")) // Only render original
                    .map((molecule) => (
                      <Molecule
                        key={molecule.id}
                        {...molecule}
                        onDetach={handleDetech}
                        onDrop={handleDrop}
                        onReturnToSpawn={handleReturnToSpawn}
                        spawnPoint={molecule.spawnPoint}
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
                </div>
              </div>
            </div>
            <div className="bondSectionContainer">
              <h3 className="bondSectionHeader">{getText("bondSection")}</h3>
              <div className="bondSectionDiv">
                <div className="bondWrapper">
                  {bonds
                    .filter((bon) => !bon.id.startsWith("clone-")) // Only render original
                    .map((bond) => (
                      <Bond
                        key={bond.id}
                        {...bond}
                        onDetach={handleDetech}
                        onDrop={handleBondDrop}
                        onReturnToSpawn={handleReturnBondToSpawn}
                        style={{
                          ...(bond.parentId && {
                            transform: "scale(0.8)",
                            opacity: 0.8,
                            borderStyle: "dashed",
                            zIndex: 1,
                          }),
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="reactionZoneDiv">
            <ReactionZone {...reactionZoneProps} />
          </div>
        </div>
      </div>
    </DndProviderWrapper>
  );
}
