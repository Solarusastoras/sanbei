import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavoris } from "../../FavorisContext";
import Favoris from "../../Pages/Favoris";
import "./header.scss";
import Logo from "../../Utils/img/logoSanbei.png";

const LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/plats", label: "Plats" },
  { to: "/epicerie", label: "Épicerie" },
];

function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [showFavoris, setShowFavoris] = useState(false);
  const { favoris } = useFavoris();

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" onClick={() => setOpen(false)}>
          <img className="header__logo" src={Logo} alt="Logo" />
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="header__nav">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`header__link${pathname === to ? " header__link--active" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            className="header__favoris-btn"
            onClick={() => setShowFavoris(true)}
            aria-label="Voir les favoris"
          >
            <Heart size={20} fill={favoris.length > 0 ? '#e53935' : 'transparent'} stroke={favoris.length > 0 ? '#e53935' : 'currentColor'} />
            {favoris.length > 0 && <span className="header__favoris-count">{favoris.length}</span>}
          </button>
          <Link
            to="/admin"
            className="header__admin"
            title="Espace propriétaire"
          >
            ⚙︎
          </Link>
        </div>

        <button
          className={`header__burger${open ? " header__burger--open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        className={`header__mobile-menu${open ? " header__mobile-menu--open" : ""}`}
      >
        {LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`header__link${pathname === to ? " header__link--active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>

      {showFavoris && <Favoris onClose={() => setShowFavoris(false)} />}
    </header>
  );
}

export default Header;
