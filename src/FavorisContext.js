import React, { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'sanbe_favoris';
const FavorisContext = createContext(null);

export function FavorisProvider({ children }) {
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

  return (
    <FavorisContext.Provider value={{ favoris, toggleFavori, isFavori, updateQty, removeFavori, clearFavoris, total }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris() {
  const ctx = useContext(FavorisContext);
  if (!ctx) throw new Error('useFavoris must be used within FavorisProvider');
  return ctx;
}
