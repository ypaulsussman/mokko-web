import React, { useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import marked from "marked";
import { buildNotePreview } from "../utils";

const DeckRow = ({ deck, handleDeckDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <details>
        <summary>
          {deck.title}
          <button>Edit</button>
          <button onClick={() => handleDeckDelete(deck)}>Delete</button>
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
              <Link to={`/note/${note.id}`}>Details</Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default DeckRow;
