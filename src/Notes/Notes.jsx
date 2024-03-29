import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { callAPI } from "../utils";
import { ACTIONS, API_URL } from "../constants";
import Header from "../shared/Header/Header";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import TextDisplay from "../shared/TextDisplay/TextDisplay";

const NOTES_PER_PAGE = 6;
const PAGE_LINKS_IN_PAGINATOR = 6;
const getPageURL = (page) => `/notes?page=${page}`;
const buildPaginationLinks = (totalPages, setCurrentPage) => {
  return (
    <>
      <Link
        to={getPageURL(1)}
        onClick={() => setCurrentPage(1)}
        className="pagination-link"
        aria-label="Go to page 1"
      >
        1
      </Link>
      <Link
        to={getPageURL(2)}
        onClick={() => setCurrentPage(2)}
        className="pagination-link"
        aria-label="Go to page 2"
      >
        2
      </Link>
      <Link
        to={getPageURL(3)}
        onClick={() => setCurrentPage(3)}
        className="pagination-link"
        aria-label="Go to page 3"
      >
        3
      </Link>
      {totalPages > PAGE_LINKS_IN_PAGINATOR ? (
        <li aria-hidden>
          <span className="pagination-ellipsis">&hellip;</span>
        </li>
      ) : null}
      {totalPages > 5 ? (
        <Link
          to={getPageURL(totalPages - 2)}
          onClick={() => setCurrentPage(totalPages - 2)}
          className="pagination-link"
          aria-label={`Go to page ${totalPages - 2}`}
        >
          {totalPages - 2}
        </Link>
      ) : null}
      {totalPages > 4 ? (
        <Link
          to={getPageURL(totalPages - 1)}
          onClick={() => setCurrentPage(totalPages - 1)}
          className="pagination-link"
          aria-label={`Go to page ${totalPages - 1}`}
        >
          {totalPages - 1}
        </Link>
      ) : null}
      <Link
        to={getPageURL(totalPages)}
        onClick={() => setCurrentPage(totalPages)}
        className="pagination-link"
        aria-label={`Go to page ${totalPages}`}
      >
        {totalPages}
      </Link>
    </>
  );
};

const buildPaginator = (currentPage, setCurrentPage, totalPages) => {
  return (
    <nav
      className="pagination is-centered mt-4 mb-4"
      role="navigation"
      aria-label="pagination"
    >
      <Link
        to={
          currentPage - 1
            ? getPageURL(currentPage - 1)
            : getPageURL(currentPage)
        }
        onClick={() =>
          setCurrentPage(currentPage - 1 ? currentPage - 1 : currentPage)
        }
        className="pagination-previous"
        aria-label="Go to previous page"
      >
        Previous
      </Link>
      <ul className="pagination-list">
        {buildPaginationLinks(totalPages, setCurrentPage)}
      </ul>
      <Link
        to={
          currentPage < totalPages
            ? getPageURL(currentPage + 1)
            : getPageURL(currentPage)
        }
        onClick={() =>
          currentPage < totalPages
            ? setCurrentPage(currentPage + 1)
            : setCurrentPage(currentPage)
        }
        className="pagination-next"
        aria-label="Go to next page"
      >
        Next
      </Link>
    </nav>
  );
};

const Notes = ({ appState, appDispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(
    Number(new URLSearchParams(window.location.search).get("page")) || 1
  );
  const totalPages = Math.ceil(appState.noteCount / NOTES_PER_PAGE);

  // On unmount, clear any redirect message
  useEffect(() => {
    return () => {
      appDispatch({
        type: ACTIONS.SET_REDIRECT_MESSAGE,
        message: null,
      });
    };
  }, [appDispatch]);

  const getNotes = useCallback(() => {
    setIsLoading(true);
    callAPI(`${API_URL}${getPageURL(currentPage)}`, {
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("mokkoAuthToken"),
      },
    })
      .then((data) => {
        setIsLoading(false);
        appDispatch({
          type: ACTIONS.SET_NOTES,
          notes: data.notes,
          noteCount: data.note_count,
        });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        setError(message);
      });
  }, [appDispatch, currentPage]);

  useEffect(() => getNotes(), [getNotes]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Header
        isLoggedIn={appState.isLoggedIn}
        appDispatch={appDispatch}
        extraLinks={[{ text: "New Note", url: "/notes/new" }]}
      />
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <h1 className="title is-1">Notes</h1>
          {appState.redirectMessage ? <p>{appState.redirectMessage}</p> : null}

          <div className="delete-me-later">
            <i>(...search and sort forthcoming)</i>
          </div>

          {appState.noteCount &&
            buildPaginator(currentPage, setCurrentPage, totalPages)}

          {appState.paginatedNotes &&
            appState.paginatedNotes.map(({ content, id }) => (
              <div key={id}>
                <TextDisplay text={content} />
                <Link to={`/notes/${id}`}> See Note Details</Link>
                <hr style={{ height: "1px", backgroundColor: "darkgray" }} />
              </div>
            ))}

          {appState.noteCount &&
            buildPaginator(currentPage, setCurrentPage, totalPages)}
        </>
      )}
    </>
  );
};

export default Notes;
