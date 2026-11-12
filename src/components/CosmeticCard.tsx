import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { CosmeticCard as CosmeticCardData, OwnedCard } from "../types/card";
import { rarityLabels, seriesLabels } from "../data/cosmetics";

interface Props {
  card: CosmeticCardData;
  styleId: string;
  owned?: OwnedCard;
  onAdd: (cardId: string, styleId: string) => void;
}

export default function CosmeticCard({ card, styleId, owned, onAdd }: Props) {
  const style = card.styles.find((item) => item.id === styleId) ?? card.styles[0];
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className={`cosmetic-card rarity-${card.rarity}`}>
      <div className="cosmetic-card-top">
        <span>{rarityLabels[card.rarity]}</span>
        <span>{card.series ? (seriesLabels[card.series] ?? card.series) : "No Series"}</span>
      </div>
      <div className="cosmetic-art">
        {!imageFailed ? (
          <img
            src={style.image}
            alt={`${card.name} — ${style.name} style`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="image-fallback">
            <span>IMAGE UNAVAILABLE</span>
            <strong>{card.name}</strong>
            <small>Check the source image URL</small>
          </div>
        )}
      </div>
      <div className="cosmetic-card-info">
        <span className="cosmetic-category">{card.category.toUpperCase()} · {style.name.toUpperCase()}</span>
        <h3>{card.name}</h3>
        <p>CHAPTER {card.chapter} · SEASON {card.season}</p>
        <button
          className={`collect-button ${owned ? "is-owned" : ""}`}
          onClick={() => onAdd(card.id, style.id)}
          disabled={Boolean(owned)}
        >
          {owned ? <><Check size={15} /> OWNED ×{owned.quantity}</> : <><Plus size={15} /> ADD TO COLLECTION</>}
        </button>
      </div>
    </article>
  );
}
