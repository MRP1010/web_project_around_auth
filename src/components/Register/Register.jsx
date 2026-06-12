import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData.email, formData.password);
  };

  return (
    <div className="auth">
      <p className="auth__title">Regístrate</p>
      <form onSubmit={handleSubmit} className="auth__form">
        <input
          required
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="auth__input"
        />
        <input
          required
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="auth__input"
        />
        <button type="submit" className="auth__button">
          Regístrate
        </button>
      </form>
      <p className="auth__signin-prompt">
        ¿Ya eres miembro?{" "}
        <Link to="/signin" className="auth__link">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}

export default Register;
