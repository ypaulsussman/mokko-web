import React from "react";
import { NoteDTM } from "../shared/NoteDTM/NoteDTM";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

const ReadNote = ({ deleteNote, note, setIsEditing }) => (
  <>
    <h1 className="title is-1">Note:</h1>
    <TextDisplay text={note.content} />
    <h2>Status:</h2>
    <dl>
      <dt>In Rotation: </dt>
      <dd>{note.active ? "Yes" : "No"}</dd>
      {note.active ? (
        <>
          <dt>Next Occurrence:</dt>
          <dd>{note.next_occurrence}</dd>
        </>
      ) : null}
    </dl>
    <NoteDTM note={note} />
    <button className="button is-outlined" onClick={() => setIsEditing(true)}>
      Edit
    </button>
    <button className="button is-outlined" onClick={deleteNote}>
      Delete
    </button>
  </>
);

export default ReadNote;
