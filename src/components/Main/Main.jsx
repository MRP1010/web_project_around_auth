import React from "react";
import { useState, useEffect, useContext } from "react";
import avatarDefault from "../../images/avatar.jpg";
import Popup from "./Popup/Popup";
import Card from "../Card/Card";
import NewCard from "../NewCard/NewCard";
import EditProfile from "../EditProfile/EditProfile";
import EditAvatar from "../Avatar/EditAvatar";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Main(props) {
  // 1. Extraemos las props heredadas de App.jsx
  const { popup, onOpenPopup, onClosePopup, cards, onCardLike, onCardDelete } =
    props;

  const { currentUser } = useContext(CurrentUserContext);

  // Configuraciones de los popups
  const newCardPopup = { title: "Nuevo lugar", children: <NewCard /> };
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile />,
  };
  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar />,
  };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__avatar-container">
          <img
            className="profile__image"
            src={currentUser.avatar}
            alt={`Avatar de ${currentUser.name}`}
          />
          <button
            className="profile__avatar-edit-button"
            onClick={() => onOpenPopup(editAvatarPopup)}
          />
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            onClick={() => onOpenPopup(editProfilePopup)}
          />
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          onClick={() => onOpenPopup(newCardPopup)}
        />
      </section>

      <section className="cards page__section">
        <ul className="cards__list">
          {/* 2. Mapeamos directamente las 'cards' recibidas por props */}
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onOpenPopup}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>

      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
