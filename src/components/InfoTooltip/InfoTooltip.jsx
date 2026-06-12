import React from "react";
import successIcon from "../images/success-icon.svg"; // Asegúrate de añadir estos assets
import errorIcon from "../images/error-icon.svg";

function InfoTooltip({ isOpen, onClose, isSuccess }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_tooltip">
        <button
          type="button"
          onClick={onClose}
          className="popup__close-button"
        />
        <img
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Éxito" : "Error"}
          className="popup__tooltip-icon"
        />
        <p className="popup__tooltip-text">
          {isSuccess
            ? "¡Correcto! Ya estás registrado."
            : "Uy, algo salió mal. Por favor, inténtalo de nuevo."}
        </p>
      </div>
    </div>
  );
}

export default InfoTooltip;
