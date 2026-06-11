export const CHART_COLORS = {
  innovation: "#19B45B",
  marche: "#87CFB4",
  equipe: "#6366F1",
  finance: "#141414",
  execution: "#a4a4a4",
} as const;

export const PIPELINE_COLORS = {
  EN_ATTENTE: "#f3b63f",
  EN_ANALYSE: "#6366F1",
  ACCEPTE: "#19B45B",
  REFUSE: "#ef5b78",
} as const;

export const STADE_BAR_COLOR = (statut: string): string => {
  const map: Record<string, string> = {
    VALIDE: "#19B45B",
    EN_COURS: "#6366F1",
    SOUMIS: "#8183F4",
    BLOQUE: "#f3b63f",
    REJETE: "#ef5b78",
    BROUILLON: "#a4a4a4",
    DEBLOQUE: "#6366F1",
    EN_REVISION: "#f3b63f",
  };

  return map[statut] ?? "#e2e2dc";
};
