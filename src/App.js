import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './Composants/Header';
import Footer from './Composants/Footer';
import Home from './Pages/Home';
import Epicerie from './Pages/Epicerie';
import Plats from './Pages/Plats';
import Admin from './Pages/Admin';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/epicerie" element={<Epicerie />} />
        <Route path="/plats"   element={<Plats />} />
        <Route path="/admin"   element={<Admin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
