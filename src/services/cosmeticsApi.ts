import type { CosmeticCard, CardRarity } from "../types/card";

const API_URL = "https://fortnite-api.com/v2/cosmetics/br?language=en";

// Fortnite.GG uses its own numeric item IDs. Only IDs verified against its
// catalog belong here; never guess an ID from a Fortnite API cosmetic ID.
const FORTNITE_GG_IDS: Record<string, number> = {
  "slurp jonesy": 248,
};

type ApiOption = { tag?: string; name?: string; image?: string };
type ApiItem = {
  id: string;
  name: string;
  description?: string;
  type?: { value?: string; displayValue?: string };
  rarity?: { value?: string };
  series?: { displayValue?: string; name?: string } | null;
  variants?: Array<{ channel?: string; type?: string; options?: ApiOption[] }>;
  introduction?: { chapter?: string | number; season?: string | number };
  shopHistory?: string[];
};
type ApiResponse = { data?: ApiItem[] };

const rarityValues = new Set<CardRarity>(["common","uncommon","rare","epic","legendary","mythic","exotic","promo"]);
const numberFrom = (value?: string | number) => {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function rarity(value?: string): CardRarity {
  const normalized = (value ?? "common").toLowerCase();
  return rarityValues.has(normalized as CardRarity) ? normalized as CardRarity : "common";
}

function isSuperLevel(value: string): boolean {
  return /super[\s_-]*level|level[\s_-]*up|superstyle/i.test(value);
}

function toOutfitCards(item: ApiItem): CosmeticCard[] {
  const ggId = FORTNITE_GG_IDS[item.name.toLowerCase()];
  if (!ggId) return [];

  const variants = item.variants ?? [];
  const superLevelOptions = variants.flatMap((variant) =>
    (variant.options ?? [])
      .filter((option) => isSuperLevel([variant.channel, variant.type, option.name, option.tag].filter(Boolean).join(" ")))
      .map((option) => option.name ?? option.tag ?? "Super Level"),
  );

  // Normal body-part, mask, color and other selectable variants stay on one
  // card. Only Super Level progressions receive additional cards.
  const cardStyles = superLevelOptions.length
    ? ["Base", ...superLevelOptions]
    : ["Base"];

  return cardStyles.map((styleName, index) => {
    const isBase = index === 0;
    const image = isBase
      ? `https://fortnite.gg/img/items/${ggId}/icon.png`
      : `https://fortnite.gg/img/items/${ggId}/style-${index}.jpg`;

    return {
      id: `${item.id}-${slug(styleName)}`,
      name: item.name,
      category: "outfit",
      rarity: rarity(item.rarity?.value),
      series: item.series?.displayValue ?? item.series?.name ?? null,
      description: item.description ?? "",
      chapter: numberFrom(item.introduction?.chapter),
      season: numberFrom(item.introduction?.season),
      releaseDate: "",
      releaseType: item.shopHistory?.length ? "item-shop" : "other",
      styles: [{ id: slug(styleName), name: styleName, image }],
      sourceUrl: `https://fortnite.gg/cosmetics?id=${ggId}&type=outfit`,
      acquisitionLabel: item.shopHistory?.length ? "Item Shop history" : "Acquisition details",
    };
  });
}

export async function fetchAllOutfitStyleCards(signal?: AbortSignal): Promise<CosmeticCard[]> {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) throw new Error(`Fortnite cosmetics API returned ${response.status}`);
  const payload = await response.json() as ApiResponse;
  const outfits = (payload.data ?? []).filter((item) => {
    const type = (item.type?.value ?? item.type?.displayValue ?? "").toLowerCase();
    return type === "outfit" || type === "outfits";
  });
  const cards = outfits.flatMap(toOutfitCards);
  if (!cards.length) throw new Error("No outfits have verified Fortnite.GG image mappings yet.");
  return cards;
}
