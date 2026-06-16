export const CHART_COLORS = {
  innovation: "#41A677",
  equipe: "#1BA8A0",
  marche: "#f3b63f",
  execution: "#A6E3E1",
  finance: "#333333",
} as const;

export const PIPELINE_COLORS = {
  EN_ATTENTE: "#f3b63f",
  EN_ANALYSE: "#1BA8A0",
  ACCEPTE: "#41A677",
  REFUSE: "#DC2626",
} as const;

export const STADE_BAR_COLOR = (statut: string): string => {
  const map: Record<string, string> = {
    VALIDE: "#41A677",
    EN_COURS: "#1BA8A0",
    SOUMIS: "#6f74f7",
    BLOQUE: "#f3b63f",
    REJETE: "#DC2626",
    BROUILLON: "#a4a4a4",
    DEBLOQUE: "#1BA8A0",
    EN_REVISION: "#f3b63f",
  };

  return map[statut] ?? "#e2e2dc";
};
