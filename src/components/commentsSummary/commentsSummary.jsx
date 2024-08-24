import React from "react";
import Rating from "@mui/material/Rating";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import "./commentsSummary.css";

const CommentsSummary = ({ comments }) => {
  const totalComments = comments.length;
  const positiveComments = comments.filter(
    (comment) => comment.comentario.sentimiento === "POS"
  ).length;
  const neutralComments = comments.filter(
    (comment) => comment.comentario.sentimiento === "NEU"
  ).length;
  const negativeComments = comments.filter(
    (comment) => comment.comentario.sentimiento === "NEG"
  ).length;

  // Calcular promedio de calificaciones
  const averageRating =
    comments.reduce(
      (sum, comment) => sum + comment.comentario.calificacion,
      0
    ) / totalComments;

  // Determinar la clase CSS según el valor de averageRating
  const ratingClass =
    averageRating >= 4
      ? "positive-comments"
      : averageRating >= 3
      ? "neutral-comments"
      : "negative-comments";

  // Datos para el PieChart
  const data = [
    {
      label: "Positivos",
      value: positiveComments,
      percentage: ((positiveComments / totalComments) * 100).toFixed(1) + "%",
    },
    {
      label: "Neutrales",
      value: neutralComments,
      percentage: ((neutralComments / totalComments) * 100).toFixed(1) + "%",
    },
    {
      label: "Negativos",
      value: negativeComments,
      percentage: ((negativeComments / totalComments) * 100).toFixed(1) + "%",
    },
  ];

  // Colores correspondientes para cada segmento del gráfico
  const palette = ["#00545f", "#313131", "#5c1313"];

  return (
    <div className="comments-summary">
      <div className="first-comments-summary">
        <div className="comments-card-summary total-comments">
          <div className="total-value">
            <h2>{totalComments}</h2>
          </div>
          <div>Comentarios</div>
          <div>Totales</div>
        </div>
        <div className="comments-card-summary positive-comments">
          <div className="total-value">
            <h2>{positiveComments}</h2>
          </div>
          <div>Positivos</div>
        </div>
        <div className="comments-card-summary neutral-comments">
          <div className="total-value">
            <h2>{neutralComments}</h2>
          </div>
          <div>Neutrales</div>
        </div>
        <div className="comments-card-summary negative-comments">
          <div className="total-value">
            <h2>{negativeComments}</h2>
          </div>
          <div>Negativos</div>
        </div>
      </div>
      <div className="second-comments-summary">
        <div className="pie-chart-container">
          <div>Porcentaje por Polaridad</div>
          <PieChart
            // series={[
            //   {
            //     data: data.map(({ label, value, percentage }) => ({
            //       id: label,
            //       label: `${percentage}`,
            //       value,
            //     })),
            //   },
            // ]}
            series={[
              {
                arcLabel: (item) => `${item.percentage}`,
                arcLabelMinAngle: 45,
                data,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontWeight: 'bold',
              },
            }}
            colors={palette}
            width={340}
            height={200}
          />
        </div>
        <div className={`rating-card ${ratingClass}`}>
          <div>Promedio de Calificación</div>
          <div className="total-value">
            <h2>{averageRating.toFixed(1)}</h2>
          </div>
          <div>
            <Rating
              name="average-rating"
              value={averageRating}
              precision={0.1}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSummary;
