import type { ReactNode } from "react";

type DataGridColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

type DataGridProps<T> = {
  title: string;
  description?: string;
  columns: DataGridColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
};

function alignClass(align: DataGridColumn<unknown>["align"]) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export default function DataGrid<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  rows,
  rowKey,
  emptyMessage = "No records available.",
}: DataGridProps<T>) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-100">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={[
                      "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600",
                      alignClass(column.align),
                      column.className ?? "",
                    ].join(" ")}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row) => (
                  <tr key={rowKey(row)} className="group transition-colors hover:bg-slate-100">
                    {columns.map((column) => (
                      <td
                        key={`${rowKey(row)}-${column.key}`}
                        className={[
                          "border-b border-slate-200 px-4 py-4 text-sm text-slate-700",
                          alignClass(column.align),
                          column.className ?? "",
                        ].join(" ")}
                      >
                        {column.render ? column.render(row) : String(row[column.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-600" colSpan={columns.length}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
