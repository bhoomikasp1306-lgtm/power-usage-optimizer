import { Slab, BillResult, SlabCalculation, SimulationResult, OptimizationTip } from './types';

export const DEFAULT_SLABS: Slab[] = [
  { min: 0, max: 100, rate: 3.50 },
  { min: 101, max: 300, rate: 5.50 },
  { min: 301, max: 500, rate: 7.50 },
  { min: 501, max: null, rate: 9.00 },
];

export const FIXED_CHARGE = 150;
export const CO2_FACTOR = 0.82;
export const TREE_FACTOR = 22;

export function calculateBill(usage: number, slabs: Slab[] = DEFAULT_SLABS): BillResult {
  let remainingUsage = usage;
  let energyCharge = 0;
  const slabBreakdown: SlabCalculation[] = [];

  for (const slab of slabs) {
    if (remainingUsage <= 0) break;

    const slabLimit = slab.max ? (slab.max - slab.min + 1) : Infinity;
    const unitsInSlab = Math.min(remainingUsage, slabLimit);
    const amount = unitsInSlab * slab.rate;

    energyCharge += amount;
    slabBreakdown.push({
      slab: `${slab.min}${slab.max ? `-${slab.max}` : '+'} kWh`,
      units: unitsInSlab,
      rate: slab.rate,
      amount: amount
    });

    remainingUsage -= unitsInSlab;
  }

  return {
    energyCharge,
    fixedCharge: FIXED_CHARGE,
    totalPayable: energyCharge + FIXED_CHARGE,
    slabBreakdown
  };
}

export function calculateCO2(usage: number) {
  const totalKg = usage * CO2_FACTOR;
  return {
    totalKg,
    trees: totalKg / TREE_FACTOR
  };
}

export function runSimulations(usage: number): SimulationResult[] {
  const reductions = [0.10, 0.15, 0.20];
  const baseBill = calculateBill(usage).totalPayable;

  return reductions.map(reduction => {
    const newUsage = usage * (1 - reduction);
    const newBill = calculateBill(newUsage).totalPayable;
    const savingsValue = baseBill - newBill;
    
    return {
      reduction: reduction * 100,
      usage: newUsage,
      bill: newBill,
      savingsValue,
      savingsPercent: (savingsValue / baseBill) * 100,
      co2Reduction: (usage - newUsage) * CO2_FACTOR
    };
  });
}

export function generateOptimizationTips(usage: number): OptimizationTip[] {
  // Mock logic for tips based on usage levels
  const tips: OptimizationTip[] = [
    {
      id: '1',
      suggestion: 'Switch to Smart LED lighting with motion sensors in common areas.',
      savingsPotential: '₹250 - ₹400 / month',
      priority: 'High'
    },
    {
      id: '2',
      suggestion: 'Optimize AC temperature to 24°C. Every degree higher saves ~6% energy.',
      savingsPotential: '₹800 - ₹1200 / month',
      priority: 'High'
    },
    {
      id: '3',
      suggestion: 'Unplug phantom loads (TVs, chargers, microwaves) when not in use.',
      savingsPotential: '₹100 - ₹150 / month',
      priority: 'Medium'
    },
    {
      id: '4',
      suggestion: 'Schedule heavy appliance usage (Washing Machine, Dishwasher) during off-peak hours.',
      savingsPotential: '₹150 - ₹300 / month',
      priority: 'Medium'
    },
    {
      id: '5',
      suggestion: 'Perform annual maintenance on refrigerator coils to improve efficiency.',
      savingsPotential: '₹50 - ₹100 / month',
      priority: 'Low'
    }
  ];

  return tips;
}
