/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  Calculator, 
  Lightbulb, 
  ArrowRight,
  Info,
  AlertCircle,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateBill, calculateCO2, runSimulations, generateOptimizationTips } from './utils';
import { EnergyState } from './types';

export default function App() {
  const [currentUsage, setCurrentUsage] = useState<number>(350);
  const [forecastedUsage, setForecastedUsage] = useState<number>(420);

  const energyData = useMemo((): EnergyState => {
    const bill = calculateBill(forecastedUsage);
    const co2 = calculateCO2(forecastedUsage);
    const simulations = runSimulations(forecastedUsage);
    const tips = generateOptimizationTips(forecastedUsage);

    return {
      currentUsage,
      forecastedUsage,
      bill,
      co2,
      simulations,
      tips
    };
  }, [currentUsage, forecastedUsage]);

  const percentChange = ((forecastedUsage - currentUsage) / currentUsage) * 100;
  const isIncreasing = percentChange > 0;

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Energy Intelligence Engine</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-stone-500">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Computation Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Input Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4"
          >
            <div className="flex items-center gap-2 text-stone-500 mb-2">
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Usage Inputs</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Current Usage (kWh)</label>
                <input 
                  type="number" 
                  value={currentUsage}
                  onChange={(e) => setCurrentUsage(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-mono text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Forecasted Usage (kWh)</label>
                <input 
                  type="number" 
                  value={forecastedUsage}
                  onChange={(e) => setForecastedUsage(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-mono text-lg"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-center"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-stone-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Forecast Interpretation</span>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${isIncreasing ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isIncreasing ? 'Trend: Upward' : 'Trend: Downward'}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tighter">
                {Math.abs(percentChange).toFixed(1)}%
              </span>
              <span className="text-stone-400 font-medium">
                {isIncreasing ? 'increase' : 'decrease'} from current
              </span>
            </div>
            <p className="mt-4 text-stone-400 text-sm leading-relaxed">
              {isIncreasing 
                ? "Forecast indicates a significant surge in consumption. This shift is typically associated with seasonal appliance usage or increased occupancy."
                : "Projected usage shows efficient optimization. Maintaining this trajectory will lead to substantial long-term savings."
              }
            </p>
          </motion.div>
        </section>

        {/* Executive Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Current Usage', value: `${currentUsage} kWh`, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Forecasted Usage', value: `${forecastedUsage} kWh`, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Estimated Bill', value: `₹${energyData.bill.totalPayable.toLocaleString()}`, icon: Calculator, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'CO₂ Footprint', value: `${energyData.co2.totalKg.toFixed(1)} kg`, icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm"
            >
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bill Breakdown */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-stone-400" />
                  Bill Breakdown (Slab Wise)
                </h2>
                <div className="text-xs font-mono text-stone-400">DYNAMIC RECALCULATION ENABLED</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      <th className="px-6 py-4">Slab Range</th>
                      <th className="px-6 py-4">Units Consumed</th>
                      <th className="px-6 py-4 text-right">Rate (₹)</th>
                      <th className="px-6 py-4 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {energyData.bill.slabBreakdown.map((item, i) => (
                      <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-stone-700">{item.slab}</td>
                        <td className="px-6 py-4 text-sm font-mono">{item.units.toFixed(1)}</td>
                        <td className="px-6 py-4 text-sm text-right font-mono">₹{item.rate.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-right font-bold">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50/30">
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-stone-500 italic">Fixed Charges</td>
                      <td className="px-6 py-4 text-sm text-right font-bold">₹{energyData.bill.fixedCharge}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-emerald-600 text-white">
                      <td colSpan={3} className="px-6 py-5 text-sm font-bold uppercase tracking-wider">Total Payable Amount</td>
                      <td className="px-6 py-5 text-xl text-right font-black">₹{energyData.bill.totalPayable.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Simulation Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-500" />
                  What-If Simulation Engine
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      <th className="px-6 py-4">Scenario</th>
                      <th className="px-6 py-4">New Usage</th>
                      <th className="px-6 py-4">New Bill</th>
                      <th className="px-6 py-4 text-right">Savings (₹)</th>
                      <th className="px-6 py-4 text-right">CO₂ Reduced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {energyData.simulations.map((sim, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-600">{sim.reduction}% Reduction</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono">{sim.usage.toFixed(1)} kWh</td>
                        <td className="px-6 py-4 text-sm font-bold">₹{sim.bill.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-bold text-emerald-600">₹{sim.savingsValue.toLocaleString()}</div>
                          <div className="text-[10px] text-stone-400">({sim.savingsPercent.toFixed(1)}%)</div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                          {sim.co2Reduction.toFixed(1)} kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Sidebar: Carbon & Optimization */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Carbon Impact Report */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Carbon Impact Report
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Total CO₂ Emissions</div>
                  <div className="text-3xl font-black text-green-900 tracking-tighter">{energyData.co2.totalKg.toFixed(1)} kg</div>
                  <p className="text-xs text-green-700 mt-2 leading-relaxed">
                    Based on a grid emission factor of 0.82 kg CO₂/kWh. This represents the direct environmental cost of your forecasted consumption.
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <TrendingUp className="w-6 h-6 text-stone-400 rotate-45" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">Offset Requirement</div>
                    <div className="text-xl font-bold text-stone-900">{Math.ceil(energyData.co2.trees)} Mature Trees</div>
                    <p className="text-[10px] text-stone-400">Required per year to neutralize footprint</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Strategy */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Optimization Strategy
                </h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">Ranked</span>
              </div>

              <div className="space-y-3">
                {energyData.tips.map((tip, i) => (
                  <div key={tip.id} className="group p-4 bg-stone-50 hover:bg-white hover:shadow-md hover:border-emerald-200 border border-stone-100 rounded-xl transition-all cursor-default">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                        tip.priority === 'High' ? 'bg-red-100 text-red-700' : 
                        tip.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {tip.priority} Impact
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">#0{i+1}</span>
                    </div>
                    <p className="text-sm font-medium text-stone-800 leading-snug group-hover:text-emerald-900">{tip.suggestion}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px]">
                      <span className="text-stone-400 font-bold uppercase tracking-widest">Est. Savings</span>
                      <span className="text-emerald-600 font-bold">{tip.savingsPotential}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final Recommendation */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-emerald-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-emerald-800 p-4 rounded-2xl border border-emerald-700 shadow-inner">
              <Zap className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight">Final AI Recommendation Summary</h2>
              <p className="text-emerald-100/80 leading-relaxed max-w-2xl">
                Based on your forecasted usage of <span className="text-white font-bold">{forecastedUsage} kWh</span>, your energy profile is currently in the <span className="text-white font-bold">High Efficiency Tier</span>. 
                Implementing the top 2 optimization strategies could reduce your bill by up to <span className="text-emerald-400 font-bold">₹1,600</span> next month and save <span className="text-emerald-400 font-bold">12.4 kg</span> of CO₂.
              </p>
            </div>
            <button className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg">
              Download Full Report
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-stone-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Energy Intelligence Engine v1.0</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <a href="#" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-600 transition-colors">Tariff Guidelines</a>
            <a href="#" className="hover:text-stone-600 transition-colors">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
