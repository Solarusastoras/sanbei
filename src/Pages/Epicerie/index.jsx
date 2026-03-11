import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import Card from '../../Composants/Cards';
import './epicerie.scss';

function Epicerie() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    async function fetchEpicerie() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('type', 'epicerie')
        .order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchEpicerie();
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const sections = [...new Set(products.map(p => p.category))];

  return (
    <main className="epicerie">
      <header className="epicerie__header">
        <span className="epicerie__eyebrow">Produits sélectionnés</span>
        <h1 className="epicerie__title">Notre <span>épicerie</span></h1>
        <p className="epicerie__subtitle">Des produits d'exception triés sur le volet.</p>
      </header>

      <div className="epicerie__search-wrap">
        <span className="epicerie__search-icon">🔍</span>
        <input className="epicerie__search" type="text"
          placeholder="Rechercher un produit…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="epicerie__grid" style={{ padding: '0 2rem' }}>
          {[1,2,3,4].map(n => <div key={n} className="plats__skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="plats__empty"><span>🧺</span>Aucun produit trouvé.</div>
      ) : (
        sections.map(section => {
          const items = filtered.filter(p => p.category === section);
          if (items.length === 0) return null;
          return (
            <section key={section} className="epicerie__section">
              <h2 className="epicerie__section-title">{section}</h2>
              <div className="epicerie__grid">
                {items.map(p => (
                  <Card key={p.id} title={p.title} description={p.description}
                    price={p.price} image={p.image} tag={p.tag} unit={p.unit} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}

export default Epicerie;
