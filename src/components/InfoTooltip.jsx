import React from "react";

function InfoTooltip({ isOpen, onClose, isSuccess }) {
  const successIcon = "/images/okimg.svg";
  const errorIcon = "/images/errorimg.svg";

  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_tooltip">
        <button
          type="button"
          onClick={onClose}
          className="popup__close-button"
          aria-label="Cerrar modal"
        />
        <img
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Registro correcto" : "Algo salió mal"}
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
