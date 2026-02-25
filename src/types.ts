export interface Slab {
  min: number;
  max: number | null;
  rate: number;
}

export interface SlabCalculation {
  slab: string;
  units: number;
  rate: number;
  amount: number;
}

export interface BillResult {
  energyCharge: number;
  fixedCharge: number;
  totalPayable: number;
  slabBreakdown: SlabCalculation[];
}

export interface SimulationResult {
  reduction: number;
  usage: number;
  bill: number;
  savingsValue: number;
  savingsPercent: number;
  co2Reduction: number;
}

export interface OptimizationTip {
  id: string;
  suggestion: string;
  savingsPotential: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface EnergyState {
  currentUsage: number;
  forecastedUsage: number;
  bill: BillResult;
  co2: {
    totalKg: number;
    trees: number;
  };
  simulations: SimulationResult[];
  tips: OptimizationTip[];
}
