import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../../context/context';

const PrivateRoute = ({ children }) => {
  const { appState } = useContext(Context);
  return appState.loggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
