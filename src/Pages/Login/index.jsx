import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import './login.scss';

function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Identifiants incorrects.');
    } else {
      onLogin(data.session);
      navigate('/admin');
    }
    setLoading(false);
  }

  return (
    <div className="login">
      <div className="login__card">
        <h1 className="login__logo">San<span>-Beï</span></h1>
        <p className="login__sub">Espace propriétaire</p>

        <form onSubmit={handleSubmit}>
          <div className="login__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="vous@sanbe.fr"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login__field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login__error">{error}</p>}

          <button className="login__btn" type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <button
          className="login__back"
          onClick={() => navigate('/')}
          type="button"
        >
          ← Retour au site
        </button>
      </div>
    </div>
  );
}

export default Login;
