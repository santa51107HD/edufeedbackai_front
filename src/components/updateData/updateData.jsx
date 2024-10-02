import React, { useState, useContext } from "react";
import { Context } from "../../context/context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./updateData.css";

function UpdateData() {
  const [file, setFile] = useState(null);
  const { appState, setAppState } = useContext(Context);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si se seleccionó un archivo
    if (!file) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }

    // Establecer isUploading en true
    setAppState((prevState) => ({
      ...prevState,
      isUploading: true,
    }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-excel/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: appState.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Archivo subido exitosamente.");
        console.log("File uploaded successfully", data);
      } else {
        toast.error(`Error al subir archivo: ${response.statusText}`);
        console.error("Error uploading file", response.statusText);
      }
    } catch (error) {
      toast.error("Error al subir archivo.");
      console.error("Error uploading file", error);
      setAppState((prevState) => ({
        ...prevState,
        isUploading: false,
      }));
    } finally {
      // Establecer isUploading en false cuando finalice la operación
      setAppState((prevState) => ({
        ...prevState,
        isUploading: false,
      }));
    }
  };

  return (
    <>
      <form className="update-container" onSubmit={handleSubmit}>
        <input
          className="update-input"
          type="file"
          id="file"
          onChange={handleFileChange}
          accept=".xlsx"
          disabled={appState.isUploading} // Deshabilitar el input si está subiendo el archivo
        />
        <label
          htmlFor="file"
          className={`custom-file-button ${
            appState.isUploading ? "disabled" : ""
          }`}
        >
          {file ? file.name : "Seleccionar archivo"}
        </label>
        <button
          className="update-button"
          type="submit"
          disabled={appState.isUploading || !file}
        >
          {appState.isUploading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

export default UpdateData;
