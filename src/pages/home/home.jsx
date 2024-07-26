import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/context';
import Header from '../../components/header/header';
import CommentCard from '../../components/commentCard/commentCard';
import LoadingSpinner from '../../components/loadingSpinner/loadingSpinner';
import './home.css'

const Home = () => {
  const { appState } = useContext(Context);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/evaluaciones/docente/', {
          headers: {
            'Authorization': appState.token,
          },
        });
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };

    fetchComments();
  }, [appState.token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <div className='home'>
        <h1>Bienvenido, {appState.name}</h1>
        <p>Tipo de Usuario: {appState.typeUser}</p>
      </div>
      <div className="comments-container">
        {comments.map((comment, index) => (
          <CommentCard key={index} {...comment} />
        ))}
      </div>
    </div>
  );
};

export default Home;
