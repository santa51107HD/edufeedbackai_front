import React from "react";
import Rating from "@mui/material/Rating";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import "./commentsSummary.css";

const CommentsSummary = ({ comments, typeUser, bestComments, worstComments, analisisComentarios }) => {
  const totalComments = comments.length;

  // Filtrar comentarios por género
  const maleComments = comments.filter(
    (comment) => comment.docente.genero === "male"
  );
  const femaleComments = comments.filter(
    (comment) => comment.docente.genero === "female"
  );

  // Filtrar comentarios por sentimiento
  const countSentiments = (filteredComments) => {
    const positive = filteredComments.filter(
      (comment) => comment.comentario.sentimiento === "POS"
    ).length;
    const neutral = filteredComments.filter(
      (comment) => comment.comentario.sentimiento === "NEU"
    ).length;
    const negative = filteredComments.filter(
      (comment) => comment.comentario.sentimiento === "NEG"
    ).length;

    return { positive, neutral, negative };
  };

  // Calcular promedio de calificación
  const calculateAverageRating = (filteredComments) => {
    if (filteredComments.length === 0) return 0;
    return (
      filteredComments.reduce(
        (sum, comment) => sum + comment.comentario.calificacion,
        0
      ) / filteredComments.length
    );
  };

  // Obtener datos para gráficos y calificación
  const totalSentiments = countSentiments(comments);
  const maleSentiments = countSentiments(maleComments);
  const femaleSentiments = countSentiments(femaleComments);

  const averageRating = calculateAverageRating(comments);
  const averageMaleRating = calculateAverageRating(maleComments);
  const averageFemaleRating = calculateAverageRating(femaleComments);

  // Determinar la clase CSS según el valor del rating
  const getRatingClass = (rating) =>
    rating >= 4
      ? "positive-comments"
      : rating >= 3
      ? "neutral-comments"
      : "negative-comments";

  // Datos para el PieChart
  const createPieData = ({ positive, neutral, negative }, total) => [
    {
      label: "Positivos",
      value: positive,
      percentage: ((positive / total) * 100).toFixed(1) + "%",
    },
    {
      label: "Neutrales",
      value: neutral,
      percentage: ((neutral / total) * 100).toFixed(1) + "%",
    },
    {
      label: "Negativos",
      value: negative,
      percentage: ((negative / total) * 100).toFixed(1) + "%",
    },
  ];

  const totalData = createPieData(totalSentiments, totalComments);
  const maleData = createPieData(maleSentiments, maleComments.length);
  const femaleData = createPieData(femaleSentiments, femaleComments.length);

  // Colores correspondientes para cada segmento del gráfico
  const palette = ["#00545f", "#313131", "#5c1313"];

  return (
    <div className="comments-summary">
      <div className="first-comments-summary">
        <div className="value-card-summary total-comments">
          <div className="total-value">
            <h2>{totalComments}</h2>
          </div>
          <div>Comentarios</div>
          <div>Totales</div>
        </div>
        <div className="value-card-summary positive-comments">
          <div className="total-value">
            <h2>{totalSentiments.positive}</h2>
          </div>
          <div>Positivos</div>
        </div>
        <div className="value-card-summary neutral-comments">
          <div className="total-value">
            <h2>{totalSentiments.neutral}</h2>
          </div>
          <div>Neutrales</div>
        </div>
        <div className="value-card-summary negative-comments">
          <div className="total-value">
            <h2>{totalSentiments.negative}</h2>
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
                data: totalData,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontWeight: "bold",
              },
            }}
            colors={palette}
            width={340}
            height={200}
          />
        </div>
        <div className={`rating-card ${getRatingClass(averageRating)}`}>
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
      {(typeUser === "daca" ||
        typeUser === "director_programa") && (
        <>
          <div className="gender-title-summary">
            <h2>Estadísticas por Género</h2>
          </div>
          <div className="gender-stadistics-container">
            <div className="male-stadistics-container">
              <div className="gender-subtitle-summary">
                <h3>Hombres</h3>
              </div>
              <div className="second-comments-summary">
                {/* Gráfico de pastel y tarjeta de calificación para docentes hombres */}
                <div className="pie-chart-container">
                  <div>Porcentaje por Polaridad</div>
                  <PieChart
                    series={[
                      {
                        arcLabel: (item) => `${item.percentage}`,
                        arcLabelMinAngle: 45,
                        data: maleData,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontWeight: "bold",
                      },
                    }}
                    colors={palette}
                    width={340}
                    height={200}
                  />
                </div>
                <div
                  className={`rating-card ${getRatingClass(averageMaleRating)}`}
                >
                  <div>Promedio de Calificación</div>
                  <div className="total-value">
                    <h2>{averageMaleRating.toFixed(1)}</h2>
                  </div>
                  <div>
                    <Rating
                      name="average-male-rating"
                      value={averageMaleRating}
                      precision={0.1}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="female-stadistics-container">
              <div className="gender-subtitle-summary">
                <h3>Mujeres</h3>
              </div>
              <div className="second-comments-summary">
                {/* Gráfico de pastel y tarjeta de calificación para docentes mujeres */}
                <div className="pie-chart-container">
                  <div>Porcentaje por Polaridad</div>
                  <PieChart
                    series={[
                      {
                        arcLabel: (item) => `${item.percentage}`,
                        arcLabelMinAngle: 45,
                        data: femaleData,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontWeight: "bold",
                      },
                    }}
                    colors={palette}
                    width={340}
                    height={200}
                  />
                </div>
                <div
                  className={`rating-card ${getRatingClass(
                    averageFemaleRating
                  )}`}
                >
                  <div>Promedio de Calificación</div>
                  <div className="total-value">
                    <h2>{averageFemaleRating.toFixed(1)}</h2>
                  </div>
                  <div>
                    <Rating
                      name="average-female-rating"
                      value={averageFemaleRating}
                      precision={0.1}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="third-comments-summary">
        {/* Mostrar los 5 mejores comentarios */}
        <div className="comments-list-summary">
          <h2 className="title-summary">Mejores Comentarios</h2>
          {bestComments.length > 0 ? (
            bestComments.map((comment, index) => (
              <div key={index} className="comment-card-summary best-comment">
                <p>{comment.comentario.comentario}</p>
                <Rating
                  name={`best-rating-${index}`}
                  value={comment.comentario.calificacion}
                  readOnly
                />
              </div>
            ))
          ) : (
            <p>No hay comentarios</p>
          )}
        </div>

        {/* Mostrar los 5 peores comentarios */}
        <div className="comments-list-summary">
          <h2 className="title-summary">Peores Comentarios</h2>
          {worstComments.length > 0 ? (
            worstComments.map((comment, index) => (
              <div key={index} className="comment-card-summary worst-comment">
                <p>{comment.comentario.comentario}</p>
                <Rating
                  name={`worst-rating-${index}`}
                  value={comment.comentario.calificacion}
                  readOnly
                />
              </div>
            ))
          ) : (
            <p>No hay comentarios</p>
          )}
        </div>
      </div>
      {analisisComentarios && (
        <div className="analisis-comentarios">
          <h3>Análisis de la IA</h3>
          <p>{analisisComentarios}</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSummary;
