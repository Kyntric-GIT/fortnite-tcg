import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, Boxes, Gift, Home, Settings, ShoppingBag, Sparkles } from "lucide-react";
import CosmeticCard from "./components/CosmeticCard";
import { cosmeticCards as fallbackCosmeticCards } from "./data/cosmetics";
import { fetchAllOutfitStyleCards } from "./services/cosmeticsApi";
import type { CosmeticCard as CosmeticCardData, OwnedCard } from "./types/card";

type Page = "home" | "collection" | "packs" | "shop" | "rewards";
const navigation: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "collection", label: "Collection", icon: Boxes },
  { id: "packs", label: "Packs", icon: Gift },
  { id: "shop", label: "Item Shop", icon: ShoppingBag },
  { id: "rewards", label: "Rewards", icon: Award },
];
const SAVE_KEY = "fortnite-tcg-collection-v1";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cosmeticCards, setCosmeticCards] = useState<CosmeticCardData[]>(fallbackCosmeticCards);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "live" | "fallback">("loading");
  const [catalogError, setCatalogError] = useState("");
  const [ownedCards, setOwnedCards] = useState<OwnedCard[]>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      return saved ? JSON.parse(saved) as OwnedCard[] : [];
    } catch { return []; }
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchAllOutfitStyleCards(controller.signal).then((cards) => {
      setCosmeticCards(cards);
      setCatalogStatus("live");
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setCatalogStatus("fallback");
      setCatalogError(error instanceof Error ? error.message : "Could not load the live catalog.");
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(ownedCards));
  }, [ownedCards]);

  const totalOwned = useMemo(() => ownedCards.reduce((sum, item) => sum + item.quantity, 0), [ownedCards]);
  const completion = cosmeticCards.length ? Math.round((ownedCards.length / cosmeticCards.length) * 100) : 0;
  const addCard = (cardId: string, styleId: string) => {
    setOwnedCards((current) => {
      if (current.some((item) => item.cardId === cardId && item.styleId === styleId)) return current;
      return [...current, { cardId, styleId, quantity: 1 }];
    });
  };

  const collectionContent = (
    <section className="collection-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR COSMETIC LIBRARY</span>
          <h2>Fortnite outfit collection</h2>
          <p>Every outfit style is displayed as its own individual card.</p>
        </div>
        <span className="collection-count">{ownedCards.length.toLocaleString()} / {cosmeticCards.length.toLocaleString()} OWNED</span>
      </div>
      <div className="catalog-status" role="status">
        {catalogStatus === "loading" && "Loading the full Fortnite outfit catalog…"}
        {catalogStatus === "live" && `Live catalog loaded · ${cosmeticCards.length.toLocaleString()} individual style cards`}
        {catalogStatus === "fallback" && `Using the saved sample catalog. Live catalog unavailable: ${catalogError}`}
      </div>
      <div className="card-grid">
        {cosmeticCards.map((card) => (
          <CosmeticCard key={card.id} card={card} styleId={card.styles[0].id}
            owned={ownedCards.find((item) => item.cardId === card.id && item.styleId === card.styles[0].id)}
            onAdd={addCard} />
        ))}
      </div>
      <p className="source-note">
        Outfit and style metadata supplied by <a href="https://fortnite-api.com/" target="_blank" rel="noreferrer">Fortnite-API</a>.
        Fortnite and its assets belong to their respective owners.
      </p>
    </section>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={22} /></div><div><strong>FORTNITE TCG</strong><span>COLLECTOR'S HUB</span></div></div>
        <div className="nav-label">GAME</div>
        <nav className="navigation" aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button className={`nav-item ${page === id ? "active" : ""}`} key={id} onClick={() => setPage(id)}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setPage("home")}><Settings size={18} /><span>Settings</span></button>
          <span className="version">EARLY DEVELOPMENT · 0.3.0</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div><span className="eyebrow">YOUR COLLECTION STARTS HERE</span><h1>{navigation.find((item) => item.id === page)?.label ?? "Home"}</h1></div>
          <div className="player-pill"><span className="player-avatar">P</span><span>Player</span></div>
        </header>
        {page === "home" ? (
          <>
            <section className="welcome-panel">
              <div className="welcome-copy">
                <span className="eyebrow">WELCOME, COLLECTOR</span>
                <h2>Build your<br /><span>collection.</span></h2>
                <p>Collect Fortnite outfits, unlock individual styles, and work toward completing your collection.</p>
                <button className="primary-button" onClick={() => setPage("collection")}><Boxes size={17} /> View collection</button>
              </div>
              <div className="welcome-art" aria-hidden="true">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="hero-card"><div className="hero-card-glow"><Sparkles size={42} /></div><span>YOUR NEXT DISCOVERY</span><strong>?</strong><small>COLLECT SOMETHING LEGENDARY</small></div>
              </div>
            </section>
            <section className="dashboard-grid">
              <article className="stat-card"><span className="stat-label">CARDS COLLECTED</span><strong>{totalOwned.toLocaleString()}</strong><span className="stat-note">Individual outfit styles collected</span></article>
              <article className="stat-card"><span className="stat-label">COLLECTION COMPLETION</span><strong>{completion}%</strong><div className="progress-track"><div style={{ width: `${Math.min(100, completion)}%` }} /></div></article>
              <article className="stat-card"><span className="stat-label">V-BUCKS</span><strong>1,000</strong><span className="stat-note">Starting balance · demo value</span></article>
            </section>
            {collectionContent}
          </>
        ) : page === "collection" ? collectionContent : (
          <section className="empty-panel">
            <div className="empty-icon"><BookOpen size={28} /></div>
            <h2>{navigation.find((item) => item.id === page)?.label}</h2>
            <p>This section is queued for a future development milestone.</p>
          </section>
        )}
      </main>
    </div>
  );
}
