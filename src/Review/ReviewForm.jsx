import React, { useState } from "react";
import DOMPurify from "dompurify";
import marked from "marked";
import { ACTIONS, API_URL, BASE_INTERVALS } from "../constants";
import { callAPI } from "../utils";

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
  const cue = currentNote.prompts_remaining.length
    ? allPrompts.find((p) => p.id === currentNote.prompts_remaining[0])
    : currentNote.cue_note;

  const submitMokko = (e) => {
    e.preventDefault();
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("mokkoAuthToken"),
      },
      body: JSON.stringify({
        mokkoInterval,
        mokkoValue,
        cue,
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
      {isLoading && <p>LOADING SPINNER</p>}

      <section className={mokkoStage === 1 ? "main-col" : "left-col"}>
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
          <button className="details-button">Details</button>
          <button className="edit-button">Edit</button>
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
                value={
                  mokkoInterval ? mokkoInterval : currentNote.current_interval
                }
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
