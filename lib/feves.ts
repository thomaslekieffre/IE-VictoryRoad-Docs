const SHEET_ID = "1qomleD6MQ9B-o-i_ZyWSSOlDgJgR3UoiiCrDOCeddAY";
const FEVES_GID = "1188141609";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${FEVES_GID}`;

export type Feve = {
  id: string;
  name: string;
  color: string;
  obtention: string;
  astuce: string;
};

type GvizCell = {
  v?: string | number | null;
};

type GvizRow = {
  c?: (GvizCell | null)[];
};

type GvizPayload = {
  table?: {
    rows?: GvizRow[];
  };
};

export async function fetchFeves(): Promise<Feve[]> {
  const response = await fetch(GVIZ_URL, {
    next: { revalidate: 60 * 60 }, // cache 1h
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les données Fèves");
  }

  const rawText = await response.text();
  const json = extractJson(rawText);
  const rows = json.table?.rows ?? [];

  return rows
    .map((row, index) => {
      const cells = row.c?.map((cell) => {
        if (cell?.v === undefined || cell.v === null) {
          return "";
        }
        return String(cell.v).trim();
      });

      if (!cells || !cells.length) {
        return null;
      }

      const [name, color, obtention, astuce] = cells;

      if (!name || name === "Liste des fêves" || name === "Name") {
        return null;
      }

      return {
        id: buildId(name, index),
        name,
        color: color || "Inconnu",
        obtention: obtention || "—",
        astuce: astuce || "—",
      } satisfies Feve;
    })
    .filter((feve): feve is Feve => Boolean(feve));
}

function extractJson(raw: string): GvizPayload {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Payload Google Sheets invalide");
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function buildId(label: string, index: number) {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "feve"}-${index}`;
}

