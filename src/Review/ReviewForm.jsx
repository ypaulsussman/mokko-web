import React, { useState } from "react";
import { ACTIONS, API_URL } from "../constants";
import { callAPI } from "../utils";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import { ReviewNote, ReviewMokko } from "./ReviewFields";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

const ReviewForm = ({ currentNote, allPrompts, mokkoStatus, appDispatch }) => {
  const { mokkoValue, mokkoInterval, mokkoStage } = mokkoStatus;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // @TODO: revert this (and cueIsPrompt) change post-MVP, when you want to
  // experiment more with non-note content as the "cue" for mokko-generation
  // const [cue, setCue] = useState(
  //   currentNote.prompts_remaining.length
  //     ? allPrompts.find((p) => p.id === currentNote.prompts_remaining[0])
  //     : currentNote.cue_note
  // );
  const cueIsPrompt = false; // Boolean(currentNote.prompts_remaining.length);

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
        cueId: currentNote.cue_note.id,
        cueIsPrompt,
        noteId: currentNote.id,
      }),
    };

    setIsLoading(true);
    callAPI(`${API_URL}/mokkos`, reqOptions)
      .then(() => {
        setIsLoading(false);
        appDispatch({ type: ACTIONS.MOKKO_SUCCESS, noteId: currentNote.id });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        setError(message);
      });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <p>{`Something went wrong: {error}`}</p>}
      <h1 className="is-sr-only">Create a Mokko:</h1>
      <div className="columns is-centered is-desktop">
        <section
          // Overwrites Bulma setting for `.box:not(:last-child)`
          style={{ marginBottom: 0 }}
          className={`box column is-two-fifths-desktop mt-6 ${
            mokkoStage > 1 ? "mr-6" : ""
          }`}
        >
          <h2 className="subtitle is-3"> Note:</h2>
          <ReviewNote
            appDispatch={appDispatch}
            note={currentNote}
            displayButtons={{
              modifierButtons: Boolean(mokkoStage < 3),
              nextStageButton: Boolean(mokkoStage === 1),
            }}
          />

          {mokkoStage === 3 && (
            <>
              <h2 className="subtitle is-3">Prompt:</h2>
              <TextDisplay text={currentNote.cue_note.content} />
            </>
          )}
        </section>

        {mokkoStage === 2 && (
          <section className="box column is-two-fifths-desktop mt-6">
            <h2 className="subtitle is-3">Prompt:</h2>
            {cueIsPrompt ? null : (
              // <ReviewPrompt
              //   prompt={cue}
              //   promptsRemaining={currentNote.prompts_remaining}
              //   setCue={setCue}
              //   allPrompts={allPrompts}
              //   appDispatch={appDispatch}
              // />
              <ReviewNote
                appDispatch={appDispatch}
                note={currentNote.cue_note}
                isCue={true}
                displayButtons={{
                  modifierButtons: true,
                  nextStageButton: true,
                }}
              />
            )}
          </section>
        )}

        {mokkoStage === 3 && (
          <ReviewMokko
            appDispatch={appDispatch}
            mokkoInterval={mokkoInterval}
            mokkoValue={mokkoValue}
            submitMokko={submitMokko}
          />
        )}
      </div>
    </>
  );
};

export default ReviewForm;
