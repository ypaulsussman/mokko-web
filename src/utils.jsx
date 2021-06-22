import { useState, useEffect } from "react";
import {
  BASE_INTERVALS,
  NOTE_PREVIEW_LENGTH,
  REQUEST_STATUS,
} from "./constants";

export const getFormData = () => {
  const formElement = document.querySelector("form");
  const formData = new FormData(formElement).entries();
  return Array.from(formData).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});
};

export const callAPI = (url, initHash) =>
  fetch(url, initHash).then((resp) => {
    if (!resp.ok) {
      throw new Error(`Code ${resp.status} (${resp.statusText})`);
    }
    return resp.json();
  });

export const useFetch = () => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [request, setRequest] = useState({ url: "", opts: {} });

  useEffect(() => {
    let isMostRecentRequest = true;

    if (request.url) {
      setStatus(REQUEST_STATUS.LOADING);
      setData(undefined);
      setError(null);
      callAPI(request.url, request.opts)
        .then((successResponse) => {
          if (isMostRecentRequest) {
            setData(successResponse);
            setStatus(REQUEST_STATUS.SUCCESS);
          }
        })
        .catch(({ message }) => {
          if (isMostRecentRequest) {
            setError(message);
            setStatus(REQUEST_STATUS.ERROR);
          }
        });
    }

    return () => (isMostRecentRequest = false);
  }, [request.url, request.opts]);

  return [{ data, status, error }, setRequest];
};

export const getInitialInterval = (currentInterval) => {
  const currentIntervalIndex = BASE_INTERVALS.indexOf(currentInterval);
  if (currentIntervalIndex >= 0) {
    return BASE_INTERVALS[currentIntervalIndex + 1];
  } else {
    return BASE_INTERVALS[0];
  }
};

export const buildNotePreview = (noteContent) => {
  const textToTruncate = noteContent.slice(NOTE_PREVIEW_LENGTH);
  if (!textToTruncate) {
    return noteContent;
  }

  const nextSpaceIndex = textToTruncate.indexOf(" ");

  if (nextSpaceIndex === -1) {
    return `${noteContent}...`;
  }

  let prunedNoteContent = noteContent
    .slice(0, NOTE_PREVIEW_LENGTH + nextSpaceIndex)
    .replaceAll(" - ", " // ");

  if (
    prunedNoteContent.charAt(0) === "-" &&
    prunedNoteContent.charAt(1) === " "
  ) {
    prunedNoteContent = prunedNoteContent.slice(2);
  }

  return `${prunedNoteContent}...`;
};

// ====== CURRENTLY UNUSED UTILS ====== //

const getStringDates = () => {
  const today = new Date();

  const paddedMonth =
    today.getMonth() > 8 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
  const paddedToday =
    today.getDate() > 9 ? today.getDate() : `0${today.getDate()}`;
  const paddedTomorrow =
    today.getDate() + 1 > 9 ? today.getDate() : `0${today.getDate() + 1}`;

  return {
    todayish: `${today.getFullYear()}-${paddedMonth}-${paddedToday}`,
    tomorrowish: `${today.getFullYear()}-${paddedMonth}-${paddedTomorrow}`,
  };
};

export const calcUpcomingNotes = (data = []) => {
  const { todayish, tomorrowish } = getStringDates();
  const initHash = {
    today: [],
    tomorrow: [],
    restOfWeek: [],
    uninitialized: [],
  };

  // Distribute notes by occurrence
  const { today, tomorrow, restOfWeek, uninitialized } = data.reduce(
    (acc, { id, next_occurrence: nextOccurrence }) => {
      if (nextOccurrence === todayish) {
        acc.today.push(id);
      } else if (nextOccurrence === tomorrowish) {
        acc.tomorrow.push(id);
      } else if (nextOccurrence) {
        acc.restOfWeek.push(id);
      } else {
        acc.uninitialized.push(id);
      }
      return acc;
    },
    initHash
  );

  // fill upcoming occurrences with new notes
  [today, tomorrow, restOfWeek].forEach((arr, i) => {
    const maximum = i < 2 ? 6 : 30;
    while (arr.length < maximum) {
      if (!uninitialized.length) break;
      arr.push(uninitialized.pop());
    }
  });

  return { today, tomorrow, restOfWeek, uninitialized };
};
