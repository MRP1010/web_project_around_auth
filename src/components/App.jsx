import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import api from "../utils/api";
import RemoveCard from "./RemoveCard/RemoveCard";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Register from "./Register/Register";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

import * as auth from "../utils/auth";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [popup, setPopup] = useState(null);
  // 1. Traemos el estado 'cards' al componente raíz
  const [cards, setCards] = useState([]);

  // Añadimos el estado para controlar si el usuario está autenticado
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res && res.data) {
            api.setToken(jwt);
            setUserEmail(res.data.email);
            setLoggedIn(true);
            navigate("/"); // Redirigimos a la app principal
          }
        })
        .catch((err) => console.error("Token inválido o expirado:", err));
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      (async () => {
        try {
          const userData = await api.getUserInfo();
          setCurrentUser(userData);

          const cardData = await api.getInitialCards();
          setCards(cardData);
        } catch (err) {
          console.error("Error al cargar datos iniciales:", err);
        }
      })();
    }
  }, [loggedIn]);

  // Registro
  const handleRegisterSubmit = (email, password) => {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setIsSuccess(true);
          console.log("¡Usuario registrado con éxito!", res);
          setIsInfoTooltipOpen(true);
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.error("Error en el registro:", err);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  // Controlador de Inicio de Sesión (/signin)
  const handleLoginSubmit = (email, password) => {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token); //Guardamos los datos
          api.setToken(data.token);
          setUserEmail(email);
          setLoggedIn(true);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Error en la autorización:", err);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  // Controlador de Cierre de Sesión
  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmail("");
    setCurrentUser({});
    setCards([]);
    navigate("/signin");
  };

  const handleOpenPopup = (config) => setPopup(config);
  const handleClosePopup = () => setPopup(null);

  const handleCloseAllPopups = () => {
    setIsInfoTooltipOpen(false);
  };

  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .updateUserInfo(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  const handleUpdateAvatar = (data) => {
    (async () => {
      await api
        .setUserAvatar(data.avatar)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  // 3. Controlador de Likes de las tarjetas
  async function handleCardLike(card) {
    const isLiked = card.isLiked;
    await api
      .changeLikeStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        );
      })
      .catch((error) => console.error(error));
  }

  // 4. Controlador de eliminación de las tarjetas
  async function handleCardDelete(card) {
    const actionConfirmDelete = async () => {
      await api
        .deleteCard(card._id)
        .then(() => {
          setCards((state) =>
            state.filter((currentCard) => currentCard._id !== card._id),
          );
          handleClosePopup();
        })
        .catch((error) =>
          console.error("Error al eliminar la tarjeta:", error),
        );
    };
    handleOpenPopup({
      title: "¿Estás seguro/a?",
      children: <RemoveCard onConfirm={actionConfirmDelete} />,
    });
  }

  // 5. Controlador para añadir una nueva tarjeta
  const handleAddPlaceSubmit = (newCardData) => {
    (async () => {
      await api
        .addCard(newCardData)
        .then((newCard) => {
          setCards([newCard, ...cards]);
          handleClosePopup();
        })
        .catch((error) => console.error("Error al añadir tarjeta:", error));
    })();
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    // Pasamos handleAddPlaceSubmit a través de nuestro contexto global
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <div className="page__content">
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              </ProtectedRoute>
            }
          />

          {/* Rutas públicas para usuarios no autorizados */}
          <Route
            path="/signup"
            element={<Register onRegister={handleRegisterSubmit} />}
          />
          <Route
            path="/signin"
            element={<Login onLogin={handleLoginSubmit} />}
          />

          {/* Redirección por defecto */}
          <Route
            path="*"
            element={<Navigate to={loggedIn ? "/" : "/signin"} replace />}
          />
        </Routes>

        <Footer />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={handleCloseAllPopups}
          isSuccess={isSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
