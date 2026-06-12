import React from "react";
import { useContext } from "react";
import ImagePopup from "../ImagePopup/ImagePopup";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const { name, link, isLiked, owner } = card;

  const { currentUser } = useContext(CurrentUserContext);

  const isOwn = owner === currentUser._id;
  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? "card__delete-button_visible" : "card__delete-button_hidden"
  }`;

  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_active" : ""
  }`;

  const imageComponent = {
    title: null,
    children: <ImagePopup card={card} />,
  };

  // Controladores de eventos locales
  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => onCardClick(imageComponent)}
      />

      <button
        aria-label="Delete card"
        className={cardDeleteButtonClassName}
        type="button"
        onClick={handleDeleteClick} // Escucha click eliminación
      />

      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Like card"
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick} // Escucha click Like
        />
      </div>
    </li>
  );
}
