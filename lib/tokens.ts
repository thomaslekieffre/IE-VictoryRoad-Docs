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

  return rows
    .map((row, index) => {
      const cells = row.c?.map((cell) => {
        // Priorité à la formule si elle existe (pour les formules IMAGE)
        if (cell?.f) {
          return String(cell.f).trim();
        }
        if (cell?.v === undefined || cell.v === null) {
          return "";
        }
        // Gérer les objets
        if (typeof cell.v === "object") {
          return "";
        }
        return String(cell.v).trim();
      });

      if (!cells || !cells.length) {
        return null;
      }

      // Colonnes: Token (A), Emplacement/Location (B), PNJ/NPC (C), Photos/Pictures (D)
      // Index 0-based: A=0, B=1, C=2, D=3
      const name = cells[0] || "";
      const location = cells[1] || "";
      const npc = cells[2] || "";
      const imageUrl = cells[3] || "";

      // Ignorer l'en-tête
      if (!name || name === "Token" || name === "GUIDE TOKEN") {
        return null;
      }

      // Extraire l'URL de l'image depuis différents formats possibles
      let extractedImageUrl: string | undefined;
      if (imageUrl && imageUrl.trim()) {
        // Format markdown: ![](url) - le plus courant dans Google Sheets
        const markdownMatch = imageUrl.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/);
        if (markdownMatch && markdownMatch[1]) {
          extractedImageUrl = markdownMatch[1];
        } else {
          // Format HTML: <img src="url">
          const htmlMatch = imageUrl.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (htmlMatch && htmlMatch[1]) {
            extractedImageUrl = htmlMatch[1];
          } else {
            // Format direct URL (commence par http:// ou https://)
            const urlMatch = imageUrl.match(/(https?:\/\/[^\s\)"'\<\>]+)/);
            if (urlMatch && urlMatch[1]) {
              extractedImageUrl = urlMatch[1];
            }
          }
        }
      }
      
      // Si pas d'URL extraite, vérifier si la cellule contient une formule IMAGE
      if (!extractedImageUrl && imageUrl && imageUrl.trim()) {
        const imageFormulaMatch = imageUrl.match(/IMAGE\(["']?([^"']+)["']?\)/i);
        if (imageFormulaMatch && imageFormulaMatch[1]) {
          extractedImageUrl = imageFormulaMatch[1];
        }
      }

      return {
        id: buildId(name, index),
        name,
        color: getTokenColor(name),
        location: location || "—",
        npc: npc || "—",
        imageUrl: extractedImageUrl,
      } satisfies Token;
    })
    .filter((token): token is Token => Boolean(token));
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

