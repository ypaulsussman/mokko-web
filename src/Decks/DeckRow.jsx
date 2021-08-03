import React, { useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import marked from "marked";
import { buildNotePreview } from "../utils";

const DeckRow = ({ deck, handleDeckDelete, handleDeckTitleSubmit }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");

  const handleInput = ({ target: { value } }) => {
    setNewDeckTitle(value);
  };

  return (
    <div>
      <details>
        <summary>
          {isEditMode ? (
            <form>
              <label htmlFor="newDeckTitle">New Deck Title:</label>
              <input
                type="text"
                name="newDeckTitle"
                id="newDeckTitle"
                onChange={handleInput}
              />

              <button className="button" onClick={() => setIsEditMode(false)}>
                Cancel
              </button>
              <button
                className="button"
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
              {deck.title}
              <button className="button" onClick={() => setIsEditMode(true)}>
                Edit
              </button>
              <button className="button" onClick={() => handleDeckDelete(deck)}>
                Delete
              </button>
            </>
          )}
        </summary>
        <ul>
          {deck.notes.map((note) => (
            <li key={note.id}>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(
                    DOMPurify.sanitize(buildNotePreview(note.content))
                  ),
                }}
              ></div>
              <Link to={`/notes/${note.id}`}>See Note</Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default DeckRow;
