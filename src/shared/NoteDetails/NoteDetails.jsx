import React from "react";
import { Link } from "react-router-dom";

export const NoteDetails = ({ note: { deck, mokkos = [], tags = [] } }) => (
  <>
    <h2>Deck:</h2>
    <p>{`${deck.title}`}</p>
    {tags.length ? (
      <>
        <h2>Tags:</h2>
        <ul>
          {tags.map(({ id, content }) => (
            <li key={id}>{content}</li>
          ))}
        </ul>
      </>
    ) : null}
    {mokkos.length ? (
      <>
        <h2>Mokkos:</h2>
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
