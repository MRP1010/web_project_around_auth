import React, { useState } from "react";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return (
    <div className="auth">
      <p className="auth__title">Iniciar sesión</p>
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
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
