import React from 'react';
import './card.scss';

function Card({ title, price, image, description, tag, unit }) {
  return (
    <div className="card">
      <div className="card__img">
        {image
          ? <img src={image} alt={title} />
          : <div className="card__img--placeholder">🍽️</div>
        }
        {tag && <span className="card__tag">{tag}</span>}
      </div>

      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        {description && (
          <p className="card__description">{description}</p>
        )}

        <div className="card__footer">
          <span className="card__price">{price.toFixed(2)} €</span>
          {unit && <span className="card__info">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

export default Card;
