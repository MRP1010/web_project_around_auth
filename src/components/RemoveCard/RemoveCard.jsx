import React from "react";

export default function RemoveCard({ onConfirm }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(); 
  };

  return (
    <form className="popup__form" id="delete-card-form" onSubmit={handleSubmit}>
      <p className="popup__description" style={{ marginBottom: "30px", color: "#000" }}>
        ¿Estás seguro/a de que deseas eliminar esta tarjeta?
      </p>
      <button className="button popup__button" type="submit">
        Sí
      </button>
    </form>
  );
}