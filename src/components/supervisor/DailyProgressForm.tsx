"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CloudSun, MessageSquareWarning, Send } from "lucide-react";
import { getProgressSeed, type ProgressNote } from "../../lib/api/labor";

type DailyProgressFormProps = {
  projectName: string;
};

export default function DailyProgressForm({ projectName }: DailyProgressFormProps) {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [stage, setStage] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [issues, setIssues] = useState("");
  const [notes, setNotes] = useState<ProgressNote[]>([]);
  const [weatherOptions, setWeatherOptions] = useState<string[]>([]);
  const [stageOptions, setStageOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void getProgressSeed().then((seed) => {
      if (!isMounted) {
        return;
      }

      setWeatherOptions(seed.weatherOptions);
      setStageOptions(seed.stageOptions);
      setNotes(seed.notes);
      setWeather(seed.weatherOptions[0] ?? "");
      setStage(seed.stageOptions[0] ?? "");
      setDate(new Date().toISOString().split("T")[0]);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const canSubmit = workDone.trim().length > 10;

  const latestSummary = useMemo(() => notes[0], [notes]);

  if (isLoading) {
    return <div className="h-[32rem] rounded-3xl border border-slate-200 bg-white animate-pulse" />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setNotes((current) => [
      {
        id: Date.now(),
        date,
        weather,
        stage,
        workDone: workDone.trim(),
        issues: issues.trim() || "No issues recorded.",
      },
      ...current,
    ]);

    setWorkDone("");
    setIssues("");
  };

  return (
    <motion.section
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Daily Progress Report</h3>
          <p className="mt-1 text-sm text-slate-600">Operational update for {projectName}.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          Mandatory
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Date</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <CalendarDays className="h-4 w-4 text-orange-600" />
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Weather</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <CloudSun className="h-4 w-4 text-orange-600" />
              <select
                value={weather}
                onChange={(event) => setWeather(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              >
                {weatherOptions.map((option) => (
                  <option key={option} value={option} className="bg-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Current Stage</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Send className="h-4 w-4 text-orange-600" />
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              >
                {stageOptions.map((option) => (
                  <option key={option} value={option} className="bg-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Work Done Today</span>
            <textarea
              value={workDone}
              onChange={(event) => setWorkDone(event.target.value)}
              rows={5}
              placeholder="Describe the completed work in a precise operational note."
              className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-orange-300"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Issues / Problems</span>
            <div className="relative">
              <MessageSquareWarning className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-orange-600" />
              <textarea
                value={issues}
                onChange={(event) => setIssues(event.target.value)}
                rows={5}
                placeholder="Optional issues, blockers, equipment failures, or safety concerns."
                className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-orange-300"
              />
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Daily Progress
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Latest Update</h4>
            <p className="text-xs text-slate-600">Last submitted record on screen.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
            {latestSummary?.date}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-3">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Weather</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{latestSummary?.weather}</div>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Stage</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{latestSummary?.stage}</div>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-600">Entries</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{notes.length} stored</div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          layout
          className="mt-5 space-y-3"
        >
          {notes.map((entry) => (
            <motion.article
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{entry.stage}</div>
                <div className="text-xs text-slate-400">{entry.date} · {entry.weather}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{entry.workDone}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Issues: {entry.issues}</p>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
