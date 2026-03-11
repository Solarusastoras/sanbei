# San-Beï · Setup

## 1. Variables d'environnement
Crée un fichier `.env` à la racine :
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ta_clé_anon
```

## 2. Base de données Supabase
Exécute `supabase_schema.sql` dans l'éditeur SQL de ton projet Supabase.
Cela crée la table `products` avec les politiques RLS.

## 3. Créer le compte propriétaire
Dans Supabase → Authentication → Users → "Invite user"  
Entre l'email du propriétaire. Il recevra un lien pour définir son mot de passe.

## 4. Routes à configurer (React Router)
```jsx
<Routes>
  <Route path="/"         element={<Home />} />
  <Route path="/plats"    element={<Plats />} />
  <Route path="/epicerie" element={<Epicerie />} />
  <Route path="/admin"    element={<Admin />} />
</Routes>
```

## 5. Structure des fichiers livrés
```
sanbe/
├── lib/supabase.js              ← Client Supabase
├── hooks/useProducts.js         ← fetch / add / delete / update
├── pages/
│   ├── Login/                   ← Authentification Supabase Auth
│   ├── Admin/                   ← Interface propriétaire (protégée)
├── supabase_schema.sql          ← Schéma SQL à exécuter
└── README.md
```
