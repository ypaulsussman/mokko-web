import React, { useState } from "react";

const newNoteData = {
  initialized: false,
  active: true,
  next_occurrence: null,
  content: "",
  deck: { id: "" },
  tags: [],
};

const EditNote = ({
  cancelFunction,
  isNewNote = false,
  note = newNoteData,
  selectableDecks,
  tags,
  saveFunction,
}) => {
  const [newTag, setNewTag] = useState("");
  const [noteChanges, setNoteChanges] = useState({
    active: note.active,
    next_occurrence: note.next_occurrence,
    tagsToAdd: [],
    tagsToRemove: [],
  });

  const handleChange = ({ target: { checked, name, type, value } }) => {
    setNoteChanges((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addTag = () => {
    const preexistingTag = tags.find(({ content }) => newTag === content);
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
        <li
          key={content}
          className="mb-2"
          style={{ display: "flex", alignItems: "center" }}
        >
          <del className="mr-4">{content}</del>
          <button
            className="button is-outlined is-small"
            type="button"
            onClick={() => undoRemoveTag({ id, content })}
          >
            Undo Delete
          </button>
        </li>
      ) : (
        <li
          key={content}
          className="mb-2"
          style={{ display: "flex", alignItems: "center" }}
        >
          <p className="mr-4">{content}</p>
          <button
            className="button is-outlined is-small"
            type="button"
            onClick={() => removeTag({ id, content })}
          >
            Delete
          </button>
        </li>
      )
    );

  const getSelectedDeck = () =>
    (noteChanges.deck_id
      ? // if the deck's changed, grab that
        selectableDecks.find(({ id }) => noteChanges.deck_id === id).id
      : // if the note already has a deck, grab that
        selectableDecks.find(({ id }) => note.deck.id === id)?.id) ||
    // otherwise, grab the first deck
    selectableDecks[0].id;

  return (
    <>
      <textarea
        rows="6"
        value={noteChanges.content ? noteChanges.content : note.content}
        name="content"
        onChange={handleChange}
        className="textarea"
      />

      <div className="mt-4">
        <input
          type="checkbox"
          id="keepActive"
          name="active"
          checked={noteChanges.active}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="keepActive">Keep this note in rotation</label>
      </div>

      {note.next_occurrence && (
        <div>
          <label>
            Next surface this note on:
            {/* @TODO: add yyyy-mm-dd validation */}
            <input
              type="text"
              name="next_occurrence"
              value={noteChanges.next_occurrence}
              onChange={handleChange}
            />
          </label>
        </div>
      )}

      <h2 className="subtitle is-3 mt-4 mb-1">Deck:</h2>
      <select
        className="select"
        name="deck_id"
        onChange={handleChange}
        value={getSelectedDeck()}
      >
        {selectableDecks.map(({ id, title }) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </select>

      <h2 className="subtitle is-3 mt-4 mb-1">Tags:</h2>
      <ul>
        {note.tags.length || noteChanges.tagsToAdd.length
          ? buildTagList()
          : null}
        <li key="add-tag" style={{ display: "flex", alignItems: "center" }}>
          {/* @TODO: Add <datalist> autocomplete */}
          <input
            type="text"
            name="newTag"
            value={newTag}
            aria-label="Add a new tag"
            className="input is-small mr-4"
            style={{ maxWidth: "12rem" }}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            className="button is-outlined is-small"
            type="button"
            onClick={() => addTag()}
          >
            Add Tag
          </button>
        </li>
      </ul>
      <hr style={{ height: "1px", backgroundColor: "darkgray" }} />

      <button
        className="button is-outlined mr-4"
        onClick={() => {
          // If it's a new note and no deck's been selected,
          // choose the one visible in the deck <select> field
          const noteData =
            isNewNote && !noteChanges.deck_id
              ? { ...noteChanges, deck_id: selectableDecks[0].id }
              : noteChanges;
          saveFunction(noteData);
        }}
      >
        Save Changes
      </button>
      <button className="button is-outlined" onClick={cancelFunction}>
        Cancel
      </button>
    </>
  );
};

export default EditNote;
