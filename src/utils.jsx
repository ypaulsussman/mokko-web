import { useState, useEffect } from "react";

export const getFormData = () => {
  const formElement = document.querySelector("form");
  const formData = new FormData(formElement).entries();
  return Array.from(formData).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});
}

export const callAPI = (url, init) =>
  fetch(url, init).then((resp) => {
    if (!resp.ok) {
      throw Error(`Code ${resp.status} (${resp.statusText})`);
    }
    return resp.json();
  });

export const useFetch = (url, init) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let performUpdate = true;

    setStatus("loading");
    setData(undefined);
    setError(null);

    callAPI(url, init)
      .then((successResponse) => {
        if (performUpdate) {
          setData(successResponse);
          setStatus("success");
        }
      })
      .catch((errorResponse) => {
        if (performUpdate) {
          setError(errorResponse);
          setStatus("error");
        }
      });
    return () => {
      performUpdate = false;
    };
  }, [url, init]);

  return { data, status, error };
};

export const calcUpcomingNotes = (data = []) => {
  const today = new Date();

  const paddedMonth =
    today.getMonth() > 8 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
  const paddedToday =
    today.getDate() > 9 ? today.getDate() : `0${today.getDate()}`;
  const paddedTomorrow =
    today.getDate() + 1 > 9 ? today.getDate() : `0${today.getDate() + 1}`;

  const todayish = `${today.getFullYear()}-${paddedMonth}-${paddedToday}`;
  const tomorrowish = `${today.getFullYear()}-${paddedMonth}-${paddedTomorrow}`;
  const initialValue = { today: [], tomorrow: [], restOfWeek: [] };

  return data.reduce((acc, { id, next_occurrence: nextOccurrence }) => {
    if (nextOccurrence === todayish) {
      acc.today.push(id);
    } else if (nextOccurrence === tomorrowish) {
      acc.tomorrow.push(id);
    } else {
      acc.restOfWeek.push(id);
    }
    return acc;
  }, initialValue);
};
