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

export const NoteDetail = ({ appDispatch, note, displayButtons }) => (
  <>
    <TextDisplay text={note.content}/>

    {displayButtons.modifierButtons && (
      <>
        <button className="details-button">Details</button>
        <button className="edit-button">Edit</button>
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
  </>
);

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
      <TextDisplay text={prompt.content}/>
      
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
          <label htmlFor="mokkoPrompt">
            Select a different prompt:
          </label>
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
