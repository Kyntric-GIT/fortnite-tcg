import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, Boxes, Gift, Home, Settings, ShoppingBag, Sparkles } from "lucide-react";
import CosmeticCard from "./components/CosmeticCard";
import { cosmeticCards as fallbackCosmeticCards } from "./data/cosmetics";
import { fetchAllOutfitStyleCards } from "./services/cosmeticsApi";
import type { CosmeticCard as CosmeticCardData } from "./types/card";

type Page = "home" | "collection" | "packs" | "shop" | "rewards";
const navigation: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "collection", label: "Collection", icon: Boxes },
  { id: "packs", label: "Packs", icon: Gift },
  { id: "shop", label: "Item Shop", icon: ShoppingBag },
  { id: "rewards", label: "Rewards", icon: Award },
];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cosmeticCards, setCosmeticCards] = useState<CosmeticCardData[]>(fallbackCosmeticCards);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "live" | "fallback">("loading");
  const [catalogError, setCatalogError] = useState("");

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

  const visibleCount = useMemo(() => cosmeticCards.length, [cosmeticCards]);
  const collectionContent = (
    <section className="collection-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FORTNITE COSMETIC DATABASE</span>
          <h2>Outfit cards</h2>
          <p>One card per outfit. Custom body-part variants stay together; Super Level styles get their own cards.</p>
        </div>
        <span className="collection-count">{visibleCount.toLocaleString()} CARDS</span>
      </div>
      <div className="catalog-status" role="status">
        {catalogStatus === "loading" && "Loading outfit records and verified Fortnite.GG artwork…"}
        {catalogStatus === "live" && `${visibleCount.toLocaleString()} outfit cards loaded with mapped Fortnite.GG artwork`}
        {catalogStatus === "fallback" && `Live catalog unavailable: ${catalogError}`}
      </div>
      <div className="card-grid">
        {cosmeticCards.map((card) => (
          <CosmeticCard key={card.id} card={card} styleId={card.styles[0].id} />
        ))}
      </div>
      <p className="source-note">
        Card artwork and obtainment links use <a href="https://fortnite.gg/cosmetics" target="_blank" rel="noreferrer">Fortnite.GG</a>.
        Records without a verified Fortnite.GG item ID or working image are not displayed.
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
          <span className="version">EARLY DEVELOPMENT · 0.4.0</span>
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
                <h2>Explore every<br /><span>outfit card.</span></h2>
                <p>Browse Fortnite outfits, see their series and rarity, and check their acquisition details.</p>
                <button className="primary-button" onClick={() => setPage("collection")}><Boxes size={17} /> Browse outfits</button>
              </div>
              <div className="welcome-art" aria-hidden="true">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="hero-card"><div className="hero-card-glow"><Sparkles size={42} /></div><span>FORTNITE OUTFIT DATABASE</span><strong>?</strong><small>DISCOVER WHAT'S AVAILABLE</small></div>
              </div>
            </section>
            <section className="dashboard-grid">
              <article className="stat-card"><span className="stat-label">OUTFIT CARDS</span><strong>{visibleCount.toLocaleString()}</strong><span className="stat-note">Cards with verified Fortnite.GG mappings</span></article>
              <article className="stat-card"><span className="stat-label">CARD RULE</span><strong>1:1</strong><span className="stat-note">One base card per outfit; Super Levels separate</span></article>
              <article className="stat-card"><span className="stat-label">ARTWORK</span><strong>Fortnite.GG</strong><span className="stat-note">Broken images are hidden</span></article>
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
