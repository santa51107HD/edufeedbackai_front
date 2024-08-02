import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/context';
import Header from '../../components/header/header';
import CommentCard from '../../components/commentCard/commentCard';
import LoadingSpinner from '../../components/loadingSpinner/loadingSpinner';
import { TextField, Autocomplete, Pagination } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton } from '@mui/material';
import './home.css'

const ITEMS_PER_PAGE = 6;

const Home = () => {
  const { appState } = useContext(Context);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    semestre: null,
    anho: null,
    sentimiento: null,
    codigoMateria: null,
    grupo: null,
    codigoDocente: null,
    genero: null
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/evaluaciones/docente/', {
          headers: {
            'Authorization': appState.token,
          },
        });
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };

    fetchComments();
  }, [appState.token]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);  // Cuando se aplica un filtro se regresa a la primera pagina
  };

  const resetFilters = () => {
    setFilters({
      semestre: null,
      anho: null,
      sentimiento: null,
      codigoMateria: null,
      grupo: null,
      codigoDocente: null,
      genero: null
    });
    setCurrentPage(1); // Regresar a la primera pagina
  };

  const uniqueValues = (array, key) => {
    return [...new Set(array.map(item => item[key]))];
  };

  const uniqueSemestres = uniqueValues(comments, 'semestre').sort();
  const uniqueAnhos = uniqueValues(comments, 'anho').sort((a, b) => a - b);
  const uniqueSentimientos = uniqueValues(comments.map(comment => comment.comentario), 'sentimiento').sort();
  const uniqueCodigosMateria = uniqueValues(comments.map(comment => comment.materia), 'codigo').sort();
  const uniqueGrupos = uniqueValues(comments, 'grupo').sort((a, b) => a - b);
  const uniqueCodigosDocente = uniqueValues(comments.map(comment => comment.docente), 'usuario').sort((a, b) => a - b);
  const uniqueGeneros = uniqueValues(comments.map(comment => comment.docente), 'genero').sort();

  const filteredComments = comments.filter(comment => {
    const { semestre, anho, sentimiento, codigoMateria, grupo, codigoDocente, genero } = filters;
    return (
      (semestre ? comment.semestre === semestre : true) &&
      (anho ? comment.anho === parseInt(anho) : true) &&
      (sentimiento ? comment.comentario.sentimiento === sentimiento : true) &&
      (codigoMateria ? comment.materia.codigo === codigoMateria : true) &&
      (grupo ? comment.grupo === parseInt(grupo) : true) &&
      (codigoDocente ? comment.docente.usuario === codigoDocente : true) &&
      (genero ? comment.docente.genero === genero : true)
    );
  });

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);//ceil redondea hacia arriba
  const paginatedComments = filteredComments.slice(//slice devuelve los comentarios de un indice inicial hasta el indice final(excluido)
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <div className='home'>
        <h1>Bienvenido, {appState.name}</h1>
        <p>Tipo de Usuario: {appState.typeUser}</p>
      </div>
      <div className="filters-container">
        <Autocomplete
          options={uniqueSemestres}
          value={filters.semestre}
          onChange={(e, value) => handleFilterChange('semestre', value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Semestre"
              variant="outlined"
              className="text-field-custom"
            />
          )}
          style={{minWidth: 160 }}
        />
        <Autocomplete
          options={uniqueAnhos}
          value={filters.anho}
          onChange={(e, value) => handleFilterChange('anho', value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Año"
              variant="outlined"
              className="text-field-custom"
            />
          )}
          getOptionLabel={(option) => option ? option.toString() : ""}
          style={{minWidth: 160 }}
        />
        <Autocomplete
          options={uniqueSentimientos}
          value={filters.sentimiento}
          onChange={(e, value) => handleFilterChange('sentimiento', value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sentimiento"
              variant="outlined"
              className="text-field-custom"
            />
          )}
          style={{minWidth: 160 }}
        />
        <Autocomplete
          options={uniqueCodigosMateria}
          value={filters.codigoMateria}
          onChange={(e, value) => handleFilterChange('codigoMateria', value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Código Materia"
              variant="outlined"
              className="text-field-custom"
            />
          )}
          style={{minWidth: 160 }}
        />
        <Autocomplete
          options={uniqueGrupos}
          value={filters.grupo}
          onChange={(e, value) => handleFilterChange('grupo', value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Grupo"
              variant="outlined"
              className="text-field-custom"
            />
          )}
          getOptionLabel={(option) => option ? option.toString() : ""}
          style={{minWidth: 160 }}
        />
        {(appState.typeUser === 'daca' || appState.typeUser === 'director_programa') && (
          <>
          <Autocomplete
            options={uniqueCodigosDocente}
            value={filters.codigoDocente}
            onChange={(e, value) => handleFilterChange('codigoDocente', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Código Docente"
                variant="outlined"
                className="text-field-custom"
              />
            )}
            style={{minWidth: 160 }}
          />
          <Autocomplete
            options={uniqueGeneros}
            value={filters.genero}
            onChange={(e, value) => handleFilterChange('genero', value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Género"
                variant="outlined"
                className="text-field-custom"
              />
            )}
            style={{minWidth: 160 }}
          />
          </>
        )}
        <IconButton onClick={resetFilters} >
          <RestartAltIcon className="reset-button"/>
        </IconButton>
      </div>
      <div className="comments-container">
        {paginatedComments.map((comment, index) => (
          <CommentCard key={index} {...comment} />
        ))}
      </div>
      <div className="pagination-container">
        <Pagination
            count={totalPages}
            siblingCount={0}
            page={currentPage}
            onChange={handlePageChange}
            className='pagination-custom'
          />
      </div>
    </div>
  );
};

export default Home;
