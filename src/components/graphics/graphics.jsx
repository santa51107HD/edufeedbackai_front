import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { TagCloud } from "react-tagcloud";
import "./graphics.css";

const Graphics = ({ typeUser, chartData, generatedText, tfidfData }) => {
  const options = {
    luminosity: "dark",
    hue: "blue",
  };

  return (
    <div>
      <div className="graphics-title">
        <h2>Comentarios por Semestre</h2>
      </div>
      <div className="barchart-container">
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
          <h3>Análisis del gráfico de barras por Gemini</h3>
          <p>{generatedText}</p>
        </div>
      )}
      <div className="cloud-container">
        <div>
          <h2>Nubes de Palabras</h2>
        </div>
        <div>
          <h3>General</h3>
        </div>
        {tfidfData.general.length > 0 ? (
          <div className="word-cloud">
            <TagCloud
              minSize={16}
              maxSize={50}
              tags={tfidfData.general}
              colorOptions={options}
            />
          </div>
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
      {(typeUser === "daca" || typeUser === "director_escuela") && (
        <div className="gender-cloud-container">
          <div className="male-cloud-container">
            <div className="gender-subtitle-graphics">
              <h3>Hombres</h3>
            </div>
            {tfidfData.hombres.length > 0 ? (
              <div className="word-cloud">
                <TagCloud
                  minSize={16}
                  maxSize={50}
                  tags={tfidfData.hombres}
                  colorOptions={options}
                />
              </div>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
          <div className="female-cloud-container">
            <div className="gender-subtitle-graphics">
              <h3>Mujeres</h3>
            </div>
            {tfidfData.mujeres.length > 0 ? (
              <div className="word-cloud">
                <TagCloud
                  minSize={16}
                  maxSize={50}
                  tags={tfidfData.mujeres}
                  colorOptions={options}
                />
              </div>
            ) : (
              <p>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Graphics;
