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

const ReviewForm = ({ currentNote, prompts, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const cue = currentNote.prompts_remaining.length
    ? prompts.find((p) => p.id === currentNote.prompts_remaining[0])
    : currentNote.cue_note;

  // @TODO replace w/ reducers, for refresh on mokko-submit?
  const [reviewStage, setReviewStage] = useState(1);
  const [mokkoValue, setMokkoValue] = useState("");
  const [mokkoInterval, setMokkoInterval] = useState(
    currentNote.current_interval
  );

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

      <section className={reviewStage === 1 ? "main-col" : "left-col"}>
        <TextDisplay text={currentNote.content} />
        {reviewStage < 3 && (
          <>
            <button className="details-button">Details</button>
            <button className="edit-button">Edit</button>
          </>
        )}
        {reviewStage === 1 && (
          <button
            type="button"
            onClick={() => setReviewStage(2)}
            className="progress-stage-button"
          >
            Cool!
          </button>
        )}
        {reviewStage === 3 && <TextDisplay text={cue.content} />}
      </section>

      {reviewStage === 2 && (
        <section className="right-col">
          <TextDisplay text={cue.content} />
          <button className="details-button">Details</button>
          <button className="edit-button">Edit</button>
          <button
            type="button"
            onClick={() => setReviewStage(3)}
            className="progress-stage-button"
          >
            Cool!
          </button>
        </section>
      )}

      {reviewStage === 3 && (
        <section className="right-col">
          <form>
            <label htmlFor="mokkoValue">your mokko:</label>
            <textarea
              id="mokkoValue"
              name="mokkoValue"
              value={mokkoValue}
              onChange={(e) => setMokkoValue(e.target.value)}
            />

            <label htmlFor="mokkoInterval">
              see this note again in
              <select
                value={mokkoInterval}
                onChange={(e) => setMokkoInterval(e.target.value)}
              >
                {BASE_INTERVALS.map((interval) => (
                  <option key={interval} value={interval}>
                    {interval}
                  </option>
                ))}
              </select>
              days
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
