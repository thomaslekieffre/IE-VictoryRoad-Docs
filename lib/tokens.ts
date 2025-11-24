const SHEET_ID = "187WKJIEtC3CsW5UnHLaw_lNXjlyh_Q13WgDWazDK5Sc";
const TOKENS_GID = "297697533";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${TOKENS_GID}`;

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
  const response = await fetch(GVIZ_URL, {
    next: { revalidate: 60 * 60 }, // cache 1h
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les données Tokens");
  }

  const rawText = await response.text();
  const json = extractJson(rawText);
  const rows = json.table?.rows ?? [];

  const tokens: Token[] = [];

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
    const imageCell = cells[3]; // Colonne D avec formule =IMAGE()

    // Ignorer l'en-tête
    if (!name || name === "Token" || name === "GUIDE TOKEN") {
      continue;
    }

    // Extraire l'URL depuis la formule =IMAGE("URL",...)
    let extractedImageUrl: string | undefined;
    if (imageCell?.value && imageCell.value.trim()) {
      // Format: =IMAGE("URL",4,300,300) ou =IMAGE(URL,...)
      // Extraire l'URL entre guillemets ou directement après IMAGE(
      const imageMatch = imageCell.value.match(/IMAGE\(["']?([^"',\)]+)["']?/i);
      if (imageMatch && imageMatch[1]) {
        extractedImageUrl = imageMatch[1].trim();
      }
    }

    tokens.push({
      id: buildId(name, index),
      name,
      color: getTokenColor(name),
      location: location || "—",
      npc: npc || "—",
      imageUrl: extractedImageUrl,
    });
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

