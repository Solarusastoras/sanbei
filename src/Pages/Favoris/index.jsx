import React from 'react';
import { useFavoris } from '../../FavorisContext';
import './favoris.scss';

function Favoris({ onClose }) {
  const { favoris, removeFavori, clearFavoris } = useFavoris();

  return (
    <div className="favoris-overlay" onClick={onClose}>
      <div className="favoris" onClick={e => e.stopPropagation()}>

        <div className="favoris__header">
          <div>
            <h2 className="favoris__title">❤️ Mes favoris</h2>
            <p className="favoris__count">{favoris.length} article{favoris.length > 1 ? 's' : ''}</p>
          </div>
          <button className="favoris__close" onClick={onClose}>✕</button>
        </div>

        {favoris.length === 0 ? (
          <div className="favoris__empty">
            <span>🤍</span>
            <p>Aucun favori pour l'instant.<br />Clique sur ♡ sur une carte pour en ajouter.</p>
          </div>
        ) : (
          <>
            <div className="favoris__list">
              {favoris.map(f => (
                <div key={f.id} className="favoris__item">
                  <div className="favoris__item-img">
                    {f.image
                      ? <img src={f.image} alt={f.title} />
                      : <span>{f.type === 'plat' ? '🍽️' : '🧺'}</span>
                    }
                  </div>
                  <div className="favoris__item-info">
                    <h4>{f.title}</h4>
                    <p>{parseFloat(f.price).toFixed(2)} €</p>
                  </div>
                  <button className="favoris__item-remove" onClick={() => removeFavori(f.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="favoris__footer">
              <div className="favoris__actions">
                <button className="favoris__btn-clear" onClick={clearFavoris}>Vider la liste</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Favoris;
