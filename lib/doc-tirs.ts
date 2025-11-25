const SHEET_ID = "1pfHZJSLMyOIpkpXvbOplBJwiHj2TgQWZaEV0UhbX0ao";
const OFFENSIVE_GID = "0";

const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${OFFENSIVE_GID}`;

export type TirsTechnique = {
  id: string;
  nameFr: string;
  nameEn: string;
  nameJp: string;
  element: string;
  off: number;
  shotBlock: string;
  shotType: string;
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

export async function fetchTirsTechniques(): Promise<TirsTechnique[]> {
  const response = await fetch(GVIZ_URL, {
    next: { revalidate: 10 * 60 }, // cache 10min
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer la doc Tirs");
  }

  const rawText = await response.text();
  const json = extractJson(rawText);
  const rows = json.table?.rows ?? [];
  const columnIndexes = buildColumnIndexes(json.table?.cols ?? []);

  return rows
    .map((row, index) => {
      const cells = row.c?.map((cell) => {
        if (!cell?.v && cell?.v !== 0) return "";
        return String(cell.v).trim();
      });

      if (!cells?.length) return null;

      const nameFr = pickValue(cells, columnIndexes.nameFr);

      if (!nameFr || normalizeLabel(nameFr) === "nom francais") {
        return null;
      }

      const technique: TirsTechnique = {
        id: buildId(nameFr, index),
        nameFr,
        nameEn: pickValue(cells, columnIndexes.nameEn),
        nameJp: pickValue(cells, columnIndexes.nameJp),
        element: pickValue(cells, columnIndexes.element) || "Inconnu",
        off: toNumber(pickValue(cells, columnIndexes.off)),
        shotBlock: pickValue(cells, columnIndexes.shotBlock) || "—",
        shotType: pickValue(cells, columnIndexes.shotType) || "—",
        location: pickLocation(cells, columnIndexes.location),
        price: pickValue(cells, columnIndexes.price) || "—",
      };

      return technique;
    })
    .filter((x): x is TirsTechnique => Boolean(x));
}

function extractJson(raw: string): GvizPayload {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Payload Google Sheets invalide");
  return JSON.parse(raw.slice(start, end + 1));
}

function buildColumnIndexes(cols: GvizColumn[]) {
  const getIndex = (keywords: string[], fallback: number) => {
    const index = cols.findIndex((col) => {
      const label = normalizeLabel(col.label ?? "");
      return keywords.some((kw) => label.includes(kw));
    });
    return index >= 0 ? index : fallback;
  };

  return {
    nameFr: getIndex(["r","nom", "francais", "français"], 0),
    nameEn: getIndex(["anglais", "english"], 1),
    nameJp: getIndex(["japon", "japan"], 2),
    element: getIndex(["element"], 3),
    off: getIndex(["off", "att"], 4),
    shotBlock: getIndex(["blocage", "block", "shot"], 5),

    shotType: getIndex(
      ["tir contre", "counter", "long shot", "tir long"],
      6
    ),

    location: getIndex(["emplacement", "location"], 7),
    price: getIndex(["prix", "price"], 8),
  };
}

function pickValue(cells: string[] | undefined, index: number) {
  if (!cells || index < 0 || index >= cells.length) return "";
  return cells[index] ?? "";
}

function pickLocation(cells: string[] | undefined, startIndex: number) {
  if (!cells) return "—";
  const safeStart = startIndex >= 0 ? startIndex : 6;
  const direct = pickValue(cells, safeStart);
  if (direct) return direct;
  for (let i = safeStart; i < cells.length; i++) {
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
  const num = Number.parseFloat(raw.replace(",", "."));
  return Number.isFinite(num) ? num : 0;
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
