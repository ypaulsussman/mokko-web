import { ACTIONS } from "../constants";

export const initialAppState = {
  isLoggedIn: Boolean(localStorage.getItem("mokkoAuthToken")),
  upcomingNotes: {
    today: [],
    tomorrow: [],
    restOfWeek: [],
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
      console.log("state.notesToReview: ", state.notesToReview);
      return {
        ...state,
        notesToReview: state.notesToReview.filter(
          ({ id }) => id !== action.noteId
        ),
      };

    case ACTIONS.SET_REVIEW_NOTES:
      return {
        ...state,
        notesToReview: action.notesToReview,
        allPrompts: action.allPrompts,
      };

    case ACTIONS.SET_UPCOMING_NOTES:
      return {
        ...state,
        upcomingNotes: action.upcomingNotes,
      };

    default:
      return state;
  }
};
