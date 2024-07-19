import React, { useContext } from 'react';
import { Context } from '../../context/context';
import Logout from '../../components/logout/logout';
import './home.css'

const Home = () => {
  const { appState } = useContext(Context);

  return (
    <div className='home'>
      <h1>Bienvenido, {appState.name}</h1>
      <p>Tipo de Usuario: {appState.typeUser}</p>
      <Logout />
    </div>
  );
};

export default Home;
