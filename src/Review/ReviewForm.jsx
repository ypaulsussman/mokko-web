import React, { useState } from "react";
import DOMPurify from "dompurify";
import marked from "marked";
import { ACTIONS, API_URL, BASE_INTERVALS } from "../constants";
import { callAPI } from "../utils";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";

const TextDisplay = ({ text }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: marked(DOMPurify.sanitize(text)),
    }}
  />
);

const ReviewForm = ({ currentNote, allPrompts, mokkoStatus, appDispatch }) => {
  const { mokkoValue, mokkoInterval, mokkoStage } = mokkoStatus;
  const [isLoading, setIsLoading] = useState(false);
  const [displayCueSelect, setDisplayCueSelect] = useState(false);
  const [cue, setCue] = useState(
    currentNote.prompts_remaining.length
      ? allPrompts.find((p) => p.id === currentNote.prompts_remaining[0])
      : currentNote.cue_note
  );
  const cueIsPrompt = Boolean(currentNote.prompts_remaining.length);

  const submitMokko = (e) => {
    console.log("cue, on submit:", JSON.stringify(cue));
    e.preventDefault();
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
      body: JSON.stringify({
        mokkoInterval,
        mokkoValue,
        cueId: cue.id,
        cueIsPrompt,
        noteId: currentNote.id,
      }),
    };

    setIsLoading(true);
    callAPI(`${API_URL}/interrogations`, reqOptions)
      .then(() => {
        setIsLoading(false);
        console.log("success!");
        appDispatch({ type: ACTIONS.MOKKO_SUCCESS, noteId: currentNote.id });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error: ", error);
      });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <section
        className={
          mokkoStage === 1 ? "review-form__main-col" : "review-form__left-col"
        }
      >
        <TextDisplay text={currentNote.content} />
        {mokkoStage < 3 && (
          <>
            <button className="details-button">Details</button>
            <button className="edit-button">Edit</button>
          </>
        )}
        {mokkoStage === 1 && (
          <button
            type="button"
            onClick={() =>
              appDispatch({
                type: ACTIONS.SET_MOKKOSTATUS,
                mokkoStatus: { mokkoStage: 2 },
              })
            }
            className="progress-stage-button"
          >
            Cool!
          </button>
        )}
        {mokkoStage === 3 && <TextDisplay text={cue.content} />}
      </section>

      {mokkoStage === 2 && (
        <section className="right-col">
          <TextDisplay text={cue.content} />
          {cueIsPrompt || (
            <>
              <button className="details-button">Details</button>
              <button className="edit-button">Edit</button>
            </>
          )}
          {currentNote.prompts_remaining.length > 1 && (
            <button
              type="button"
              onClick={() => setDisplayCueSelect(true)}
              className="display-cue-select-button"
            >
              Choose Prompt
            </button>
          )}
          {displayCueSelect && (
            <>
              <label htmlFor="mokkoPrompt">
                Select a different prompt, if desired:
              </label>
              <select
                id="mokkoPrompt"
                name="mokkoPrompt"
                value={cue}
                onChange={(e) => {
                  setCue(allPrompts.find((p) => p.id === e.target.value));
                  setDisplayCueSelect(false);
                }}
              >
                {currentNote.prompts_remaining.map((promptId) => {
                  console.log("cue: ", JSON.stringify(promptId));
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
            onClick={() =>
              appDispatch({
                type: ACTIONS.SET_MOKKOSTATUS,
                mokkoStatus: { mokkoStage: 3 },
              })
            }
            className="progress-stage-button"
          >
            Cool!
          </button>
        </section>
      )}

      {mokkoStage === 3 && (
        <section className="right-col">
          <form>
            <label htmlFor="mokkoValue">your mokko:</label>
            <textarea
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
              type="submit"
              onClick={submitMokko}
              className="progress-stage-button"
            >
              Cool!
            </button>
          </form>
        </section>
      )}
    </>
  );
};
export default ReviewForm;
