import React, { useContext, useState } from 'react';
import { Context } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';

const Logout = () => {
  const { setAppState } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setAppState({
      loggedIn: false,
      typeUser: "",
      name: "",
      token: "",
    });
    localStorage.removeItem("appState");
    setLoading(false);
    navigate('/login');
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </>
    
  );
};

export default Logout;