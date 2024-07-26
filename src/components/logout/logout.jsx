import React, { useContext, useState } from 'react';
import { Context } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { IconButton } from '@mui/material';
import './logout.css'

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
      <IconButton onClick={handleLogout} className="logout-button">
        <ExitToAppIcon />
      </IconButton>
    </>
    
  );
};

export default Logout;