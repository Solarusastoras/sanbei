import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../Composants/Carousel';
import './home.scss';

function Home() {
  return (
    <main className="home">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="home__hero">
        <p className="home__eyebrow">Bienvenue</p>
        <h1 className="home__title">
          La table,<br /><em>à portée de main</em>
        </h1>
        <p className="home__subtitle">
          Explorez nos plats du jour et notre épicerie soigneusement sélectionnée.
        </p>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="home__divider">
        <span>Nouveaux arrivants</span>
      </div>

      {/* ── Carrousel Plats ───────────────────────────────────────────── */}
      <Carousel
        type="plat"
        icon="🍽️"
        title="Plats <em>du moment</em>"
        seeAllTo="/plats"
      />

      {/* ── Carrousel Épicerie ────────────────────────────────────────── */}
      <Carousel
        type="epicerie"
        icon="🧺"
        title="Épicerie <em>fraîche</em>"
        seeAllTo="/epicerie"
      />

      {/* ── Category shortcuts ────────────────────────────────────────── */}
      <div className="home__divider">
        <span>Explorer</span>
      </div>

      <div className="home__categories">
        {[
          { icon: '🥗', label: 'Plats', sub: 'Recettes du marché', to: '/plats' },
          { icon: '🧺', label: 'Épicerie', sub: 'Produits frais & secs', to: '/epicerie' },
        ].map((cat) => (
          <Link key={cat.label} to={cat.to} className="home__cat-card">
            <div className="home__cat-card-icon">{cat.icon}</div>
            <div className="home__cat-card-text">
              <h3>{cat.label}</h3>
              <p>{cat.sub}</p>
            </div>
            <span className="home__cat-card-arrow">→</span>
          </Link>
        ))}
      </div>

    </main>
  );
}

export default Home;
