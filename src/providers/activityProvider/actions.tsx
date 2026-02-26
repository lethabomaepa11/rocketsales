"use client";

export const FETCH_ACTIVITIES_PENDING = "FETCH_ACTIVITIES_PENDING";
export const FETCH_ACTIVITIES_SUCCESS = "FETCH_ACTIVITIES_SUCCESS";
export const FETCH_ACTIVITIES_ERROR = "FETCH_ACTIVITIES_ERROR";
export const CREATE_ACTIVITY_PENDING = "CREATE_ACTIVITY_PENDING";
export const CREATE_ACTIVITY_SUCCESS = "CREATE_ACTIVITY_SUCCESS";
export const CREATE_ACTIVITY_ERROR = "CREATE_ACTIVITY_ERROR";
export const UPDATE_ACTIVITY_PENDING = "UPDATE_ACTIVITY_PENDING";
export const UPDATE_ACTIVITY_SUCCESS = "UPDATE_ACTIVITY_SUCCESS";
export const UPDATE_ACTIVITY_ERROR = "UPDATE_ACTIVITY_ERROR";
export const DELETE_ACTIVITY_PENDING = "DELETE_ACTIVITY_PENDING";
export const DELETE_ACTIVITY_SUCCESS = "DELETE_ACTIVITY_SUCCESS";
export const DELETE_ACTIVITY_ERROR = "DELETE_ACTIVITY_ERROR";

export const fetchActivitiesPending = () => ({
  type: FETCH_ACTIVITIES_PENDING,
});
export const fetchActivitiesSuccess = (payload: unknown) => ({
  type: FETCH_ACTIVITIES_SUCCESS,
  payload,
});
export const fetchActivitiesError = () => ({ type: FETCH_ACTIVITIES_ERROR });
export const createActivityPending = () => ({ type: CREATE_ACTIVITY_PENDING });
export const createActivitySuccess = (payload: unknown) => ({
  type: CREATE_ACTIVITY_SUCCESS,
  payload,
});
export const createActivityError = () => ({ type: CREATE_ACTIVITY_ERROR });
export const updateActivityPending = () => ({ type: UPDATE_ACTIVITY_PENDING });
export const updateActivitySuccess = (payload: unknown) => ({
  type: UPDATE_ACTIVITY_SUCCESS,
  payload,
});
export const updateActivityError = () => ({ type: UPDATE_ACTIVITY_ERROR });
export const deleteActivityPending = () => ({ type: DELETE_ACTIVITY_PENDING });
export const deleteActivitySuccess = (id: string) => ({
  type: DELETE_ACTIVITY_SUCCESS,
  payload: id,
});
export const deleteActivityError = () => ({ type: DELETE_ACTIVITY_ERROR });

export const FETCH_PARTICIPANTS_PENDING = "FETCH_PARTICIPANTS_PENDING";
export const FETCH_PARTICIPANTS_SUCCESS = "FETCH_PARTICIPANTS_SUCCESS";
export const FETCH_PARTICIPANTS_ERROR = "FETCH_PARTICIPANTS_ERROR";
export const ADD_PARTICIPANT_PENDING = "ADD_PARTICIPANT_PENDING";
export const ADD_PARTICIPANT_SUCCESS = "ADD_PARTICIPANT_SUCCESS";
export const ADD_PARTICIPANT_ERROR = "ADD_PARTICIPANT_ERROR";

export const fetchParticipantsPending = () => ({
  type: FETCH_PARTICIPANTS_PENDING,
});
export const fetchParticipantsSuccess = (payload: unknown) => ({
  type: FETCH_PARTICIPANTS_SUCCESS,
  payload,
});
export const fetchParticipantsError = () => ({
  type: FETCH_PARTICIPANTS_ERROR,
});
export const addParticipantPending = () => ({
  type: ADD_PARTICIPANT_PENDING,
});
export const addParticipantSuccess = (payload: unknown) => ({
  type: ADD_PARTICIPANT_SUCCESS,
  payload,
});
export const addParticipantError = () => ({
  type: ADD_PARTICIPANT_ERROR,
});
