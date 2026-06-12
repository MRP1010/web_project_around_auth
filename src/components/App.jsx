import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import api from "../utils/api";
import RemoveCard from "./RemoveCard/RemoveCard";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Register from "./Register/Register";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [popup, setPopup] = useState(null);
  // 1. Traemos el estado 'cards' al componente raíz
  const [cards, setCards] = useState([]);

  // Añadimos el estado para controlar si el usuario está autenticado
  const [loggedIn, setLoggedIn] = useState(false);

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

  const handleOpenPopup = (config) => setPopup(config);
  const handleClosePopup = () => setPopup(null);

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

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setCurrentUser({});
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
          userEmail={currentUser.email}
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
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />

          {/* Redirección por defecto si la ruta no existe */}
          <Route
            path="*"
            element={<Navigate to={loggedIn ? "/" : "/signin"} replace />}
          />
        </Routes>

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
