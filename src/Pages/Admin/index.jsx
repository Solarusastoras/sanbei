import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { addProduct, deleteProduct } from '../../useProducts';
import Login from '../Login';
import './admin.scss';

const CATEGORIES = {
  plat:     ['Viande', 'Poisson', 'Végétarien', 'Soupe', 'Dessert', 'Autre'],
  epicerie: ['Frais', 'Épicerie sèche', 'Boissons', 'Fromages', 'Autre'],
};

const EMPTY_FORM = {
  title: '', description: '', price: '',
  category: '', tag: '', unit: '', type: 'plat',
};

// ── Upload image vers Supabase Storage ──────────────────────────────────────
async function uploadImage(file) {
  const ext      = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('products')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) return { url: null, error };

  const { data } = supabase.storage.from('products').getPublicUrl(filename);
  return { url: data.publicUrl, error: null };
}

function Admin() {
  const [session, setSession]       = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [form, setForm]             = useState(EMPTY_FORM);
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState('');
  const [formError, setFormError]   = useState('');
  const fileInputRef                = useRef(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchProducts();
  }, [session]);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  }

  // ── Gestion fichier image ─────────────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Vérif type et taille (max 5 Mo)
    if (!file.type.startsWith('image/')) {
      setFormError('Le fichier doit être une image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image trop lourde (max 5 Mo).');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError('');
  }

  function handleDropZoneClick() {
    fileInputRef.current?.click();
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!form.title || !form.price || !form.category) {
      setFormError('Titre, prix et catégorie sont obligatoires.');
      return;
    }

    setSubmitting(true);
    let imageUrl = null;

    // Upload image si sélectionnée
    if (imageFile) {
      setUploading(true);
      const { url, error } = await uploadImage(imageFile);
      setUploading(false);
      if (error) {
        setFormError("Erreur upload image : " + error.message);
        setSubmitting(false);
        return;
      }
      imageUrl = url;
    }

    const { error } = await addProduct({
      title:       form.title.trim(),
      description: form.description.trim() || null,
      price:       parseFloat(form.price),
      image:       imageUrl,
      category:    form.category,
      tag:         form.tag.trim() || null,
      unit:        form.unit.trim() || null,
      type:        form.type,
    });

    if (error) {
      setFormError("Erreur lors de l'ajout : " + error.message);
    } else {
      setSuccess(`✓ "${form.title}" ajouté avec succès !`);
      setForm({ ...EMPTY_FORM, type: form.type });
      removeImage();
      fetchProducts();
    }
    setSubmitting(false);
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Supprimer "${title}" ?`)) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!session) return <Login onLogin={setSession} />;

  const filtered = filter === 'all' ? products : products.filter(p => p.type === filter);
  const isLoading = submitting || uploading;

  return (
    <div className="admin">
      <header className="admin__topbar">
        <div className="admin__brand">
          San<span>-Beï</span>
          <small>Admin</small>
        </div>
        <button className="admin__logout" onClick={handleLogout}>Déconnexion</button>
      </header>

      <div className="admin__layout">

        {/* ── Catalogue ── */}
        <div>
          <h2 className="admin__section-title">Catalogue ({products.length})</h2>
          <div className="admin__filter-bar">
            {[['all', 'Tout'], ['plat', 'Plats'], ['epicerie', 'Épicerie']].map(([val, label]) => (
              <button key={val}
                className={`admin__filter-btn${filter === val ? ' admin__filter-btn--active' : ''}`}
                onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>

          {loading ? (
            <div className="admin__empty"><span>⏳</span>Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="admin__empty"><span>🍃</span>Aucun article pour l'instant.</div>
          ) : (
            <div className="admin__list">
              {filtered.map(p => (
                <div key={p.id} className="admin__item">
                  <div className="admin__item-img">
                    {p.image ? <img src={p.image} alt={p.title} /> : (p.type === 'plat' ? '🍽️' : '🧺')}
                  </div>
                  <div className="admin__item-info">
                    <h4>{p.title}</h4>
                    <p>{p.category}{p.tag ? ` · ${p.tag}` : ''}{p.unit ? ` · ${p.unit}` : ''}</p>
                  </div>
                  <span className="admin__item-price">{parseFloat(p.price).toFixed(2)} €</span>
                  <span className={`admin__item-type admin__item-type--${p.type}`}>
                    {p.type === 'plat' ? 'Plat' : 'Épicerie'}
                  </span>
                  <button className="admin__item-delete"
                    onClick={() => handleDelete(p.id, p.title)} title="Supprimer">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Formulaire ── */}
        <div className="admin__form-card">
          <h2 className="admin__section-title">Ajouter un article</h2>

          <div className="admin__tabs">
            {[['plat', '🍽️ Plat'], ['epicerie', '🧺 Épicerie']].map(([val, label]) => (
              <button key={val} type="button"
                className={`admin__tab${form.type === val ? ' admin__tab--active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, type: val, category: '' }))}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin__field">
              <label>Titre *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder={form.type === 'plat' ? 'Ex : Risotto aux cèpes' : "Ex : Huile d'olive bio"}
                required />
            </div>

            <div className="admin__field">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Décrivez le produit en quelques mots…" />
            </div>

            <div className="admin__row">
              <div className="admin__field">
                <label>Prix (€) *</label>
                <input name="price" type="number" step="0.01" min="0"
                  value={form.price} onChange={handleChange} placeholder="12.50" required />
              </div>
              <div className="admin__field">
                <label>Unité</label>
                <input name="unit" value={form.unit} onChange={handleChange} placeholder="500g, pièce…" />
              </div>
            </div>

            <div className="admin__row">
              <div className="admin__field">
                <label>Catégorie *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Choisir…</option>
                  {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin__field">
                <label>Tag</label>
                <input name="tag" value={form.tag} onChange={handleChange} placeholder="Bio, Du jour…" />
              </div>
            </div>

            {/* ── Zone upload image ── */}
            <div className="admin__field">
              <label>Photo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div className="admin__img-preview">
                  <img src={imagePreview} alt="Aperçu" />
                  <button type="button" className="admin__img-remove" onClick={removeImage}>
                    ✕ Supprimer
                  </button>
                </div>
              ) : (
                <div
                  className="admin__dropzone"
                  onClick={handleDropZoneClick}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                >
                  <span className="admin__dropzone-icon">🖼️</span>
                  <span className="admin__dropzone-text">
                    Clique ou glisse une photo ici
                  </span>
                  <span className="admin__dropzone-hint">JPG, PNG, WEBP — max 5 Mo</span>
                </div>
              )}
            </div>

            {formError && <p className="admin__form-error">{formError}</p>}

            <button className="admin__submit" type="submit" disabled={isLoading}>
              {uploading ? '📤 Upload en cours…'
                : submitting ? '⏳ Ajout en cours…'
                : '＋ Ajouter au catalogue'}
            </button>

            {success && <p className="admin__success">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
