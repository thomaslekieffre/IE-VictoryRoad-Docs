const SHEET_ID = "19Nl2dAGQ0r05DyZUDnp26SjfOoVZ5vB1poFrENzXUmQ";
const DEFENSIVE_GID = "1821570578";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${DEFENSIVE_GID}`;

export type DefensiveTechnique = {
  id: string;
  nameFr: string;
  nameEn: string;
  nameJp: string;
  element: string;
  def: number;
  shotBlock: string;
  location: string;
  price: string;
};

type GvizCell = {
  v?: string | number | null;
};

type GvizRow = {
  c?: (GvizCell | null)[];
};

type GvizColumn = {
  label?: string | null;
};

type GvizPayload = {
  table?: {
    rows?: GvizRow[];
    cols?: GvizColumn[];
  };
};

export async function fetchDefensiveTechniques(): Promise<DefensiveTechnique[]> {
  const response = await fetch(GVIZ_URL, {
    next: { revalidate: 60 * 60 }, // cache 1h
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer la doc Défensive");
  }

  const rawText = await response.text();
  const json = extractJson(rawText);
  const rows = json.table?.rows ?? [];
  const columnIndexes = buildColumnIndexes(json.table?.cols ?? []);

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

      const nameFr = pickValue(cells, columnIndexes.nameFr);

      if (!nameFr || normalizeLabel(nameFr) === "nom francais") {
        return null;
      }

      const technique: DefensiveTechnique = {
        id: buildId(nameFr, index),
        nameFr,
        nameEn: pickValue(cells, columnIndexes.nameEn),
        nameJp: pickValue(cells, columnIndexes.nameJp),
        element: pickValue(cells, columnIndexes.element) || "Inconnu",
        def: toNumber(pickValue(cells, columnIndexes.def)),
        shotBlock: pickValue(cells, columnIndexes.shotBlock) || "—",
        location: pickLocation(cells, columnIndexes.location),
        price: pickValue(cells, columnIndexes.price) || "—",
      };

      return technique;
    })
    .filter((technique): technique is DefensiveTechnique => Boolean(technique));
}

function extractJson(raw: string): GvizPayload {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Payload Google Sheets invalide");
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function buildColumnIndexes(cols: GvizColumn[]) {
  const getIndex = (keywords: string[], fallback: number) => {
    const index = cols.findIndex((col) => {
      const label = normalizeLabel(col.label ?? "");
      return keywords.some((keyword) => label.includes(keyword));
    });
    return index >= 0 ? index : fallback;
  };

  return {
    nameFr: getIndex(["nom", "francais", "français"], 0),
    nameEn: getIndex(["anglais", "english"], 1),
    nameJp: getIndex(["japon", "japan"], 2),
    element: getIndex(["element"], 3),
    def: getIndex(["def"], 4),
    shotBlock: getIndex(["blocage", "block", "shot"], 5),
    location: getIndex(["emplacement", "location"], 6),
    price: getIndex(["prix", "price"], 7),
  };
}

function pickValue(cells: string[] | undefined, index: number) {
  if (!cells || index < 0 || index >= cells.length) {
    return "";
  }
  return cells[index] ?? "";
}

function pickLocation(cells: string[] | undefined, startIndex: number) {
  if (!cells) return "—";
  const safeStart = startIndex >= 0 ? startIndex : 6;
  const directValue = pickValue(cells, safeStart);
  if (directValue) return directValue;
  for (let i = safeStart; i < cells.length; i += 1) {
    if (cells[i]) return cells[i];
  }
  return "—";
}

function buildId(label: string, index: number) {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "technique"}-${index}`;
}

function toNumber(raw: string) {
  if (!raw) return 0;
  const value = Number.parseFloat(raw.replace(",", "."));
  return Number.isFinite(value) ? value : 0;
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

