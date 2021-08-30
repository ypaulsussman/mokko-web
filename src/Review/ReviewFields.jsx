import React, { useState } from "react";
import { ACTIONS, BASE_INTERVALS } from "../constants";
import { NoteDTM } from "../shared/NoteDTM/NoteDTM";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

export const ReviewNote = ({
  appDispatch,
  note,
  isCue = false,
  displayButtons,
}) => {
  const [displayNoteDTM, setDisplayNoteDTM] = useState(false);

  return (
    <>
      <TextDisplay text={note.content} />

      {displayButtons.modifierButtons && (
        <>
          <button
            className="button is-outlined mr-4"
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
            className="button is-outlined"
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
          className="button is-outlined"
          type="button"
          id="next-stage-button"
          onClick={() =>
            appDispatch({
              type: ACTIONS.SET_MOKKOSTATUS,
              mokkoStatus: { mokkoStage: isCue ? 3 : 2 },
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
          className="button is-outlined mr-4"
          type="button"
          onClick={() => setDisplayCueSelect(true)}
          id="display-cue-select-button"
        >
          Change Prompt
        </button>
      )}

      <div className={`modal ${displayCueSelect ? "is-active" : ""}`}>
        <div className="modal-background" />
        <div className="modal-content">
          <div
            className="box"
            style={{ display: "flex", alignItems: "center" }}
          >
            <label htmlFor="mokkoPrompt" className="mr-4">
              Select a different prompt:
            </label>
            <select
              className="select"
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
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="Close"
          onClick={() => setDisplayCueSelect(false)}
        />
      </div>

      <button
        className="button is-outlined"
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
    <section className="column is-two-fifths box mt-6">
      <h2 className="subtitle is-3" id="mokko">
        Your Mokko:
      </h2>
      <form>
        <textarea
          className="textarea"
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
        <div className="mt-5" style={{ display: "flex", alignItems: "center" }}>
          <p htmlFor="mokkoInterval" className="mr-1">
            See this note again in
          </p>
          <select
            aria-label="Select number of days until note's next occurrence"
            className="select"
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
          <p className="ml-1">{`day${mokkoInterval === 1 ? "" : "s"}`}</p>
        </div>
        <button
          className="button is-outlined mt-5"
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
