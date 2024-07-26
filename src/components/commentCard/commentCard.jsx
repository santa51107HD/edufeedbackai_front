import React from 'react';
import './commentCard.css';

const CommentCard = ({ comentario, docente, materia, grupo, semestre, anho }) => {
  const { comentario: texto, calificacion, sentimiento } = comentario;

  const getBackgroundColor = (sentimiento) => {
    switch (sentimiento) {
      case 'POS':
        return '#035f00';
      case 'NEG':
        return '#5f0000';
      case 'NEU':
        return '#00545f';
      default:
        return '#000000';
    }
  };

  return (
    <div className="comment-card" style={{ backgroundColor: getBackgroundColor(sentimiento) }}>
      <p><strong>Comentario:</strong> {texto}</p>
      <p><strong>Calificación:</strong> {calificacion}</p>
      <p><strong>Código Docente:</strong> {docente.usuario}</p>
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