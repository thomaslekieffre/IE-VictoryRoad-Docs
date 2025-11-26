// REMPLACE CES VALEURS PAR CELLES DE TON GOOGLE SHEET
const SHEET_ID = "11kA7nvhB4bl99ttgDQ8SOHDG2ocXvXyY_YZRRLyBWwA";
const PLAYERS_GID = "1730771214";

const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${PLAYERS_GID}`;

export type PlayerStat = {
  id: string;
  name: string;
  image: string;
  element: string; // Fire, Wind, Wood, Earth, Void
  position: string; // GK, DF, MF, FW
  rank?: string;
  stats?: {
    kick?: number;
    body?: number;
    control?: number;
    guard?: number;
    speed?: number;
    stamina?: number;
    catch?: number;
  };
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

function extractJson(raw: string): GvizPayload {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Payload Google Sheets invalide");
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function extractImageUrl(raw: string): string {
  if (!raw) return "";
  // Gère le format =IMAGE("url")
  if (raw.startsWith("=IMAGE")) {
    const match = raw.match(/"(https?:\/\/[^"]+)"/);
    return match ? match[1] : "";
  }
  // Gère le cas où c'est juste l'URL
  if (raw.startsWith("http")) {
    return raw;
  }
  return "";
}

export async function fetchPlayerStats(): Promise<PlayerStat[]> {
  try {
    const response = await fetch(GVIZ_URL, {
      next: { revalidate: 600 }, // Mise à jour toutes les 10 minutes (600 secondes)
    });

    if (!response.ok) {
      console.error("Erreur fetch Google Sheets:", response.statusText);
      return [];
    }

    const rawText = await response.text();
    const jsonPayload = extractJson(rawText);
    const rows = jsonPayload.table?.rows ?? [];

    return rows
      .map((row, index) => {
        const cells = row.c?.map((cell) => (cell?.v === undefined || cell?.v === null ? "" : String(cell.v).trim())) ?? [];

        // Mapping des colonnes basé sur ton fichier Excel
        // 0: Image, 1: ImageURL, 2: Name, 3: Position, 4: Element, 5: Kick, 6: Control, 
        // 7: Technique, 8: Pressure(Guard), 9: Physical(Body), 10: Agility(Speed), 11: Intelligence(Stamina), ... 17: GKStats(Catch)
        
        // Sécurité si la ligne est vide
        if (cells.length < 3) return null;

        const name = cells[2];
        if (!name || name === "Name" || name === "Nom") return null; // Skip header

        const imageRaw = cells[0] || cells[1];
        
        return {
          id: String(index + 1),
          name: name,
          image: extractImageUrl(imageRaw),
          position: cells[3] || "Unknown",
          element: cells[4] || "Unknown",
          rank: "B", // Pas de colonne Rank identifiée clairement, défaut B
          stats: {
            kick: Number(cells[5]) || 0,
            control: Number(cells[6]) || 0,
            guard: Number(cells[8]) || 0, // Pressure
            body: Number(cells[9]) || 0, // Physical
            speed: Number(cells[10]) || 0, // Agility
            stamina: Number(cells[11]) || 0, // Intelligence
            catch: Number(cells[17]) || 0, // GKStats
          },
        };
      })
      .filter((p): p is PlayerStat => p !== null);
      
  } catch (error) {
    console.error("Erreur lors de la récupération des stats joueurs:", error);
    return [];
  }
}


export type StatThresholds = Record<string, number[]>;

export function calculateStatThresholds(players: PlayerStat[]): StatThresholds {
  const statsToTrack = ["kick", "body", "control", "guard", "speed", "stamina", "catch"];
  const values: Record<string, number[]> = {};

  // Initialize arrays
  statsToTrack.forEach((stat) => {
    values[stat] = [];
  });

  // Collect all values
  players.forEach((player) => {
    if (!player.stats) return;
    statsToTrack.forEach((stat) => {
      // @ts-ignore
      const val = player.stats[stat];
      if (typeof val === "number") {
        values[stat].push(val);
      }
    });
  });

  const thresholds: StatThresholds = {};

  // Calculate percentiles based on user request:
  // Vert: 100-70% (Bottom 30%) -> p30
  // Bleu: 69-50% (Next 20%) -> p50
  // Violet: 49-30% (Next 20%) -> p70
  // Jaune: 29-15% (Next 15%) -> p85
  // Orange: 14% (Top 14%) -> p86
  statsToTrack.forEach((stat) => {
    const sorted = values[stat].sort((a, b) => a - b);
    if (sorted.length === 0) {
      thresholds[stat] = [0, 0, 0, 0];
      return;
    }

    const p31 = sorted[Math.floor(sorted.length * 0.31)]; // Cutoff for Green (Bottom ~30%)
    const p51 = sorted[Math.floor(sorted.length * 0.51)]; // Cutoff for Blue (Bottom ~50%)
    const p71 = sorted[Math.floor(sorted.length * 0.71)]; // Cutoff for Violet (Bottom ~70%)
    const p86 = sorted[Math.floor(sorted.length * 0.86)]; // Cutoff for Yellow (Bottom ~86%)

    thresholds[stat] = [p31, p51, p71, p86];
  });

  return thresholds;
}

