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
  if (imageFailed || !style?.image) return null;

  const rarity = rarityLabels[card.rarity] ?? card.rarity;
  const series = card.series ? (seriesLabels[card.series] ?? card.series) : "No Series";
  const season = card.chapter && card.season
    ? `Chapter ${card.chapter} · Season ${card.season}`
    : "Season information unavailable";
  const obtainment = card.acquisitionLabel ?? "View obtainment details";

  return (
    <article className={`cosmetic-card rarity-${card.rarity}`}>
      <header className="card-artwork-header">
        <span className="artwork-label">Artwork</span>
        <div className="card-heading">
          <h3>{card.name}</h3>
          <span className="card-rarity-subtitle">{rarity}</span>
        </div>
      </header>
      <div className="cosmetic-art">
        <img src={style.image} alt={`${card.name} — ${style.name}`} loading="lazy" onError={() => setImageFailed(true)} />
        <span className="artwork-speckles" aria-hidden="true" />
      </div>
      <footer className="cosmetic-card-info">
        <div className="card-detail-lines" aria-hidden="true"><span /><span /></div>
        <div className="card-style-name">{style.name}</div>
        <div className="card-detail-grid">
          <div className="card-detail"><span>Series</span><strong>{series}</strong></div>
          <div className="card-detail"><span>Season</span><strong>{season}</strong></div>
        </div>
        <a className="source-link" href={card.sourceUrl} target="_blank" rel="noreferrer">
          <span>Obtained from</span><strong>{obtainment} ↗</strong>
        </a>
      </footer>
    </article>
  );
}
