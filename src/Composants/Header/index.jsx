import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.scss';
import Logo from '../../Utils/img/logoSanbei.png'

const LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/plats', label: 'Plats' },
  { to: '/epicerie', label: 'Épicerie' },
];

function Header({ onFavorisClick, favorisCount }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setOpen(false)}>
          <img src={Logo} alt="Logo" />
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="header__nav">
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`header__link${pathname === to ? ' header__link--active' : ''}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button className="header__favoris" onClick={onFavorisClick} title="Mes favoris">
            ♥
            {favorisCount > 0 && <span className="header__favoris-badge">{favorisCount}</span>}
          </button>
          <Link to="/admin" className="header__admin" title="Espace propriétaire">⚙︎</Link>
        </div>

        <button className={`header__burger${open ? ' header__burger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
          <span /><span /><span />
        </button>
      </div>

      <nav className={`header__mobile-menu${open ? ' header__mobile-menu--open' : ''}`}>
        {LINKS.map(({ to, label }) => (
          <Link key={to} to={to}
            className={`header__link${pathname === to ? ' header__link--active' : ''}`}
            onClick={() => setOpen(false)}>{label}
          </Link>
        ))}
        <button className="header__favoris-mobile" onClick={() => { onFavorisClick(); setOpen(false); }}>
          ♥ Mes favoris {favorisCount > 0 && `(${favorisCount})`}
        </button>
      </nav>
    </header>
  );
}

export default Header;
