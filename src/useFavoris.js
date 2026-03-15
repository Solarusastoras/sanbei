import { useState, useEffect } from 'react';

const KEY = 'sanbe_favoris';

export function useFavoris() {
  const [favoris, setFavoris] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favoris));
  }, [favoris]);

  function toggleFavori(product) {
    setFavoris(prev => {
      const exists = prev.find(f => f.id === product.id);
      if (exists) return prev.filter(f => f.id !== product.id);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function isFavori(id) {
    return favoris.some(f => f.id === id);
  }

  function updateQty(id, qty) {
    if (qty < 1) return;
    setFavoris(prev => prev.map(f => f.id === id ? { ...f, qty } : f));
  }

  function removeFavori(id) {
    setFavoris(prev => prev.filter(f => f.id !== id));
  }

  function clearFavoris() {
    setFavoris([]);
  }

  const total = favoris.reduce((sum, f) => sum + (parseFloat(f.price) * f.qty), 0);

  return { favoris, toggleFavori, isFavori, updateQty, removeFavori, clearFavoris, total };
}
