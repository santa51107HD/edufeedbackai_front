import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../context/context";
import Header from "../../components/header/header";
import CommentsFilter from "../../components/commentsFilter/commentsFilter";
import LoadingSpinner from "../../components/loadingSpinner/loadingSpinner";
import { Tabs, Tab, Typography} from "@mui/material";
import Graphics from "../../components/graphics/graphics";
import CommentsSummary from "../../components/commentsSummary/commentsSummary";
import "./home.css";

const Home = () => {
  const { appState } = useContext(Context);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

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
          </Tabs>
        </div>
        <div>
          {currentTab === 0 && (
            <CommentsSummary comments={comments} typeUser={appState.typeUser}/>
          )}
          {currentTab === 1 && (
            <Graphics comments={comments} appState={appState}/>
          )}
          {currentTab === 2 && (
            <CommentsFilter comments={comments} typeUser={appState.typeUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
