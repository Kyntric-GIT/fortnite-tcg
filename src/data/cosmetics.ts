import type { CosmeticCard } from "../types/card";

// Slurp Jonesy data and selectable style labels are based on its Fortnite.GG listing.
// Image endpoints are served by Fortnite.GG; keep the source attribution visible in the UI.
export const cosmeticCards: CosmeticCard[] = [
  {
    id: "slurp-jonesy",
    name: "Slurp Jonesy",
    category: "outfit",
    rarity: "epic",
    series: "slurp",
    description: "Slurp up and ship out. Reactive: the head transforms with higher shields.",
    chapter: 2,
    season: 2,
    releaseDate: "2020-03-20",
    releaseType: "item-shop",
    sourceUrl: "https://fortnite.gg/cosmetics?id=248&type=outfit",
    styles: [
      {
        id: "reactive",
        name: "Reactive",
        image: "https://fortnite.gg/img/items/248/style-1.jpg",
      },
      {
        id: "monster",
        name: "Monster",
        image: "https://fortnite.gg/img/items/248/style-2.jpg",
      },
      {
        id: "base",
        name: "Base",
        image: "https://fortnite.gg/img/items/248/style-3.jpg",
      },
      {
        id: "blob-head",
        name: "Blob Head",
        image: "https://fortnite.gg/img/items/248/style-4.jpg",
      },
    ],
  },
];

export const rarityLabels: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
  exotic: "Exotic",
  promo: "Promo",
};

export const seriesLabels: Record<string, string> = {
  crew: "Crew",
  shadow: "Shadow",
  lava: "Lava",
  frozen: "Frozen",
  dark: "Dark",
  marvel: "Marvel",
  dc: "DC",
  "star-wars": "Star Wars",
  icon: "Icon",
  "gaming-legends": "Gaming Legends",
  slurp: "Slurp",
};
