import { useState } from "react";
import {
  Award,
  BookOpen,
  Boxes,
  Gift,
  Home,
  Settings,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={22} /></div>
          <div>
            <strong>FORTNITE TCG</strong>
            <span>COLLECTOR'S HUB</span>
          </div>
        </div>

        <div className="nav-label">GAME</div>
        <nav className="navigation" aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              className={`nav-item ${page === id ? "active" : ""}`}
              key={id}
              onClick={() => setPage(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setPage("home")}>
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <span className="version">EARLY DEVELOPMENT · 0.1.0</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">YOUR COLLECTION STARTS HERE</span>
            <h1>{navigation.find((item) => item.id === page)?.label ?? "Home"}</h1>
          </div>
          <div className="player-pill">
            <span className="player-avatar">P</span>
            <span>Player</span>
          </div>
        </header>

        {page === "home" ? (
          <section className="welcome-panel">
            <div className="welcome-copy">
              <span className="eyebrow">WELCOME, COLLECTOR</span>
              <h2>Build your<br /><span>collection.</span></h2>
              <p>Open packs, discover cosmetic cards, and work toward completing your collection.</p>
              <button className="primary-button" onClick={() => setPage("packs")}>
                <Gift size={17} /> Explore packs
              </button>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-card">
                <div className="hero-card-glow"><Sparkles size={42} /></div>
                <span>YOUR NEXT DISCOVERY</span>
                <strong>?</strong>
                <small>COLLECT SOMETHING LEGENDARY</small>
              </div>
            </div>
          </section>
        ) : (
          <section className="empty-panel">
            <div className="empty-icon"><BookOpen size={28} /></div>
            <h2>{navigation.find((item) => item.id === page)?.label}</h2>
            <p>This section is part of the next development milestone.</p>
          </section>
        )}

        <section className="dashboard-grid">
          <article className="stat-card">
            <span className="stat-label">CARDS COLLECTED</span>
            <strong>0</strong>
            <span className="stat-note">Start opening packs to collect cards</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">COLLECTION COMPLETION</span>
            <strong>0%</strong>
            <div className="progress-track"><div /></div>
          </article>
          <article className="stat-card">
            <span className="stat-label">V-BUCKS</span>
            <strong>1,000</strong>
            <span className="stat-note">Your starting balance</span>
          </article>
        </section>
      </main>
    </div>
  );
}
