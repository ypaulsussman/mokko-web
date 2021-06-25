import { ACTIONS } from "../constants";
import { getInitialInterval } from "../utils";

export const initialAppState = {
  isLoggedIn: Boolean(sessionStorage.getItem("mokkoAuthToken")),
  mokkoStatus: {
    mokkoValue: "",
    mokkoInterval: 0,
    mokkoStage: 1,
  },
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOG_IN:
      return {
        ...state,
        isLoggedIn: true,
      };

    case ACTIONS.LOG_OUT:
      return {
        ...initialAppState,
      };

    case ACTIONS.MOKKO_SUCCESS:
      const prunedReviewNotes = state.notesToReview.filter(
        ({ id }) => id !== action.noteId
      );
      return {
        ...state,
        notesToReview: prunedReviewNotes,
        mokkoStatus: {
          ...initialAppState.mokkoStatus,
          mokkoInterval: getInitialInterval(
            prunedReviewNotes[0].current_interval
          ),
        },
      };

    case ACTIONS.SET_DECKS:
      return {
        ...state,
        decks: action.decks,
      };

    case ACTIONS.SET_MOKKOSTATUS:
      return {
        ...state,
        mokkoStatus: {
          ...state.mokkoStatus,
          ...action.mokkoStatus,
        },
      };

    case ACTIONS.SET_NOTE:
      return {
        ...state,
        note: action.note,
      };
      
    case ACTIONS.SET_REVIEW_NOTES:
      return {
        ...state,
        allPrompts: action.allPrompts,
        notesToReview: action.notesToReview,
        mokkoStatus: {
          ...initialAppState.mokkoStatus,
          mokkoInterval: getInitialInterval(
            action.notesToReview[0].current_interval
          ),
        },
      };

    default:
      throw new Error("That is *not* a valid action.type, my friend.");
  }
};
