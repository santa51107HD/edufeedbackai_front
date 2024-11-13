import { useContext, useEffect } from "react";
import React, { useState } from 'react';
import './login.css';
import { Context } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";

const Login = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { appState, setAppState } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (appState.loggedIn && window.location.pathname !== '/') {// Evitar que se redirija infinitamente si esta logeado
      navigate('/'); // Redirige a la página principal solo si no estás ya en ella
    }
  }, [appState.loggedIn, navigate]);

  const consultaUsuarioBD = async (datos) => {
    const data = await fetch("http://127.0.0.1:8000/login/", datos);
    return data.json();
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    let toSend = {
      username: code,
      password: password,
    };

    const datos = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(toSend),
    };

    const response = await consultaUsuarioBD(datos);

    if (!response.error) {
      let typeUser = null;
      if (response.is_docente === true) {
        typeUser = "docente";
      } else if (response.is_director_escuela === true) {
        typeUser = "director_escuela";
      } else if (response.is_daca === true) {
        typeUser = "daca";
      }

      let newData = {
        loggedIn: true,
        typeUser: typeUser,
        name: response.nombre,
        token: `Token ${response.token}`,
      };
      setAppState(newData);
      navigate('/');
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {loading && <LoadingSpinner />}
      <form className="login-form">
        <h1>EduFeedbackAI</h1>
        <h2>Inicio de Sesión</h2>
        <div className="input-group">
          <label htmlFor="code">Usuario:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="login-alert">Credenciales incorrectas, por favor intente de nuevo.</p>}
        <button className="login-button" type="submit" onClick={login}>Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
