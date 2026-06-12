import { useContext, useRef } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function NewCard() {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  const titleRef = useRef();
  const linkRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    handleAddPlaceSubmit({
      name: titleRef.current.value,
      link: linkRef.current.value,
    });
  };

  return (
    <form
      className="popup__form"
      name="place-form"
      id="add-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_title"
          id="place-title"
          maxLength="30"
          minLength="2"
          name="placeName"
          placeholder="Título"
          required
          type="text"
          ref={titleRef}
        />
        <span className="popup__error" id="place-title-error"></span>
      </label>

      <label className="popup__label">
        <input
          className="popup__input popup__input_type_url"
          id="place-link"
          name="placeLink"
          placeholder="Enlace a la imagen"
          required
          type="url"
          ref={linkRef}
        />
        <span className="popup__error" id="place-link-error"></span>
      </label>

      <button className="button popup__button" type="submit">
        Crear
      </button>
    </form>
  );
}
