import React, { useState } from "react";
import { ACTIONS, API_URL, BASE_INTERVALS } from "../constants";
import { callAPI } from "../utils";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import { NoteDetail, PromptDetail, TextDisplay } from "./Detail";

const ReviewForm = ({ currentNote, allPrompts, mokkoStatus, appDispatch }) => {
  const { mokkoValue, mokkoInterval, mokkoStage } = mokkoStatus;
  const [isLoading, setIsLoading] = useState(false);
  const [cue, setCue] = useState(
    currentNote.prompts_remaining.length
      ? allPrompts.find((p) => p.id === currentNote.prompts_remaining[0])
      : currentNote.cue_note
  );
  const cueIsPrompt = Boolean(currentNote.prompts_remaining.length);

  const submitMokko = (e) => {
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
    callAPI(`${API_URL}/mokkos`, reqOptions)
      .then(() => {
        setIsLoading(false);
        console.log("success!");
        appDispatch({ type: ACTIONS.MOKKO_SUCCESS, noteId: currentNote.id });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log("error: ", message);
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
        <NoteDetail
          appDispatch={appDispatch}
          note={currentNote}
          displayButtons={{
            modifierButtons: Boolean(mokkoStage < 3),
            nextStageButton: Boolean(mokkoStage === 1),
          }}
        />

        {mokkoStage === 3 && <TextDisplay text={cue.content} />}
      </section>

      {mokkoStage === 2 && (
        <section className="right-col">
          {cueIsPrompt ? (
            <PromptDetail
              prompt={cue}
              promptsRemaining={currentNote.prompts_remaining}
              setCue={setCue}
              allPrompts={allPrompts}
              appDispatch={appDispatch}
            />
          ) : (
            <NoteDetail
              appDispatch={appDispatch}
              note={cue}
              displayButtons={{
                modifierButtons: true,
                nextStageButton: true,
              }}
            />
          )}
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
              className="progress-stage-button"
              onClick={submitMokko}
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
