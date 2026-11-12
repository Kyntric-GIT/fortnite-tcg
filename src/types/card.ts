export type CosmeticCategory =
  | "outfit"
  | "backbling"
  | "pickaxe"
  | "glider"
  | "emote"
  | "sidekick"
  | "kicks";

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "exotic"
  | "promo";

export type CosmeticSeries =
  | "crew"
  | "shadow"
  | "lava"
  | "frozen"
  | "dark"
  | "marvel"
  | "dc"
  | "star-wars"
  | "icon"
  | "gaming-legends"
  | "slurp"
  | null;

export interface CosmeticStyle {
  id: string;
  name: string;
  image: string;
}

export interface CosmeticCard {
  id: string;
  name: string;
  category: CosmeticCategory;
  rarity: CardRarity;
  series: CosmeticSeries;
  description: string;
  chapter: number;
  season: number;
  releaseDate: string;
  releaseType: "item-shop" | "battle-pass" | "promo" | "crew" | "other";
  styles: CosmeticStyle[];
  sourceUrl: string;
}

export interface OwnedCard {
  cardId: string;
  styleId: string;
  quantity: number;
}
