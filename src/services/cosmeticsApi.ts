import type { CosmeticCard, CardRarity } from "../types/card";

const API_URL = "https://fortnite-api.com/v2/cosmetics/br?language=en";

type ApiVariantOption = {
  tag?: string;
  name?: string;
  image?: string;
};

type ApiCosmetic = {
  id: string;
  name: string;
  description?: string;
  type?: { value?: string; displayValue?: string };
  rarity?: { value?: string; displayValue?: string };
  series?: { value?: string; name?: string; displayValue?: string } | null;
  images?: { icon?: string; smallIcon?: string; featured?: string };
  variants?: Array<{
    channel?: string;
    type?: string;
    options?: ApiVariantOption[];
  }>;
  introduction?: {
    chapter?: string | number;
    season?: string | number;
    text?: string;
  };
};

type ApiResponse = { data?: ApiCosmetic[] };

const allowedRarities = new Set<CardRarity>([
  "common", "uncommon", "rare", "epic", "legendary", "mythic", "exotic", "promo",
]);

function numericPart(value?: string | number): number {
  if (value === undefined) return 0;
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function safeId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function mapRarity(value?: string): CardRarity {
  const normalized = value?.toLowerCase() ?? "common";
  return allowedRarities.has(normalized as CardRarity)
    ? normalized as CardRarity
    : "common";
}

function toOutfitCards(item: ApiCosmetic): CosmeticCard[] {
  const baseImage = item.images?.icon ?? item.images?.featured ?? item.images?.smallIcon ?? "";
  const variants = (item.variants ?? []).flatMap((variant) =>
    (variant.options ?? []).map((option) => ({
      id: safeId(`${variant.channel ?? variant.type ?? "style"}-${option.tag ?? option.name ?? "option"}`),
      name: option.name ?? option.tag ?? "Style",
      image: option.image || baseImage,
    })),
  );

  const styles = variants.length > 0
    ? variants
    : [{ id: "default", name: "Default", image: baseImage }];

  const seriesName = item.series?.displayValue ?? item.series?.name ?? null;
  const chapter = numericPart(item.introduction?.chapter);
  const season = numericPart(item.introduction?.season);

  return styles.map((style) => ({
    id: `${item.id}--${style.id}`,
    name: item.name,
    category: "outfit",
    rarity: mapRarity(item.rarity?.value),
    series: seriesName,
    description: item.description ?? "",
    chapter,
    season,
    releaseDate: "",
    releaseType: "other",
    styles: [style],
    sourceUrl: `https://fortnite-api.com/v2/cosmetics/br/${item.id}`,
  }));
}

export async function fetchAllOutfitStyleCards(signal?: AbortSignal): Promise<CosmeticCard[]> {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) {
    throw new Error(`Fortnite cosmetics API returned ${response.status}`);
  }

  const payload = await response.json() as ApiResponse;
  const outfits = (payload.data ?? []).filter((item) => {
    const type = item.type?.value?.toLowerCase() ?? item.type?.displayValue?.toLowerCase();
    return type === "outfit" || type === "outfits";
  });

  if (outfits.length === 0) {
    throw new Error("The cosmetics API returned no outfits.");
  }

  return outfits.flatMap(toOutfitCards);
}
