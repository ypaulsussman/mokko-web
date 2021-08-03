import React, { useState } from "react";
import { ACTIONS, BASE_INTERVALS } from "../constants";
import { NoteDTM } from "../shared/NoteDTM/NoteDTM";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

export const ReviewNote = ({ appDispatch, note, displayButtons }) => {
  const [displayNoteDTM, setDisplayNoteDTM] = useState(false);

  return (
    <>
      <TextDisplay text={note.content} />

      {displayButtons.modifierButtons && (
        <>
          <button
            className="button"
            type="button"
            id="details-button"
            onClick={() => {
              setDisplayNoteDTM(!displayNoteDTM);
            }}
          >
            See Details
          </button>
          {/* @TODO: how to implement this w/ [1] current `EditNote` component, and
           [2] state-management in ReviewForm? */}
          {/* <button 
            className="button"
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
          className="button"
          type="button"
          id="next-stage-button"
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

      {displayNoteDTM && <NoteDTM note={note} />}
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
          className="button"
          type="button"
          onClick={() => setDisplayCueSelect(!displayCueSelect)}
          id="display-cue-select-button"
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
        className="button"
        type="button"
        id="next-stage-button"
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

export const ReviewMokko = ({
  appDispatch,
  mokkoInterval,
  mokkoValue,
  submitMokko,
}) => {
  return (
    <section className="column is-two-fifths">
      <h2 className="subtitle is-3" id="mokko">
        Your Mokko:
      </h2>
      <form>
        <textarea
          aria-labelledby="mokko"
          id="mokkoValue"
          name="mokkoValue"
          value={mokkoValue}
          onChange={(e) =>
            appDispatch({
              type: ACTIONS.SET_MOKKOSTATUS,
              mokkoStatus: { mokkoValue: e.target.value },
            })
          }
        />
        <label htmlFor="mokkoInterval">
          see this note again in
          <select
            id="mokkoInterval"
            name="mokkoInterval"
            value={mokkoInterval}
            onChange={(e) =>
              appDispatch({
                type: ACTIONS.SET_MOKKOSTATUS,
                mokkoStatus: { mokkoInterval: e.target.value },
              })
            }
          >
            {BASE_INTERVALS.map((interval) => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
          {`day${mokkoInterval === 1 ? "" : "s"}`}
        </label>
        <button
          className="button"
          type="submit"
          id="progress-stage-button"
          onClick={submitMokko}
        >
          Cool!
        </button>
      </form>
    </section>
  );
};
