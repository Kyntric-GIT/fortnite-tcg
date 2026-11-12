import type { CosmeticCard } from "../types/card";

// Verified Fortnite.GG listing for the initial reference outfit.
export const cosmeticCards: CosmeticCard[] = [
  {
    id: "slurp-jonesy-base",
    name: "Slurp Jonesy",
    category: "outfit",
    rarity: "epic",
    series: "slurp",
    description: "Slurp up and ship out. Reactive appearance changes are represented by the base outfit card.",
    chapter: 2,
    season: 2,
    releaseDate: "2020-03-20",
    releaseType: "item-shop",
    sourceUrl: "https://fortnite.gg/cosmetics?id=248&type=outfit",
    acquisitionLabel: "Item Shop history",
    styles: [
      {
        id: "base",
        name: "Base",
        image: "https://fortnite.gg/img/items/248/style-3.jpg",
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
