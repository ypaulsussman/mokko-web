import React, { useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import marked from "marked";
import { buildNotePreview } from "../utils";

const DeckRow = ({ deck, handleDeckDelete, handleDeckTitleSubmit }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState(deck.title);

  const handleInput = ({ target: { value } }) => {
    setNewDeckTitle(value);
  };

  return (
    <div className="mb-4">
      <details>
        <summary style={{ display: "flex", alignItems: "center" }}>
          {isEditMode ? (
            <form style={{ display: "flex", alignItems: "center" }}>
              <label
                htmlFor="newDeckTitle"
                className="label mr-2 mb-0"
                style={{ flexShrink: 0 }}
              >
                New Deck Title:
              </label>
              <input
                type="text"
                name="newDeckTitle"
                id="newDeckTitle"
                className="input mr-4"
                onChange={handleInput}
                value={newDeckTitle}
              />

              <button
                className="button is-outlined mr-4"
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="button is-outlined"
                type="button"
                onClick={() => {
                  handleDeckTitleSubmit(newDeckTitle, deck.id);
                  setIsEditMode(false);
                }}
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <p className="subtitle ml-2 mr-4 mb-0">{deck.title}</p>
              <button
                className="button is-outlined mr-4"
                onClick={() => setIsEditMode(true)}
              >
                Edit
              </button>
              <button
                className="button is-outlined"
                onClick={() => handleDeckDelete(deck)}
              >
                Delete
              </button>
            </>
          )}
        </summary>
        <ul>
          {deck.notes.map((note) => (
            <li
              key={note.id}
              style={{ display: "flex", alignItems: "center" }}
              className="ml-5 mt-3"
            >
              <span
                className="mr-3"
                dangerouslySetInnerHTML={{
                  __html: marked(
                    DOMPurify.sanitize(buildNotePreview(note.content))
                  ),
                }}
              />
              <Link to={`/notes/${note.id}`}>See Note</Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default DeckRow;
