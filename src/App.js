import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { FavorisProvider } from './FavorisContext';
import Header from './Composants/Header';
import Footer from './Composants/Footer';
import Home from './Pages/Home';
import Epicerie from './Pages/Epicerie';
import Plats from './Pages/Plats';
import Admin from './Pages/Admin';
import Favoris from './Pages/Favoris';
import { useFavoris } from './FavorisContext';

function AppContent() {
  const [showFavoris, setShowFavoris] = useState(false);
  const { favoris } = useFavoris();

  return (
    <>
      <Header onFavorisClick={() => setShowFavoris(true)} favorisCount={favoris.length} />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/epicerie" element={<Epicerie />} />
        <Route path="/plats"    element={<Plats />} />
        <Route path="/admin"    element={<Admin />} />
      </Routes>
      <Footer />
      {showFavoris && <Favoris onClose={() => setShowFavoris(false)} />}
    </>
  );
}

function App() {
  return (
    <FavorisProvider>
      <Router>
        <AppContent />
      </Router>
    </FavorisProvider>
  );
}

export default App;
