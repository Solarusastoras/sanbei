import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <h2>San<span>-Beï</span></h2>
          <p>
            Une épicerie fine et un restaurant de quartier,
            autour de produits choisis avec soin.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="footer__col-title">Explorer</p>
          <ul className="footer__links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/plats">Nos plats</Link></li>
            <li><Link to="/epicerie">L'épicerie</Link></li>
          </ul>
        </div>

        {/* Infos pratiques */}
        <div>
          <p className="footer__col-title">Infos pratiques</p>
          <div className="footer__info">
            <p>
              <strong>Adresse</strong><br />
              6 rue Cordeliers <br />
              64000 Pau
            </p>
            <p>
              <strong>Horaires</strong><br />
              Lundi – Samedi : 9h30 – 19h30 <br />
              Dim : Fermé
            </p>
            <p>
              <strong>Contact</strong><br />
              contact@sanbe.fr
            </p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span className="footer__copy">© {year} San-Beï · Tous droits réservés</span>
        <span className="footer__made">Fait avec ♡ à Pau</span>
      </div>
    </footer>
  );
}

export default Footer;
