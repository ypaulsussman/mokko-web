import React from "react";
import { NoteDTM } from "../shared/NoteDTM/NoteDTM";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

const ReadNote = ({ deleteNote, note, setIsEditing }) => (
  <>
    <h1 className="title is-1">Note:</h1>
    <TextDisplay text={note.content} />
    <h2 className="subtitle is-3 mt-4 mb-1">Status:</h2>
    <dl>
      <div style={{ display: "flex" }}>
        <dt className="has-text-weight-semibold mr-2">In Rotation: </dt>
        <dd>{note.active ? "Yes" : "No"}</dd>
      </div>
      {note.active ? (
        <div style={{ display: "flex" }}>
          <dt className="has-text-weight-semibold mr-2">Next Occurrence:</dt>
          <dd>{note.next_occurrence || "Uninitialized"}</dd>
        </div>
      ) : null}
    </dl>
    <NoteDTM note={note} />
    <button
      className="button is-outlined mt-4 mr-4"
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>
    <button className="button is-outlined mt-4" onClick={deleteNote}>
      Delete
    </button>
  </>
);

export default ReadNote;
