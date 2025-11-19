const SHEET_ID = "1Ec67gsprTu7LwHlPZ2jn6PKJcANMCxlblQ3HQvYTM0U";
const HEROES_GID = "1891329663";
const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${HEROES_GID}`;

const PASSIVE_BOUNDARY_TERMS = [
  "Quand",
  "Après",
  "Jusqu'",
  "En gagnant",
  "En perdant",
  "En cas",
  "En gagnant un",
  "En gagnant une",
  "En gagnant une affrontement",
  "En gagnant un affrontement",
  "Taux",
  "Si",
  "Au",
  "Lorsqu",
  "Avant",
  "Après récupération",
  "Après un",
  "Après une",
  "Après mouvement",
];

const STYLE_LABELS: Record<string, string> = {
  breche: "Brèche",
  "brèche": "Brèche",
  violence: "Violence",
  tension: "Tension",
  justice: "Justice",
  lien: "Lien",
  contre: "Contre",
  brutale: "Brutale",
  support: "Support",
  tactique: "Tactique",
};

const SENTENCE_SPLIT_REGEX = /(?<!\d)\.(?!\d)/g;
const PASSIVE_KEYWORD_REGEX = new RegExp(
  `\\s+(?=(?:${PASSIVE_BOUNDARY_TERMS.map(escapeRegex).join("|")})\\b)`,
  "gi",
);

export type HeroS1 = {
  id: string;
  name: string;
  color: string;
  constellation: string;
  passives: string[];
  style: string;
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

export async function fetchHeroesS1Data(): Promise<HeroS1[]> {
  const response = await fetch(GVIZ_URL, {
    next: { revalidate: 60 * 60 }, // 1h cache pour éviter le spam
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les données Héros S1");
  }

  const rawText = await response.text();
  const jsonPayload = extractJson(rawText);

  const rows = jsonPayload.table?.rows ?? [];

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

      if (!cells[0] || cells[0] === "Héros") {
        return null;
      }

      const [name, color, constellation, _condition, passivesRaw, style] = cells;
      return {
        id: buildId(name, index),
        name,
        color,
        constellation,
        passives: formatPassives(passivesRaw),
        style: normalizeStyle(style),
      } satisfies HeroS1;
    })
    .filter((hero): hero is HeroS1 => Boolean(hero));
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

  return `${slug || "hero"}-${index}`;
}

function formatPassives(raw: string) {
  if (!raw) {
    return [];
  }

  const normalized = raw.replace(/\s+/g, " ").trim();
  const withBoundaries = PASSIVE_BOUNDARY_TERMS.reduce((text, keyword) => {
    const pattern = new RegExp(`(?<![.;])\\s+(?=${escapeRegex(keyword)}\\b)`, "gi");
    return text.replace(pattern, ". ");
  }, normalized);

  const coarseSegments = withBoundaries
    .split(SENTENCE_SPLIT_REGEX)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const sentences = coarseSegments.flatMap((segment) => {
    const withMarkers = segment.replace(PASSIVE_KEYWORD_REGEX, "|||");
    return withMarkers.split("|||").map((part) => part.trim());
  });

  const cleaned = sentences
    .map((sentence) =>
      sentence
        .replace(/^[•\-]/, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .map((sentence) => {
      const needsDot = !/[.%)]$/.test(sentence);
      return needsDot ? `${sentence}.` : sentence;
    });

  return Array.from(new Set(cleaned));
}

function normalizeStyle(style: string) {
  if (!style) return "Inconnu";
  const normalized = style
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (STYLE_LABELS[normalized]) {
    return STYLE_LABELS[normalized];
  }

  return style.charAt(0).toUpperCase() + style.slice(1).toLowerCase();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

