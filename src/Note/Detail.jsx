import React, { useState } from "react";
import { NoteDetails, TextDisplay } from "../Review/Detail";

export const EditNote = ({ note, setIsEditing, updateNote }) => {
  const [noteChanges, setNoteChanges] = useState({});
  const handleChange = ({ target: { name, value } }) => {
    setNoteChanges((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <h1>Edit Note:</h1>
      <button
        onClick={() => {
          updateNote(noteChanges);
          setIsEditing(false);
        }}
      >
        Save Changes
      </button>
      <textarea
        rows="20"
        cols="80"
        value={noteChanges.content ? noteChanges.content : note.content}
        name="content"
        onChange={handleChange}
      />
    </>
  );
};

export const ReadNote = ({ note, setIsEditing }) => (
  <>
    <h1>Note:</h1>
    <TextDisplay text={note.content} />
    <NoteDetails note={note} />
    <button onClick={() => setIsEditing(true)}>Edit</button>
    <button>Delete</button>
  </>
);
