import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import "./graphics.css";

const Graphics = ({ comments, appState }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    positiveSeries: [],
    neutralSeries: [],
    negativeSeries: [],
  });
  const [generatedText, setGeneratedText] = useState("");

  useEffect(() => {
    if (!appState.token || comments.length === 0) return;

    // Procesamiento de los datos
    const groupedData = comments.reduce((acc, comment) => {
      const { sentimiento } = comment.comentario;
      const { semestre } = comment;

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

    // Actualizar el estado con los datos del gráfico
    setChartData({ labels, positiveSeries, neutralSeries, negativeSeries });

    // Enviar datos procesados al backend
    const sendCommentsToBackend = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/analizar/comentarios/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: appState.token,
            },
            body: JSON.stringify(groupedData),
          }
        );

        const data = await response.json();
        console.log(data.texto_generado);
        setGeneratedText(data.texto_generado);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendCommentsToBackend();
  }, []);

  // console.log(groupedData);

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
    </div>
  );
};

export default Graphics;
