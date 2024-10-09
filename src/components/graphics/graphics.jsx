import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { TagCloud } from "react-tagcloud";
import GeneratedTextCard from "../generatedTextCard/generatedTextCard";
import Skeleton from "@mui/material/Skeleton";
import "./graphics.css";

const Graphics = ({
  typeUser,
  chartData,
  analisisGraficoBarras,
  tfidfData,
  analisisTFIDFGenero,
}) => {
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
      {analisisGraficoBarras ? (
        <GeneratedTextCard
          tittle={"Análisis del gráfico de barras por Gemini"}
          content={analisisGraficoBarras}
        />
      ) : (
        <div className="skeleton-container-graphics">
          <Skeleton
            sx={{ bgcolor: "#00545f" }}
            variant="rectangular"
            width="80%"
            height={60}
          />
        </div>
      )}
      <div className="cloud-container">
        {typeUser === "daca" || typeUser === "director_escuela" ? (
          <>
            <div>
              <h2>Nubes de Palabras</h2>
            </div>
            <div>
              <h3>General</h3>
            </div>
          </>
        ) : (
          <div>
            <h2>Nube de Palabras</h2>
          </div>
        )}
        {tfidfData?.general && tfidfData.general.length > 0 ? (
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
        <>
          <div className="gender-cloud-container">
            <div className="male-cloud-container">
              <div className="gender-subtitle-graphics">
                <h3>Hombres</h3>
              </div>
              {tfidfData?.hombres && tfidfData.hombres.length > 0 ? (
                <div className="word-cloud">
                  <TagCloud
                    minSize={16}
                    maxSize={50}
                    tags={tfidfData.hombres}
                    colorOptions={options}
                  />
                </div>
              ) : (
                <h5 className="no-data-white">No hay datos para mostrar</h5>
              )}
            </div>
            <div className="female-cloud-container">
              <div className="gender-subtitle-graphics">
                <h3>Mujeres</h3>
              </div>
              {tfidfData?.mujeres && tfidfData.mujeres.length > 0 ? (
                <div className="word-cloud">
                  <TagCloud
                    minSize={16}
                    maxSize={50}
                    tags={tfidfData.mujeres}
                    colorOptions={options}
                  />
                </div>
              ) : (
                <h5 className="no-data-white">No hay datos para mostrar</h5>
              )}
            </div>
          </div>
          {analisisTFIDFGenero ? (
              <GeneratedTextCard
                tittle={"Análisis de las nubes de palabras por Gemini"}
                content={analisisTFIDFGenero}
              />
          ) : (
            <div className="skeleton-container-graphics">
              <Skeleton
                sx={{ bgcolor: "#00545f" }}
                variant="rectangular"
                width="80%"
                height={60}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Graphics;
