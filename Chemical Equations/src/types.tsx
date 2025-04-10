export interface MoleculeItem {
  mapIndex?: number;
  id: string;
  formula: string;
  width?: number;
  height?: number;
  parentId?: string | null;
  spawnPoint?: { name: string };
  attachedMolecules?: MoleculeItem[];
  snappedToGrid?: { col: number; row: number }; // Track grid position
}

export interface BondItem {
  mapIndex?: number;
  id: string;
  bondType: string;
  width?: number;
  height?: number;
  parentId?: string | null;
  attachedMolecules?: BondItem[];
  spawnPoint?: { name: string };
  snappedToGrid?: { col: number; row: number }; // Track grid position
}

export interface ReactionZoneItem {
  formula?: string;
  bondType?: string;
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

export interface BondProps extends BondItem {
  onDrop: (item: BondItem, monitor: any) => void;
  onDetach: (item: BondItem) => void;
  onReturnToSpawn: (item: BondItem) => void;
  style?: React.CSSProperties;
}
