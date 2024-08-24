import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import "./graphics.css";

const Graphics = ({ comments }) => {
  // Agrupar comentarios por semestre
  const groupedData = comments.reduce((acc, comment) => {
    const { sentimiento } = comment.comentario; // Acceder al sentimiento dentro de comentario
    const { semestre } = comment; // Acceder al semestre directamente

    //Se verifica si ya existe una entrada para ese semestre en acc. Si no existe, se crea un nuevo objeto con contadores
    if (!acc[semestre]) {
      acc[semestre] = { positive: 0, neutral: 0, negative: 0 };
    }

    if (sentimiento === "POS") {
      acc[semestre].positive += 1;
    } else if (sentimiento === "NEU") {
      acc[semestre].neutral += 1;
    } else if (sentimiento === "NEG") {
      acc[semestre].negative += 1;
    }

    return acc;
  }, {});

  // Preparar los datos para el gráfico de barras
  const labels = Object.keys(groupedData).sort();
  const positiveSeries = labels.map((label) => groupedData[label].positive);
  const neutralSeries = labels.map((label) => groupedData[label].neutral);
  const negativeSeries = labels.map((label) => groupedData[label].negative);

  return (
    <div className="graphics-container">
      <div className="graphics-title">
        <h2>Comentarios por Semestre</h2>
      </div>
      <div>
        <BarChart
          xAxis={[
            {
              data: labels,
              label: "Semestre",
              scaleType: "band", // Asegurar que el eje X use escala de bandas
            },
          ]}
          series={[
            {
              data: positiveSeries,
              label: "Positivos",
              color: "rgba(75, 192, 192, 0.6)",
            },
            {
              data: neutralSeries,
              label: "Neutrales",
              color: "rgba(153, 102, 255, 0.6)",
            },
            {
              data: negativeSeries,
              label: "Negativos",
              color: "rgba(255, 99, 132, 0.6)",
            },
          ]}
          height={300}
          className="barchart-custom"
        />
      </div>
    </div>
  );
};

export default Graphics;
