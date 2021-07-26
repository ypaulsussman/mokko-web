import React, { useState } from "react";
import { ACTIONS } from "../constants";
import { NoteDetails } from "../shared/NoteDetails/NoteDetails";
import { TextDisplay } from "../shared/TextDisplay/TextDisplay";

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
            See Details
          </button>
          {/* @TODO: how to implement this w/ [1] current `EditNote` component, and
           [2] state-management in ReviewForm? */}
          {/* <button
            type="button"
            className="edit-button"
            onClick={() => {
              alert("this is a noop for now dog");
            }}
          >
            Edit Note
          </button> */}
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

export const ReviewPrompt = ({
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
          onClick={() => setDisplayCueSelect(!displayCueSelect)}
          className="display-cue-select-button"
        >
          {displayCueSelect ? "Close" : "Change Prompt"}
        </button>
      )}

      {displayCueSelect && (
        <>
          <label htmlFor="mokkoPrompt">Select a different prompt:</label>
          <select
            id="mokkoPrompt"
            name="mokkoPrompt"
            onChange={(e) => {
              setCue(allPrompts.find(({ id }) => id === e.target.value));
              setDisplayCueSelect(false);
            }}
            value={prompt.id}
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
