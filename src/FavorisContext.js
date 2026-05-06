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
      return [...prev, product];
    });
  }

  function isFavori(id) {
    return favoris.some(f => f.id === id);
  }

  function removeFavori(id) {
    setFavoris(prev => prev.filter(f => f.id !== id));
  }

  function clearFavoris() {
    setFavoris([]);
  }

  return (
    <FavorisContext.Provider value={{ favoris, toggleFavori, isFavori, removeFavori, clearFavoris }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris() {
  const ctx = useContext(FavorisContext);
  if (!ctx) throw new Error('useFavoris must be used within FavorisProvider');
  return ctx;
}
