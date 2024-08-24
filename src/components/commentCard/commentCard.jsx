import React, { useContext } from 'react';
import { Context } from '../../context/context';
import './commentCard.css';

const CommentCard = ({ comentario, docente, materia, grupo, semestre, anho }) => {
  const { comentario: texto, calificacion, sentimiento } = comentario;
  const { appState } = useContext(Context);

  const getBackgroundColor = (sentimiento) => {
    switch (sentimiento) {
      case 'POS':
        return '#00545f';
      case 'NEG':
        return '#5c1313';
      case 'NEU':
        return '#313131';
      default:
        return '#000000';
    }
  };

  return (
    <div className="comment-card" style={{ backgroundColor: getBackgroundColor(sentimiento) }}>
      <p><strong>Comentario:</strong> {texto}</p>
      {/* <p><strong>Calificación:</strong> {calificacion}</p> */}
      <p><strong>Usuario:</strong> {docente.usuario}</p>
      {(appState.typeUser === 'daca' || appState.typeUser === 'director_programa') && (
      <p><strong>Género Docente:</strong> {docente.genero}</p>
        )}
      <p><strong>Código Materia:</strong> {materia.codigo}</p>
      <p><strong>Materia:</strong> {materia.nombre}</p>
      <p><strong>Escuela:</strong> {materia.escuela}</p>
      <p><strong>Grupo:</strong> {grupo}</p>
      <p><strong>Semestre:</strong> {semestre}</p>
      <p><strong>Año:</strong> {anho}</p>
    </div>
  );
};

export default CommentCard;