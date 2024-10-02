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
  const [analisisGraficoBarras, setAnalisisGraficoBarras] = useState("");
  const [analisisComentariosGenerales, setAnalisisComentariosGenerales] =
    useState("");
  const [analisisComentariosGenero, setAnalisisComentariosGenero] =
    useState("");
  const [analisisTFIDFGenero, setAnalisisTFIDFGenero] = useState("");
  const [tfidfData, setTfidfData] = useState([]);
  const [semestres, setSemestres] = useState({});
  const [combinedComments, setCombinedComments] = useState({
    bestGeneralComments: [],
    worstGeneralComments: [],
    bestMaleComments: [],
    worstMaleComments: [],
    bestFemaleComments: [],
    worstFemaleComments: [],
  });

  //Traer los comentarios del backend
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

        // Filtrar los comentarios por género
        const maleComments = data.filter(
          (comment) => comment.docente.genero === "male"
        );
        const femaleComments = data.filter(
          (comment) => comment.docente.genero === "female"
        );

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

        setSemestres(groupedData);

        const labels = Object.keys(groupedData).sort();
        const positiveSeries = labels.map(
          (label) => groupedData[label].positive
        );
        const neutralSeries = labels.map((label) => groupedData[label].neutral);
        const negativeSeries = labels.map(
          (label) => groupedData[label].negative
        );

        setChartData({ labels, positiveSeries, neutralSeries, negativeSeries });

        // Ordenar los comentarios por calificación de manera descendente y ascendente
        const sortByRatingDesc = (comments) =>
          [...comments].sort(
            (a, b) => b.comentario.calificacion - a.comentario.calificacion
          );
        const sortByRatingAsc = (comments) =>
          [...comments].sort(
            (a, b) => a.comentario.calificacion - b.comentario.calificacion
          );
        // Filtrar los 5 mejores y 5 peores comentarios
        // Generales
        const bestGeneralComments = sortByRatingDesc(data).slice(0, 5);
        const worstGeneralComments = sortByRatingAsc(data).slice(0, 5);

        // Hombres
        const bestMaleComments = sortByRatingDesc(maleComments).slice(0, 5);
        const worstMaleComments = sortByRatingAsc(maleComments).slice(0, 5);

        // Mujeres
        const bestFemaleComments = sortByRatingDesc(femaleComments).slice(0, 5);
        const worstFemaleComments = sortByRatingAsc(femaleComments).slice(0, 5);

        setCombinedComments({
          bestGeneralComments,
          worstGeneralComments,
          bestMaleComments,
          worstMaleComments,
          bestFemaleComments,
          worstFemaleComments,
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  //Calcular el TF-IDF
  useEffect(() => {
    if (comments.length === 0) return; // Asegurarse de que hay comentarios antes de hacer las peticiones
    const fetchTFIDF = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tfidf-data/", {
          headers: {
            Authorization: appState.token,
          },
        });
        const data = await response.json();

        const tfidfGeneral = Object.entries(data.general).map(
          ([value, count]) => ({ value, count })
        );
        const tfidfHombres = Object.entries(data.hombres).map(
          ([value, count]) => ({ value, count })
        );
        const tfidfMujeres = Object.entries(data.mujeres).map(
          ([value, count]) => ({ value, count })
        );

        setTfidfData({
          general: tfidfGeneral,
          hombres: tfidfHombres,
          mujeres: tfidfMujeres,
        });
      } catch (error) {
        console.error("Error fetching TF-IDF data:", error);
      }
    };

    fetchTFIDF();
  }, [comments]);

  // useEffect para la generacion de texto con Gemini
  useEffect(() => {
    if (comments.length === 0) return; // Asegurarse de que hay comentarios antes de hacer las peticiones

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
        return data.texto_generado;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    };

    const fetchGeneratedTexts = async () => {
      const promptGraficoBarrasPlural =
        "Quiero que analices la siguiente informacion y me des tu opinion sobre los comentarios positivos, neutrales y negativos por cada semestre que hicieron los estudiantes a sus docentes. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
      const promptGraficoBarrasSingular =
        "Quiero que analices la siguiente informacion y me des tu opinion sobre los comentarios positivos, neutrales y negativos por cada semestre que hicieron los estudiantes a su docente. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
      const promptTopComentariosGeneralesPlural =
        "Quiero que realices analisis topico a la siguiente informacion que contiene los 5 mejores y los 5 peores comentarios que tiene un conjunto de docentes. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
      const promptTopComentariosGeneralesSingular =
        "Quiero que realices analisis topico a la siguiente informacion que contiene los 5 mejores y los 5 peores comentarios que tiene un docente. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";

      let promptGraficoBarras = "";
      let promptTopComentariosGenerales = "";

      // Condicional para seleccionar el prompt según el tipo de usuario
      if (
        appState.typeUser === "daca" ||
        appState.typeUser === "director_escuela"
      ) {
        promptGraficoBarras = promptGraficoBarrasPlural;
        promptTopComentariosGenerales = promptTopComentariosGeneralesPlural;

        const comentariosGenero = {
          hombres: [
            combinedComments.bestMaleComments,
            combinedComments.worstMaleComments,
          ],
          mujeres: [
            combinedComments.bestFemaleComments,
            combinedComments.worstFemaleComments,
          ],
        };

        const promptTopComentariosGenero =
          "Quiero que realices analisis topico a la siguiente informacion que contiene los 5 mejores y los 5 peores comentarios que tiene un conjunto de docentes hombres y docentes mujeres y los compares por genero. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 3000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";

        const promptTFIDFGenero =
          "Quiero que analices la siguiente informacion que contiene las puntuaciones de TF-IDF de un conjunto de comentarios sobre docentes, la informacion esta dividida por genero y de forma general. Quiero que encuentres patrones, similitudes y diferencias. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 3000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";

        const respuestaTopComentariosGenero = await sendCommentsToBackend(
          comentariosGenero,
          promptTopComentariosGenero
        );
        const respuestaTFIDFGenero = await sendCommentsToBackend(
          tfidfData,
          promptTFIDFGenero
        );

        console.log(
          "Analisis Comentarios por Genero:",
          respuestaTopComentariosGenero
        );
        console.log("Analisis TFIDF por Genero:", respuestaTFIDFGenero);
        //console.log("TFIDF", tfidfData);
        setAnalisisComentariosGenero(respuestaTopComentariosGenero);
        setAnalisisTFIDFGenero(respuestaTFIDFGenero);
      } else if (appState.typeUser === "docente") {
        promptGraficoBarras = promptGraficoBarrasSingular;
        promptTopComentariosGenerales = promptTopComentariosGeneralesSingular;
      }

      const respuestaGraficoBarras = await sendCommentsToBackend(
        semestres,
        promptGraficoBarras
      );
      const respuestaTopComentariosGenerales = await sendCommentsToBackend(
        [
          combinedComments.bestGeneralComments,
          combinedComments.worstGeneralComments,
        ],
        promptTopComentariosGenerales
      );

      console.log("Grafico análisis:", respuestaGraficoBarras);
      console.log(
        "Comentarios Generales análisis:",
        respuestaTopComentariosGenerales
      );

      setAnalisisGraficoBarras(respuestaGraficoBarras);
      setAnalisisComentariosGenerales(respuestaTopComentariosGenerales);
    };

    fetchGeneratedTexts();
  }, [tfidfData]);

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
            <Tab label="Resumen" disabled={appState.isUploading} />
            <Tab label="Gráficas" disabled={appState.isUploading} />
            <Tab label="Comentarios" disabled={appState.isUploading} />
            {appState.typeUser === "daca" && (
              <Tab label="Cargar Datos" disabled={appState.isUploading} />
            )}
          </Tabs>
        </div>
        <div>
          {currentTab === 0 && (
            <CommentsSummary
              comments={comments}
              typeUser={appState.typeUser}
              combinedComments={combinedComments}
              analisisComentariosGenerales={analisisComentariosGenerales}
              analisisComentariosGenero={analisisComentariosGenero}
            />
          )}
          {currentTab === 1 && (
            <Graphics
              typeUser={appState.typeUser}
              chartData={chartData}
              analisisGraficoBarras={analisisGraficoBarras}
              tfidfData={tfidfData}
              analisisTFIDFGenero={analisisTFIDFGenero}
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
