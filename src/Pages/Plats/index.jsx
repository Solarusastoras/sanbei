import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import Card from '../../Composants/Cards';
import './plats.scss';

function Plats() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [active, setActive]     = useState('Tous');

  useEffect(() => {
    async function fetchPlats() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'plat')
        .order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchPlats();
  }, []);

  const activeFilters = ['Tous', ...new Set(products.map(p => p.category))];
  const filtered = active === 'Tous' ? products : products.filter(p => p.category === active);

  return (
    <main className="plats">
      <header className="plats__header">
        <span className="plats__eyebrow">Menu du jour</span>
        <h1 className="plats__title">Nos <span>plats</span></h1>
        <p className="plats__subtitle">Cuisinés chaque matin avec des produits de saison.</p>
      </header>

      {!loading && products.length > 0 && (
        <div className="plats__filters">
          {activeFilters.map(f => (
            <button key={f}
              className={`plats__filter-btn${active === f ? ' plats__filter-btn--active' : ''}`}
              onClick={() => setActive(f)}>{f}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="plats__grid">
          {[1,2,3,4,5,6].map(n => <div key={n} className="plats__skeleton" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="plats__grid">
          {filtered.map(p => (
            <Card key={p.id} title={p.title} description={p.description}
              price={p.price} image={p.image} tag={p.tag} unit={p.unit} />
          ))}
        </div>
      ) : (
        <div className="plats__empty">
          <span>🍽️</span>
          {products.length === 0 ? 'Aucun plat disponible pour le moment.' : 'Aucun plat dans cette catégorie.'}
        </div>
      )}
    </main>
  );
}

export default Plats;
