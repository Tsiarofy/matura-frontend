import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface ScoreRadarChartProps {
  score: {
    score_innovation: number;
    score_marche: number;
    score_equipe: number;
    score_finance: number;
    score_execution: number;
    score_global?: number | null;
  } | null;
  className?: string;
}

// ─── Palette de couleurs (Design System 1.4 / 1.5) ───────────────────────────

const DIMENSIONS = [
  { key: "score_innovation", label: "Innovation", color: "#6AD972" },
  { key: "score_marche", label: "Marché", color: "#87CFB4" },
  { key: "score_equipe", label: "Équipe", color: "#C8F2CB" },
  { key: "score_finance", label: "Finance", color: "#3D3D3D" },
  { key: "score_execution", label: "Exécution", color: "#E5E5E5" },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[var(--color-border)] px-3 py-2 rounded-[var(--radius-sm)] shadow-md text-[12px] font-medium">
      <p>
        {d.name} : {d.value}/100
      </p>
    </div>
  );
}

export function ScoreRadarChart({ score, className }: ScoreRadarChartProps) {
  if (!score) {
    return (
      <div
        className={cn(
          "flex h-[220px] flex-col items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-bg-shell)] border border-[var(--color-border)] text-center px-4",
          className,
        )}
      >
        <p className="text-[12px] text-[var(--color-text-muted)]">
          Aucun score disponible
        </p>
      </div>
    );
  }

  const data = DIMENSIONS.map((d) => ({
    name: d.label,
    value: (score as any)[d.key] as number,
    color: d.color,
  }));

  return (
    <div className={cn("flex flex-col items-center gap-6 w-full", className)}>
      <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={1.25}
            >
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[32px] font-bold text-[var(--color-text-primary)] leading-none">
            {score.score_global ?? "—"}
          </span>
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1">
            SCORE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4">
        {DIMENSIONS.map((d) => (
          <div key={d.key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
