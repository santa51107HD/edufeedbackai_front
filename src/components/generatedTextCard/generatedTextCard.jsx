import React from "react";
import "./generatedTextCard.css"

const GeneratedTextCard = ({tittle, content}) => {
  return (
    <div className="generated-text-container">
      <h3>{tittle}</h3>
      <p>{content}</p>
    </div>
  );
};

export default GeneratedTextCard;