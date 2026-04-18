"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import { getMaterialRequests, type MaterialRequest } from "../../lib/api/labor";

export default function MaterialRequestList() {
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("bags");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void getMaterialRequests().then((initialRequests) => {
      if (!isMounted) {
        return;
      }

      setRequests(initialRequests);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const addRequest = (event: React.FormEvent) => {
    event.preventDefault();
    if (!item.trim()) return;

    setRequests((current) => [
      {
        id: Date.now(),
        item: item.trim(),
        quantity: Number(quantity),
        unit,
        status: "Pending",
      },
      ...current,
    ]);
    setItem("");
    setQuantity("50");
    setUnit("bags");
  };

  const removeRequest = (id: number) => {
    setRequests((current) => current.filter((request) => request.id !== id));
  };

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {isLoading ? (
        <div className="h-72 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse" />
      ) : (
        <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Material Request List</h3>
          <p className="mt-1 text-sm text-slate-600">Submit and manage live material requests for the current site.</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {requests.length} items
        </span>
      </div>

      <form onSubmit={addRequest} className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
        <input
          type="text"
          value={item}
          onChange={(event) => setItem(event.target.value)}
          placeholder="Material name"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-orange-300"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Qty"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-orange-300"
        />
        <select
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300"
        >
          <option value="bags">Bags</option>
          <option value="cu.m">Cu.m</option>
          <option value="MT">MT</option>
          <option value="nos">Nos</option>
          <option value="sqm">Sq.m</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {requests.map((request) => (
          <motion.article
            key={request.id}
            whileHover={{ y: -2 }}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="text-sm font-semibold text-slate-900">{request.item}</div>
              <div className="mt-1 text-xs text-slate-600">
                {request.quantity} {request.unit}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={[
                "rounded-full border px-3 py-1 text-xs font-semibold",
                request.status === "Pending"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : request.status === "Approved"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-sky-500/20 bg-sky-500/10 text-sky-300",
              ].join(" ")}>
                {request.status}
              </span>
              <button
                type="button"
                onClick={() => removeRequest(request.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </motion.article>
        ))}
      </div>
        </>
      )}
    </motion.section>
  );
}
