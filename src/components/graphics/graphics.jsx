import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { TagCloud } from "react-tagcloud";
import "./graphics.css";

const Graphics = ({ chartData, generatedText, tfidfData }) => {

  const options = {
    luminosity: "dark",
    hue: "blue",
  };

  return (
    <div className="graphics-container">
      <div className="graphics-title">
        <h2>Comentarios por Semestre</h2>
      </div>
      <div>
        <BarChart
          xAxis={[
            {
              data: chartData.labels,
              label: "Semestre",
              scaleType: "band", // Asegurar que el eje X use escala de bandas
            },
          ]}
          series={[
            {
              data: chartData.positiveSeries,
              label: "Positivos",
              color: "rgba(75, 192, 192, 0.6)",
            },
            {
              data: chartData.neutralSeries,
              label: "Neutrales",
              color: "rgba(153, 102, 255, 0.6)",
            },
            {
              data: chartData.negativeSeries,
              label: "Negativos",
              color: "rgba(255, 99, 132, 0.6)",
            },
          ]}
          height={300}
          className="barchart-custom"
        />
      </div>
      {generatedText && (
        <div className="generated-text">
          <h3>Opinión de la IA</h3>
          <p>{generatedText}</p>
        </div>
      )}
      <div className="cloud-container">
        <div>
          <h2>Nube de Palabras</h2>
        </div>
        <div className="word-cloud">
          <TagCloud
            minSize={16}
            maxSize={50}
            tags={tfidfData}
            colorOptions={options}
          />
        </div>
      </div>
    </div>
  );
};

export default Graphics;
