import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../Composants/Carousel';
import './home.scss';

function Home() {
  return (
    <main className="home">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="home__hero">
        <div className="home__hero-bg">
          <div className="home__hero-grain" />
          <div className="home__hero-blob home__hero-blob--1" />
          <div className="home__hero-blob home__hero-blob--2" />
        </div>
        <div className="home__hero-content">
          <p className="home__eyebrow">
            <span className="home__eyebrow-dot" />
            Épicerie fine & Restaurant · Pau
          </p>
          <h1 className="home__title">
            La table,<br />
            <em>à portée de main</em>
          </h1>
          <p className="home__subtitle">
            Plats cuisinés chaque matin, produits d'exception<br />
            triés sur le volet. Le meilleur du quartier.
          </p>
          <div className="home__cta-group">
            <Link to="/plats" className="home__cta home__cta--primary">
              🍽️ Voir tous nos plats
            </Link>
            <Link to="/epicerie" className="home__cta home__cta--secondary">
              🧺 Voir toutes nos produits
            </Link>
          </div>
          <div className="home__hero-badges">
            <span>🕘 Lun–Sam · 9h30–19h30</span>
            <span>📍 6 rue Cordeliers, Pau</span>
          </div>
        </div>
        <div className="home__hero-scroll">
          <span>↓</span>
        </div>
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
      <div className="home__carousel-epicerie">
        <Carousel
          type="epicerie"
          icon="🧺"
          title="Épicerie <em>fraîche</em>"
          seeAllTo="/epicerie"
        />
      </div>

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
