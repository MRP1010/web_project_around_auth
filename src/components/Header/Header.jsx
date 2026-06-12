import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.svg";

function Header({ loggedIn, userEmail, onSignOut }) {
  const location = useLocation();

  return (
    <header className="header page__section">
      <img
        src={logo}
        alt="Logotipo Around The U.S."
        className="logo header__logo"
      />

      <div className="header__auth-container">
        {loggedIn ? (
          <>
            <span className="header__user-email">{userEmail}</span>
            <button onClick={onSignOut} className="header__logout-button">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to={location.pathname === "/signin" ? "/signup" : "/signin"}
            className="header__auth-link"
          >
            {location.pathname === "/signin" ? "Regístrate" : "Iniciar sesión"}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
