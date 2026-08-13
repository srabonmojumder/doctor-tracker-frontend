interface TooltipRow {
  key: string;
  label: string;
  value: string | number;
  color: string;
}

export function ChartTooltip({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-md">
      {title && <p className="mb-1 text-xs font-medium text-muted-foreground">{title}</p>}
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-2 text-sm">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="ml-auto font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
