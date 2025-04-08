export interface MoleculeItem {
  id: string;
  formula: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  parentId?: string | null;
  attachedMolecules?: MoleculeItem[];
  spawnPoint?: { x: number; y: number };
  snappedToGrid?: { col: number; row: number }; // Track grid position
}

export interface ReactionZoneItem {
  formula: string;
  col: number;
  row: number;
}

export interface CombinationRule {
  reactants: string[];
  product: string;
  snapDistance?: number;
}

export interface MoleculeProps extends MoleculeItem {
  onDrop: (item: MoleculeItem, monitor: any) => void;
  onDetach: (item: MoleculeItem) => void;
  onReturnToSpawn: (item: MoleculeItem) => void;
  style?: React.CSSProperties;
}
