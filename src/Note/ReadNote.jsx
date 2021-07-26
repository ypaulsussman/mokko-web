import React from "react";
import { NoteDetails } from "../shared/NoteDetails/NoteDetails";
import { TextDisplay } from "../shared/TextDisplay/TextDisplay";

const ReadNote = ({ deleteNote, note, setIsEditing }) => (
  <>
    <h1>Note:</h1>
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
    <NoteDetails note={note} />
    <button onClick={() => setIsEditing(true)}>Edit</button>
    <button onClick={deleteNote}>Delete</button>
  </>
);

export default ReadNote;