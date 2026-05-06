import React from "react";
import FavoriteButton from "../FavoriteButton";
import "./card.scss";

function Card({ id, title, price, image, description, tag, unit, mesure, type }) {
  const product = { id, title, price, image, description, tag, unit, mesure, type };
  return (
    <div className="card">
      <div className="card__img">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="card__img--placeholder">🍽️</div>
        )}
        {tag && <span className="card__tag">{tag}</span>}
        <div className="card__favorite">
          <FavoriteButton product={product} />
        </div>
      </div>

      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        {description && <p className="card__description">{description}</p>}
        <div className="card__footer">
          <span className="card__price">{parseFloat(price).toFixed(2)} €</span>
          {(unit || mesure) && (
            <span className="card__info">
              {unit}
              {unit && mesure ? " " : ""}
              {mesure}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
