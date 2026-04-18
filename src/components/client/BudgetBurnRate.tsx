"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CircleDollarSign, TrendingDown } from "lucide-react";

type MonthlySpend = {
  month: string;
  amount: number;
};

type BudgetBurnRateProps = {
  budget: number;
  spent: number;
  history: MonthlySpend[];
};

export default function BudgetBurnRate({ budget, spent, history }: BudgetBurnRateProps) {
  const [selectedMonth, setSelectedMonth] = useState(history[history.length - 1]?.month ?? "");

  const burnRate = useMemo(() => {
    const months = history.length || 1;
    return Math.round(spent / months);
  }, [history.length, spent]);

  const peakMonth = useMemo(() => {
    return history.reduce((highest, entry) => (entry.amount > highest.amount ? entry : highest), history[0]);
  }, [history]);

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Budget Burn Rate</h3>
          <p className="mt-1 text-sm text-slate-600">Executive view of planned vs actual spend.</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
          <CircleDollarSign className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Total Budget</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">₹{budget.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Spent</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">₹{spent.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Monthly Burn</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">₹{burnRate.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Spend History</div>
            <p className="text-xs text-slate-600">Click a month to inspect the burn pattern.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <TrendingDown className="h-3.5 w-3.5" />
            Peak {peakMonth.month}
          </span>
        </div>

        <div className="space-y-3">
          {history.map((entry) => {
            const active = selectedMonth === entry.month;
            const width = Math.max(12, Math.min(100, Math.round((entry.amount / budget) * 1000)));
            return (
              <button
                key={entry.month}
                type="button"
                onClick={() => setSelectedMonth(entry.month)}
                className="w-full text-left"
              >
                <div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">{entry.month}</span>
                  <span>₹{entry.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <motion.div
                    initial={false}
                    animate={{ width: `${width}%` }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    className={[
                      "h-3 rounded-full",
                      active ? "bg-orange-600" : "bg-slate-400",
                    ].join(" ")}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Selected Month</div>
          <div className="mt-1 text-base font-semibold text-white">{selectedMonth}</div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            This burn pattern is driven by mock data and state; it can later be replaced with real API data without changing the component contract.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
