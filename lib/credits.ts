export type Contributor = {
  name: string;
  role: "creator" | "co-creator" | "contributor";
  discordId: string;
  avatarUrl?: string;
};

// Créateurs du site
export const creators: Contributor[] = [
  {
    name: "Thomas",
    role: "creator",
    discordId: "1143105558740746363",
  },
  {
    name: "Xemhai",
    role: "co-creator",
    discordId: "1104360731794747454",
  },
  {
    name: "Babykazee",
    role: "co-creator",
    discordId: "953673911558627398",
  },
];

// Participants aux informations générales
// Ajoutez les contributeurs ici au fur et à mesure
export const contributors: Contributor[] = [
  // Exemple :
  // {
  //   name: "Nom du contributeur",
  //   role: "contributor",
  //   discordId: "123456789012345678",
  // },
];


export async function getDiscordAvatarUrl(
  userId: string,
): Promise<string | null> {
  if (!userId) return null;

  // Option 1: Utiliser l'API Discord avec un bot token (si disponible)
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (botToken) {
    try {
      const response = await fetch(
        `https://discord.com/api/v10/users/${userId}`,
        {
          headers: {
            Authorization: `Bot ${botToken}`,
          },
          next: { revalidate: 3600 }, // Cache 1h
        },
      );

      if (response.ok) {
        const user = await response.json();
        if (user.avatar) {
          // Avatar personnalisé
          const extension = user.avatar.startsWith("a_") ? "gif" : "png";
          return `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.${extension}?size=256`;
        } else {
          // Avatar par défaut (utilise le discriminator)
          const discriminator = user.discriminator || "0";
          return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`;
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'avatar Discord pour ${userId}:`, error);
    }
  }

  // Option 2: Fallback - utiliser l'avatar par défaut Discord
  return `https://cdn.discordapp.com/embed/avatars/${(parseInt(userId) >> 22) % 5}.png`;
}

// Fonction pour enrichir les contributeurs avec leurs avatars
export async function enrichContributors(
  contributors: Contributor[],
): Promise<Array<Contributor & { avatarUrl: string }>> {
  return Promise.all(
    contributors.map(async (contributor) => {
      const avatarUrl =
        contributor.avatarUrl ||
        (await getDiscordAvatarUrl(contributor.discordId)) ||
        `https://cdn.discordapp.com/embed/avatars/0.png`;

      return {
        ...contributor,
        avatarUrl,
      };
    }),
  );
}

