"use client";

import { IActivityStateContext } from "./context";
import * as ActivityActions from "./actions";

export const ActivityReducer = (
  state: IActivityStateContext,
  action: { type: string; payload?: unknown },
): IActivityStateContext => {
  switch (action.type) {
    case ActivityActions.FETCH_ACTIVITIES_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ActivityActions.FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        activities: action.payload as IActivityStateContext["activities"],
      };
    case ActivityActions.FETCH_ACTIVITIES_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ActivityActions.CREATE_ACTIVITY_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ActivityActions.CREATE_ACTIVITY_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        activities: [
          action.payload as IActivityStateContext["activities"][0],
          ...state.activities,
        ],
      };
    case ActivityActions.CREATE_ACTIVITY_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ActivityActions.UPDATE_ACTIVITY_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ActivityActions.UPDATE_ACTIVITY_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        activities: state.activities.map((a) =>
          a.id === (action.payload as { id: string }).id
            ? (action.payload as IActivityStateContext["activities"][0])
            : a,
        ),
      };
    case ActivityActions.UPDATE_ACTIVITY_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ActivityActions.DELETE_ACTIVITY_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ActivityActions.DELETE_ACTIVITY_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        activities: state.activities.filter((a) => a.id !== action.payload),
      };
    case ActivityActions.DELETE_ACTIVITY_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ActivityActions.FETCH_PARTICIPANTS_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ActivityActions.FETCH_PARTICIPANTS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        participants: action.payload as IActivityStateContext["participants"],
      };
    case ActivityActions.FETCH_PARTICIPANTS_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ActivityActions.ADD_PARTICIPANT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ActivityActions.ADD_PARTICIPANT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        participants: [
          ...state.participants,
          action.payload as IActivityStateContext["participants"][0],
        ],
      };
    case ActivityActions.ADD_PARTICIPANT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    default:
      return state;
  }
};
