import React from "react";
import { Link } from "react-router-dom";

export const NoteDTM = ({ note: { deck, mokkos = [], tags = [] } }) => (
  <>
    <h2 className="subtitle is-3 mt-4 mb-1">Deck:</h2>
    <p>{`${deck.title}`}</p>
    {tags.length ? (
      <>
        <h2 className="subtitle is-3 mt-4 mb-1">Tags:</h2>
        <ul>
          {tags.map(({ id, content }) => (
            <li key={id}>{content}</li>
          ))}
        </ul>
      </>
    ) : null}
    {mokkos.length ? (
      <>
        <h2 className="subtitle is-3 mt-4 mb-1">Mokkos:</h2>
        {mokkos.map(({ created_at, cue_id, content, id }) => (
          <details key={id}>
            <summary>{new Date(created_at).toDateString()}</summary>
            <p>{content}</p>
            <Link to={`/cues/${cue_id}`}>See Cue</Link>
          </details>
        ))}
      </>
    ) : null}
  </>
);
