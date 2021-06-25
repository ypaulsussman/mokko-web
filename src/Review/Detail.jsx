import React, { useState } from "react";
import DOMPurify from "dompurify";
import marked from "marked";
import { ACTIONS } from "../constants";

export const TextDisplay = ({ text }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: marked(DOMPurify.sanitize(text)),
    }}
  />
);

export const NoteDetails = ({ note }) => (
  <>
    <p>{`Deck: ${note.deck.title}`}</p>
    {note.tags.length && (
      <>
        <ul>
          Tags:
          {note.tags.map(({ id, content }) => (
            <li key={id}>{content}</li>
          ))}
        </ul>
      </>
    )}
  </>
);

export const ReviewNote = ({ appDispatch, note, displayButtons }) => {
  const [displayNoteDetails, setDisplayNoteDetails] = useState(false);

  return (
    <>
      <TextDisplay text={note.content} />

      {displayButtons.modifierButtons && (
        <>
          <button
            type="button"
            className="details-button"
            onClick={() => {
              setDisplayNoteDetails(!displayNoteDetails);
            }}
          >
            Details
          </button>
          <button
            type="button"
            className="edit-button"
            onClick={() => {
              alert("this is a noop for now dog");
            }}
          >
            Edit
          </button>
        </>
      )}

      {displayButtons.nextStageButton && (
        <button
          type="button"
          className="next-stage-button"
          onClick={() =>
            appDispatch({
              type: ACTIONS.SET_MOKKOSTATUS,
              mokkoStatus: { mokkoStage: 2 },
            })
          }
        >
          Cool!
        </button>
      )}

      {displayNoteDetails && <NoteDetails note={note} />}
    </>
  );
};

export const PromptDetail = ({
  prompt,
  promptsRemaining,
  allPrompts,
  setCue,
  appDispatch,
}) => {
  const [displayCueSelect, setDisplayCueSelect] = useState(false);

  return (
    <>
      <TextDisplay text={prompt.content} />

      {promptsRemaining.length > 1 && (
        <button
          type="button"
          onClick={() => setDisplayCueSelect(true)}
          className="display-cue-select-button"
        >
          Change Prompt
        </button>
      )}

      {displayCueSelect && (
        <>
          <label htmlFor="mokkoPrompt">Select a different prompt:</label>
          <select
            id="mokkoPrompt"
            name="mokkoPrompt"
            onChange={(e) => {
              setCue(allPrompts.find((p) => p.id === e.target.value));
              setDisplayCueSelect(false);
            }}
          >
            {promptsRemaining.map((promptId) => {
              return (
                <option key={promptId} value={promptId}>
                  {allPrompts.find((p) => p.id === promptId).content}
                </option>
              );
            })}
          </select>
        </>
      )}

      <button
        type="button"
        className="next-stage-button"
        onClick={() =>
          appDispatch({
            type: ACTIONS.SET_MOKKOSTATUS,
            mokkoStatus: { mokkoStage: 3 },
          })
        }
      >
        Cool!
      </button>
    </>
  );
};
