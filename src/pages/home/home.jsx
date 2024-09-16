import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context";
import Header from "../../components/header/header";
import CommentsFilter from "../../components/commentsFilter/commentsFilter";
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";
import { Tabs, Tab, Typography } from "@mui/material";
import Graphics from "../../components/graphics/graphics";
import CommentsSummary from "../../components/commentsSummary/commentsSummary";
import UpdateData from "../../components/updateData/updateData";
import "./home.css";

const Home = () => {
  const { appState } = useContext(Context);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    positiveSeries: [],
    neutralSeries: [],
    negativeSeries: [],
  });
  const [generatedText, setGeneratedText] = useState("");
  const [tfidfData, setTfidfData] = useState([]);

  useEffect(() => {
    if (!appState.token) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/evaluaciones/docente/",
          {
            headers: {
              Authorization: appState.token,
            },
          }
        );
        const data = await response.json();
        setComments(data);

        // Procesamiento de los datos para la grafica de barras
        const groupedData = data.reduce((acc, comment) => {
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

        const labels = Object.keys(groupedData).sort();
        const positiveSeries = labels.map(
          (label) => groupedData[label].positive
        );
        const neutralSeries = labels.map((label) => groupedData[label].neutral);
        const negativeSeries = labels.map(
          (label) => groupedData[label].negative
        );

        setChartData({ labels, positiveSeries, neutralSeries, negativeSeries });

        // Enviar datos procesados al backend para análisis de IA
        const sendCommentsToBackend = async (datos, texto) => {
          try {

            const response = await fetch(
              "http://127.0.0.1:8000/analizar/comentarios/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: appState.token,
                },
                body: JSON.stringify({
                  datos: datos,
                  texto: texto,
                }),
              }
            );

            const data = await response.json();
            //setGeneratedText(data.texto_generado);
            return data.texto_generado;
          } catch (error) {
            console.error("Error:", error);
            return null;
          }
        };

        const fetchGeneratedTexts = async () => {
          const texto1 = "Quiero que analices la siguiente informacion y me des tu opinion sobre los comentarios positivos, neutrales y negativos por cada semestre que hicieron los estudiantes a sus docentes. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
          //const texto2 = "Texto personalizado para el segundo análisis";
      
          const resultado1 = await sendCommentsToBackend(groupedData, texto1);
          //const resultado2 = await sendCommentsToBackend(texto2);
      
          console.log("Primer análisis:", resultado1);
          //console.log("Segundo análisis:", resultado2);
      
          setGeneratedText(resultado1); 

        };
      
        fetchGeneratedTexts();

        // Obtener datos de TF-IDF
        const fetchTFIDF = async () => {
          try {
            const response = await fetch("http://127.0.0.1:8000/tfidf-data/", {
              headers: {
                Authorization: appState.token,
              },
            });
            const data = await response.json();
            const transformedData = Object.entries(data).map(
              ([value, count]) => ({
                value,
                count,
              })
            );
            setTfidfData(transformedData);
          } catch (error) {
            console.error("Error:", error);
          }
        };

        fetchTFIDF();
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [appState.token]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <div className="main-content-home">
        <div className="home">
          <h1>Bienvenido, {appState.name}</h1>
          <p>Tipo de Usuario: {appState.typeUser}</p>
        </div>
        <div className="tabs-container">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab label="Resumen" />
            <Tab label="Gráficas" />
            <Tab label="Comentarios" />
            {appState.typeUser === "daca" && <Tab label="Cargar Datos" />}
          </Tabs>
        </div>
        <div>
          {currentTab === 0 && (
            <CommentsSummary comments={comments} typeUser={appState.typeUser} />
          )}
          {currentTab === 1 && (
            <Graphics
              chartData={chartData}
              generatedText={generatedText}
              tfidfData={tfidfData}
            />
          )}
          {currentTab === 2 && (
            <CommentsFilter comments={comments} typeUser={appState.typeUser} />
          )}
          {currentTab === 3 && <UpdateData />}
        </div>
      </div>
    </div>
  );
};

export default Home;
