import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { type StadeDashboard } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

// ─── Couleurs par statut ───────────────────────────────────────────────────────

const STATUT_COLOR: Record<string, string> = {
  VALIDE: "#6AD972",
  SOUMIS: "#87CFB4",
  EN_REVISION: "#F87171",
  BROUILLON: "#E5E5E5",
  DEBLOQUE: "#C8F2CB",
  VERROUILLE: "#F5F5F5",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[var(--color-border)] px-3 py-2 rounded-[var(--radius-sm)] shadow-md text-[12px] font-medium">
      <p className="text-[var(--color-text-muted)] mb-1">Stade {label}</p>
      <p className="text-[var(--color-text-primary)]">{d.value}% Complété</p>
    </div>
  );
}

// ─── Légende manuelle ─────────────────────────────────────────────────────────

const LEGENDE = [
  { statut: "VALIDE", label: "Validé" },
  { statut: "SOUMIS", label: "En évaluation" },
  { statut: "EN_REVISION", label: "En révision" },
  { statut: "BROUILLON", label: "Brouillon" },
  { statut: "DEBLOQUE", label: "Débloqué" },
];

// ─── Composant principal ──────────────────────────────────────────────────────

interface ProjectProgressChartProps {
  stades: StadeDashboard[];
  className?: string;
}

export function ProjectProgressChart({
  stades,
  className,
}: ProjectProgressChartProps) {
  if (!stades.length) {
    return (
      <div
        className={cn(
          "flex h-[240px] items-center justify-center rounded-[var(--radius)] bg-[var(--color-bg-shell)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-muted)]",
          className,
        )}
      >
        Aucune donnée disponible.
      </div>
    );
  }

  const data = stades.map((s) => ({
    name: `S${s.numero}`,
    label: s.label,
    completion: s.completion_pct,
    statut: s.statut,
  }));

  return (
    <div className={cn("space-y-4", className)}>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, bottom: 20, left: -20 }}
            barSize={32}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="0"
              stroke="var(--color-bg-shell)"
            />
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 11,
                fill: "var(--color-text-muted)",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "var(--color-text-disabled)" }}
              axisLine={false}
              tickLine={false}
              tickCount={5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--color-bg-shell)", opacity: 0.4 }}
              offset={20}
            />
            <Bar
              dataKey="completion"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            >
              {data.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={
                    STATUT_COLOR[entry.statut] ?? "var(--color-chart-inactive)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-[var(--color-bg-shell)]">
        {LEGENDE.filter(({ statut }) =>
          data.some((d) => d.statut === statut),
        ).map(({ statut, label }) => (
          <div key={statut} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: STATUT_COLOR[statut] }}
            />
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
