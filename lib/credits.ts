export type Contributor = {
  name?: string; // si vide, on utilisera le nom retourné par l'API Discord
  role: "creator" | "co-creator" | "contributor";
  discordId: string;
  avatarUrl?: string;
};

// Créateurs du site
export const creators: Contributor[] = [
  {
    name: "",
    role: "creator",
    discordId: "1143105558740746363",
  },
  {
    name: "",
    role: "co-creator",
    discordId: "1104360731794747454",
  },
  {
    name: "",
    role: "co-creator",
    discordId: "953673911558627398",
  },
];

// Participants aux informations générales
export const contributors: Contributor[] = [
  { name: "", role: "contributor", discordId: "290928086806167552" },
  { name: "", role: "contributor", discordId: "996537074482151554" },
  { name: "", role: "contributor", discordId: "1018146651073957931" },
  { name: "", role: "contributor", discordId: "189030490177536009" },
  { name: "", role: "contributor", discordId: "481954285970522119" },
  { name: "", role: "contributor", discordId: "1234809303219834914" },
  { name: "", role: "contributor", discordId: "320477336338169856" },
  { name: "", role: "contributor", discordId: "626086169461129227" },
  { name: "", role: "contributor", discordId: "807700447884214364" },
  { name: "", role: "contributor", discordId: "304024933288378370" },
  { name: "", role: "contributor", discordId: "251737227548164096" },
  { name: "", role: "contributor", discordId: "526101484895731723" },
  { name: "", role: "contributor", discordId: "246262989412368385" },
  { name: "", role: "contributor", discordId: "331710190095302657" },
  { name: "..", role: "contributor", discordId: "974720250899742850" },
  { name: "", role: "contributor", discordId: "711324528768319558" },
  { name: "", role: "contributor", discordId: "404396925282942996" },
  { name: "", role: "contributor", discordId: "340941086572675083" },
  { name: "", role: "contributor", discordId: "542706628391075840" },
  { name: "", role: "contributor", discordId: "285007402007265280" },
];


type DiscordUser = {
  id: string;
  username: string;
  global_name?: string;
  discriminator?: string;
  avatar?: string;
};

async function fetchDiscordUser(userId: string): Promise<DiscordUser | null> {
  if (!userId) return null;

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    return null;
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      next: { revalidate: 3600 }, // Cache 1h
    });

    if (response.ok) {
      return (await response.json()) as DiscordUser;
    }
  } catch (error) {
    console.error(`Erreur Discord API pour ${userId}:`, error);
  }

  return null;
}

function buildAvatarUrl(userId: string, user?: DiscordUser | null): string {
  if (user?.avatar) {
    const extension = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.${extension}?size=256`;
  }

  if (user?.discriminator) {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;
  }

  // Fallback statique basé sur l'ID
  return `https://cdn.discordapp.com/embed/avatars/${(parseInt(userId, 10) >> 22) % 5}.png`;
}

// Fonction pour enrichir les contributeurs avec leurs avatars + noms Discord
export async function enrichContributors(
  entries: Contributor[],
): Promise<Array<Required<Contributor>>> {
  return Promise.all(
    entries.map(async (entry) => {
      const user = await fetchDiscordUser(entry.discordId);

      const computedName =
        entry.name ||
        user?.global_name ||
        user?.username ||
        `Utilisateur ${entry.discordId}`;

      const avatarUrl =
        entry.avatarUrl ||
        buildAvatarUrl(entry.discordId, user);

      return {
        ...entry,
        name: computedName,
        avatarUrl,
      };
    }),
  );
}

