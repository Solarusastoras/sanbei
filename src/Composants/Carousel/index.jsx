import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import Card from '../Cards';
import './carousel.scss';

const LIMIT = 8;

function getSlidesVisible() {
  const w = window.innerWidth;
  if (w <= 560) return 1.2;
  if (w <= 900) return 2.1;
  return 3.4;
}

function Carousel({ type, title, icon, seeAllTo }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(getSlidesVisible());
  const trackRef              = useRef(null);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(LIMIT);
      setItems(data || []);
      setLoading(false);
    }
    fetchItems();
  }, [type]);

  useEffect(() => {
    const onResize = () => setVisible(getSlidesVisible());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const maxIndex = Math.max(0, items.length - Math.floor(visible));
  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex]);

  const slideWidthPct = 100 / visible;
  const gapPx        = 20;
  const offset       = index * (slideWidthPct + (gapPx / (trackRef.current?.offsetWidth || 800)) * 100);

  const touchStart = useRef(null);
  function onTouchStart(e) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStart.current === null) return;
    const delta = touchStart.current - e.changedTouches[0].clientX;
    if (delta > 40) next();
    else if (delta < -40) prev();
    touchStart.current = null;
  }

  const dotsCount = maxIndex + 1;

  if (loading) {
    return (
      <section className="carousel">
        <div className="carousel__header">
          <div className="carousel__title-wrap">
            <span className="carousel__icon">{icon}</span>
            <h2 className="carousel__title" dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        </div>
        <div className="carousel__track-wrap">
          <div className="carousel__track">
            {[1, 2, 3].map(n => (
              <div key={n} className="carousel__slide">
                <div className="carousel__skeleton" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="carousel">
        <div className="carousel__header">
          <div className="carousel__title-wrap">
            <span className="carousel__icon">{icon}</span>
            <h2 className="carousel__title" dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        </div>
        <div className="carousel__empty">
          <span>{icon}</span>
          Aucun article récent pour l'instant.
        </div>
      </section>
    );
  }

  return (
    <section className="carousel">
      <div className="carousel__header">
        <div className="carousel__title-wrap">
          <span className="carousel__icon">{icon}</span>
          <h2 className="carousel__title" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <Link to={seeAllTo} className="carousel__see-all">Voir tout</Link>
      </div>

      <div className="carousel__outer">
        <button className="carousel__arrow carousel__arrow--prev"
          onClick={prev} disabled={index === 0} aria-label="Précédent">‹</button>

        <div className="carousel__track-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div ref={trackRef} className="carousel__track"
            style={{ transform: `translateX(-${offset}%)` }}>
            {items.map((item, i) => (
              <div key={item.id} className="carousel__slide">
                {i < 3 && <span className="carousel__new-badge">Nouveau</span>}
                <Card
                  title={item.title}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  tag={item.tag}
                  unit={item.unit}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="carousel__arrow carousel__arrow--next"
          onClick={next} disabled={index >= maxIndex} aria-label="Suivant">›</button>
      </div>

      {dotsCount > 1 && (
        <div className="carousel__dots">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <button key={i}
              className={`carousel__dot${index === i ? ' carousel__dot--active' : ''}`}
              onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Carousel;
