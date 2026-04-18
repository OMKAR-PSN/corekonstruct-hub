import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  helper?: string;
  icon: ReactNode;
  tone?: "orange" | "success" | "info" | "warning" | "danger";
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  orange: "bg-orange-100 text-orange-700 ring-orange-200",
  success: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  info: "bg-sky-100 text-sky-700 ring-sky-200",
  warning: "bg-amber-100 text-amber-700 ring-amber-200",
  danger: "bg-rose-100 text-rose-700 ring-rose-200",
};

export default function StatCard({
  title,
  value,
  change,
  helper,
  icon,
  tone = "orange",
}: StatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, rotateX: 3, rotateY: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-start gap-4">
        <div className={["grid h-12 w-12 place-items-center rounded-2xl ring-1", toneClasses[tone]].join(" ")}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{change}</span>
          </div>
          {helper ? <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p> : null}
        </div>
      </div>
    </motion.article>
  );
}
