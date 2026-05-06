import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoris } from '../FavorisContext';
import './favoriteButton.scss';

export default function FavoriteButton({ product, className = "" }) {
  const { isFavori, toggleFavori } = useFavoris();
  const isFav = isFavori(product.id);

  return (
    <button
      className={`favorite-btn ${isFav ? 'active' : ''} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavori(product);
      }}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        size={20} 
        fill={isFav ? "currentColor" : "none"} 
        strokeWidth={isFav ? 0 : 2}
      />
    </button>
  );
}
