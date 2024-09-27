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
  const [semestres, setSemestres] = useState({});
  const [bestComments, setBestComments] = useState([]);
  const [worstComments, setWorstComments] = useState([]);
  const [combinedComments, setCombinedComments] = useState([]);
  const [analisisComentarios, setAnalisisComentarios] = useState("");

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
        const sortedCommentsDescending = [...data].sort(
          (a, b) => b.comentario.calificacion - a.comentario.calificacion
        );
        const sortedCommentsAscending = [...data].sort(
          (a, b) => a.comentario.calificacion - b.comentario.calificacion
        );

        // Filtrar los 5 mejores y 5 peores comentarios
        const mejores = sortedCommentsDescending.slice(0, 5);
        const peores = sortedCommentsAscending.slice(0, 5);

        setBestComments(mejores);
        setWorstComments(peores);

        setCombinedComments([...mejores, ...peores]);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Nuevo useEffect para las peticiones al backend (IA y TF-IDF)
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
      const texto1 =
        "Quiero que analices la siguiente informacion y me des tu opinion sobre los comentarios positivos, neutrales y negativos por cada semestre que hicieron los estudiantes a sus docentes. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
      const texto2 =
        "Quiero que analices la siguiente informacion y me des tu opinion sobre los comentarios positivos, neutrales y negativos por cada semestre que hicieron los estudiantes a su docente. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
      const texto3 =
        "Quiero que realices analisis topico a la siguiente informacion que contiene los 5 mejores y los 5 peores comentarios que tiene un conjunto de docentes. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";
      const texto4 =
        "Quiero que realices analisis topico a la siguiente informacion que contiene los 5 mejores y los 5 peores comentarios que tiene un docente. Quiero que tu opinion sea resumida para no abrumar al usuario con mucha informacion. Puedes usar 2000 caracteres como maximo y toda la informacion debe estar en un solo parrafo";

      let textoSeleccionado1 = "";
      let textoSeleccionado2 = "";

      // Condicional para seleccionar el texto según el tipo de usuario
      if (appState.typeUser === "daca" || appState.typeUser === "director_escuela") {
        textoSeleccionado1 = texto1;
        textoSeleccionado2 = texto3;
      } else if (appState.typeUser === "docente") {
        textoSeleccionado1 = texto2;
        textoSeleccionado2 = texto4;
      }

      const resultado1 = await sendCommentsToBackend(semestres, textoSeleccionado1);
      const resultado2 = await sendCommentsToBackend(combinedComments, textoSeleccionado2);

      console.log("Primer análisis:", resultado1);
      console.log("Segundo análisis:", resultado2);

      setGeneratedText(resultado1);
      setAnalisisComentarios(resultado2);
    };

    const fetchTFIDF = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tfidf-data/", {
          headers: {
            Authorization: appState.token,
          },
        });
        const data = await response.json();

        const tfidfGeneral = Object.entries(data.general).map(([value, count]) => ({ value, count }));
        const tfidfHombres = Object.entries(data.hombres).map(([value, count]) => ({ value, count }));
        const tfidfMujeres = Object.entries(data.mujeres).map(([value, count]) => ({ value, count }));

        setTfidfData({ general: tfidfGeneral, hombres: tfidfHombres, mujeres: tfidfMujeres });
      } catch (error) {
        console.error("Error fetching TF-IDF data:", error);
      }
    };

    fetchGeneratedTexts();
    fetchTFIDF();
  }, [comments]);

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
            <CommentsSummary
              comments={comments}
              typeUser={appState.typeUser}
              bestComments={bestComments}
              worstComments={worstComments}
              analisisComentarios={analisisComentarios}
            />
          )}
          {currentTab === 1 && (
            <Graphics
              typeUser={appState.typeUser}
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
