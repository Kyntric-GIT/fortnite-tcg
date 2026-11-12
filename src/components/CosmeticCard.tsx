import { useState } from "react";
import type { CosmeticCard as CosmeticCardData } from "../types/card";
import { rarityLabels, seriesLabels } from "../data/cosmetics";

interface Props {
  card: CosmeticCardData;
  styleId: string;
}

export default function CosmeticCard({ card, styleId }: Props) {
  const style = card.styles.find((item) => item.id === styleId) ?? card.styles[0];
  const [imageFailed, setImageFailed] = useState(false);

  // Broken or missing artwork means this card is omitted, not shown with a
  // placeholder or a misleading image.
  if (imageFailed || !style?.image) return null;

  return (
    <article className={`cosmetic-card rarity-${card.rarity}`}>
      <div className="cosmetic-card-top">
        <span>{rarityLabels[card.rarity] ?? card.rarity}</span>
        <span>{card.series ? (seriesLabels[card.series] ?? card.series) : "No Series"}</span>
      </div>
      <div className="cosmetic-art">
        <img
          src={style.image}
          alt={`${card.name} — ${style.name}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>
      <div className="cosmetic-card-info">
        <span className="cosmetic-category">{card.category.toUpperCase()} · {style.name.toUpperCase()}</span>
        <h3>{card.name}</h3>
        <p>{card.chapter ? `CHAPTER ${card.chapter} · SEASON ${card.season}` : "SEASON INFORMATION UNAVAILABLE"}</p>
        <a className="source-link" href={card.sourceUrl} target="_blank" rel="noreferrer">
          {card.acquisitionLabel ?? "VIEW OBTAINMENT DETAILS"} ↗
        </a>
      </div>
    </article>
  );
}
