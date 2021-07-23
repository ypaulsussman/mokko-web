import React, { useState } from "react";
import { NoteDetails, TextDisplay } from "../Review/Detail";

export const EditNote = ({
  note,
  selectableDecks,
  selectableTags,
  setIsEditing,
  updateNote,
}) => {
  const [newTag, setNewTag] = useState("");
  const [noteChanges, setNoteChanges] = useState({
    tagsToAdd: [],
    tagsToRemove: [],
  });

  const handleChange = ({ target: { name, value } }) => {
    setNoteChanges((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addTag = () => {
    const preexistingTag = selectableTags.find(
      ({ content }) => newTag === content
    );
    if (preexistingTag) {
      setNoteChanges((prevState) => ({
        ...prevState,
        tagsToAdd: [...prevState.tagsToAdd, preexistingTag],
      }));
      setNewTag("");
    } else {
      setNoteChanges((prevState) => ({
        ...prevState,
        tagsToAdd: [...prevState.tagsToAdd, { content: newTag, id: null }],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    const newlyAddedTag = noteChanges.tagsToAdd.find(
      ({ content }) => content === tagToRemove.content
    );
    if (newlyAddedTag) {
      setNoteChanges((prevState) => ({
        ...prevState,
        tagsToAdd: prevState.tagsToAdd.filter(
          ({ content }) => content !== tagToRemove.content
        ),
      }));
    } else {
      setNoteChanges((prevState) => ({
        ...prevState,
        tagsToRemove: [...prevState.tagsToRemove, tagToRemove],
      }));
    }
  };

  const undoRemoveTag = (tagToUndo) => {
    setNoteChanges((prevState) => ({
      ...prevState,
      tagsToRemove: prevState.tagsToRemove.filter(
        ({ id }) => id !== tagToUndo.id
      ),
    }));
  };

  const tagsToRemoveIds = noteChanges.tagsToRemove.map(({ id }) => id);
  const buildTagList = () =>
    [...note.tags, ...noteChanges.tagsToAdd].map(({ id, content }) =>
      tagsToRemoveIds.includes(id) ? (
        <li key={content}>
          <p className="add-strikethrough-to-me-later">{content}</p>
          <button type="button" onClick={() => undoRemoveTag({ id, content })}>
            Undo Delete
          </button>
        </li>
      ) : (
        <li key={content}>
          <p>{content}</p>
          <button type="button" onClick={() => removeTag({ id, content })}>
            Delete
          </button>
        </li>
      )
    );

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
      <h2>Deck:</h2>
      <select
        name="deck_id"
        onChange={handleChange}
        value={
          noteChanges.deck_id
            ? selectableDecks.find(({ id }) => noteChanges.deck_id === id).id
            : selectableDecks.find(({ id }) => note.deck.id === id).id
        }
      >
        {selectableDecks.map(({ id, title }) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </select>
      <h2>Tags:</h2>
      <ul>
        {note.tags.length || noteChanges.tagsToAdd.length
          ? buildTagList()
          : null}
        <li key="add-tag">
          <input
            type="text"
            name="newTag"
            value={newTag}
            aria-label="Add a new tag"
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={() => addTag()}>
            Add Tag
          </button>
        </li>
      </ul>
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
