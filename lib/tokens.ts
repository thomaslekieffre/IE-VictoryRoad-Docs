const SHEET_ID = "187WKJIEtC3CsW5UnHLaw_lNXjlyh_Q13WgDWazDK5Sc";
const TOKENS_GID = "297697533";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${TOKENS_GID}`;
const EMBED_HTML_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${TOKENS_GID}&rm=embedded`;

export type Token = {
  id: string;
  name: string;
  color: string;
  location: string;
  npc: string;
  imageUrl?: string;
};

function getTokenColor(name: string): string {
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (normalized.includes("gratitude")) return "Bleu";
  if (normalized.includes("reve") || normalized.includes("dream")) return "Violet";
  if (normalized.includes("objectif") || normalized.includes("objective")) return "Vert";
  if (normalized.includes("amour") || normalized.includes("love")) return "Rose";
  if (normalized.includes("vitalite") || normalized.includes("vitality")) return "Rouge";
  if (normalized.includes("amitie") || normalized.includes("friendship")) return "Jaune";
  if (normalized.includes("passion")) return "Orange";
  
  return "Normal";
}

type GvizCell = {
  v?: string | number | null;
  f?: string; // formule
};

type GvizRow = {
  c?: (GvizCell | null)[];
};

type GvizPayload = {
  table?: {
    rows?: GvizRow[];
  };
};

export async function fetchTokens(): Promise<Token[]> {
  const [gvizResponse, htmlImageIndex] = await Promise.all([
    fetch(GVIZ_URL, {
      next: { revalidate: 10 * 60, tags: ["tokens"] }, // cache 10min, revalidable
    }),
    fetchTokenImageIndex(),
  ]);

  if (!gvizResponse.ok) {
    throw new Error("Impossible de récupérer les données Tokens");
  }

  const rawText = await gvizResponse.text();
  const json = extractJson(rawText);
  const rows = json.table?.rows ?? [];

  const tokens: Token[] = [];
  let dataRowIndex = 0;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    // Extraire les cellules brutes pour accéder aux formules
    const rawCells = row.c || [];
    
    const cells = rawCells.map((cell) => {
      // Priorité à la formule si elle existe (pour les formules IMAGE)
      if (cell?.f) {
        return { value: String(cell.f).trim(), isFormula: true };
      }
      if (cell?.v === undefined || cell.v === null) {
        return { value: "", isFormula: false };
      }
      // Gérer les objets
      if (typeof cell.v === "object") {
        return { value: "", isFormula: false };
      }
      return { value: String(cell.v).trim(), isFormula: false };
    });

    if (!cells || !cells.length) {
      continue;
    }

    // Colonnes: Token (A), Emplacement/Location (B), PNJ/NPC (C), Photos/Pictures (D) avec =IMAGE()
    // Index 0-based: A=0, B=1, C=2, D=3
    const name = cells[0]?.value || "";
    const location = cells[1]?.value || "";
    const npc = cells[2]?.value || "";
    const imageUrl = extractImageUrl(rawCells[3]) ?? htmlImageIndex[dataRowIndex];

    // Ignorer l'en-tête
    if (!name || name === "Token" || name === "GUIDE TOKEN") {
      continue;
    }

    tokens.push({
      id: buildId(name, index),
      name,
      color: getTokenColor(name),
      location: location || "—",
      npc: npc || "—",
      imageUrl,
    });

    dataRowIndex += 1;
  }

  return tokens;
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

  return `${slug || "token"}-${index}`;
}

async function fetchTokenImageIndex(): Promise<(string | undefined)[]> {
  try {
    const response = await fetch(EMBED_HTML_URL, {
      next: { revalidate: 10 * 60, tags: ["tokens"] },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    return parseImageColumn(html);
  } catch {
    return [];
  }
}

function parseImageColumn(html: string): (string | undefined)[] {
  const tableMatch = html.match(/<table[^>]+class="waffle"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) {
    return [];
  }

  const rows = Array.from(
    tableMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi),
    (match) => match[1],
  );

  const images: (string | undefined)[] = [];

  for (const row of rows) {
    const cells = Array.from(
      row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi),
      (match) => match[1],
    );

    const labelCell = stripHtml(cells[0] ?? "");
    if (!labelCell || /token/i.test(labelCell)) {
      continue; // ignorer les en-têtes et lignes vides
    }

    const imageCell = cells[3] ?? "";
    const imgMatch = imageCell.match(/<img[^>]+src="([^"]+)"/i);
    if (imgMatch && imgMatch[1]) {
      images.push(sanitizeUrl(decodeHtml(imgMatch[1])));
    } else {
      images.push(undefined);
    }
  }

  return images;
}

function extractImageUrl(cell?: GvizCell | null): string | undefined {
  if (!cell) {
    return undefined;
  }

  if (typeof cell.f === "string") {
    const urlFromFormula = extractUrlFromString(cell.f);
    if (urlFromFormula) {
      return urlFromFormula;
    }
  }

  if (typeof cell.v === "string") {
    const urlFromValue = extractUrlFromString(cell.v);
    if (urlFromValue) {
      return urlFromValue;
    }
  }

  if (cell.v && typeof cell.v === "object") {
    const serialized = JSON.stringify(cell.v);
    const match = serialized.match(/https?:\\?\/\\?\/[^"\\]+/i);
    if (match && match[0]) {
      return sanitizeUrl(match[0].replace(/\\\//g, "/"));
    }
  }

  return undefined;
}

function extractUrlFromString(raw: string): string | undefined {
  const formulaMatch = raw.match(/IMAGE\((["']?)([^"',)]+)\1/i);
  if (formulaMatch && formulaMatch[2]) {
    return sanitizeUrl(formulaMatch[2]);
  }

  const directMatch = raw.match(/https?:\/\/[^\s)",]+/i);
  if (directMatch && directMatch[0]) {
    return sanitizeUrl(directMatch[0]);
  }

  return sanitizeUrl(raw);
}

function sanitizeUrl(url: string): string | undefined {
  const cleaned = url.trim().replace(/^"|"$/g, "");
  if (!cleaned) {
    return undefined;
  }

  if (!/^https?:\/\//i.test(cleaned)) {
    return undefined;
  }

  return cleaned;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(value: string): string {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).trim();
}

