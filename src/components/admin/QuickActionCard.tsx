import type { ReactNode } from "react";
import { motion } from "framer-motion";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
};

export default function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  active = false,
}: QuickActionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={[
        "flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors",
        active
          ? "border-orange-200 bg-white"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-orange-600 ring-1 ring-slate-200">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </motion.button>
  );
}
