"use client";

export const FETCH_OPPORTUNITIES_PENDING = "FETCH_OPPORTUNITIES_PENDING";
export const FETCH_OPPORTUNITIES_SUCCESS = "FETCH_OPPORTUNITIES_SUCCESS";
export const FETCH_OPPORTUNITIES_ERROR = "FETCH_OPPORTUNITIES_ERROR";
export const FETCH_OPPORTUNITY_BY_ID_PENDING =
  "FETCH_OPPORTUNITY_BY_ID_PENDING";
export const FETCH_OPPORTUNITY_BY_ID_SUCCESS =
  "FETCH_OPPORTUNITY_BY_ID_SUCCESS";
export const FETCH_OPPORTUNITY_BY_ID_ERROR = "FETCH_OPPORTUNITY_BY_ID_ERROR";
export const FETCH_PIPELINE_PENDING = "FETCH_PIPELINE_PENDING";
export const FETCH_PIPELINE_SUCCESS = "FETCH_PIPELINE_SUCCESS";
export const FETCH_PIPELINE_ERROR = "FETCH_PIPELINE_ERROR";
export const FETCH_STAGE_HISTORY_PENDING = "FETCH_STAGE_HISTORY_PENDING";
export const FETCH_STAGE_HISTORY_SUCCESS = "FETCH_STAGE_HISTORY_SUCCESS";
export const FETCH_STAGE_HISTORY_ERROR = "FETCH_STAGE_HISTORY_ERROR";
export const CREATE_OPPORTUNITY_PENDING = "CREATE_OPPORTUNITY_PENDING";
export const CREATE_OPPORTUNITY_SUCCESS = "CREATE_OPPORTUNITY_SUCCESS";
export const CREATE_OPPORTUNITY_ERROR = "CREATE_OPPORTUNITY_ERROR";
export const UPDATE_OPPORTUNITY_PENDING = "UPDATE_OPPORTUNITY_PENDING";
export const UPDATE_OPPORTUNITY_SUCCESS = "UPDATE_OPPORTUNITY_SUCCESS";
export const UPDATE_OPPORTUNITY_ERROR = "UPDATE_OPPORTUNITY_ERROR";
export const DELETE_OPPORTUNITY_PENDING = "DELETE_OPPORTUNITY_PENDING";
export const DELETE_OPPORTUNITY_SUCCESS = "DELETE_OPPORTUNITY_SUCCESS";
export const DELETE_OPPORTUNITY_ERROR = "DELETE_OPPORTUNITY_ERROR";
export const UPDATE_STAGE_PENDING = "UPDATE_STAGE_PENDING";
export const UPDATE_STAGE_SUCCESS = "UPDATE_STAGE_SUCCESS";
export const UPDATE_STAGE_ERROR = "UPDATE_STAGE_ERROR";
export const ASSIGN_OPPORTUNITY_PENDING = "ASSIGN_OPPORTUNITY_PENDING";
export const ASSIGN_OPPORTUNITY_SUCCESS = "ASSIGN_OPPORTUNITY_SUCCESS";
export const ASSIGN_OPPORTUNITY_ERROR = "ASSIGN_OPPORTUNITY_ERROR";
export const SET_SELECTED_OPPORTUNITY = "SET_SELECTED_OPPORTUNITY";

export const fetchOpportunitiesPending = () => ({
  type: FETCH_OPPORTUNITIES_PENDING,
});
export const fetchOpportunitiesSuccess = (payload: unknown) => ({
  type: FETCH_OPPORTUNITIES_SUCCESS,
  payload,
});
export const fetchOpportunitiesError = () => ({
  type: FETCH_OPPORTUNITIES_ERROR,
});
export const fetchOpportunityByIdPending = () => ({
  type: FETCH_OPPORTUNITY_BY_ID_PENDING,
});
export const fetchOpportunityByIdSuccess = (payload: unknown) => ({
  type: FETCH_OPPORTUNITY_BY_ID_SUCCESS,
  payload,
});
export const fetchOpportunityByIdError = () => ({
  type: FETCH_OPPORTUNITY_BY_ID_ERROR,
});
export const fetchPipelinePending = () => ({ type: FETCH_PIPELINE_PENDING });
export const fetchPipelineSuccess = (payload: unknown) => ({
  type: FETCH_PIPELINE_SUCCESS,
  payload,
});
export const fetchPipelineError = () => ({ type: FETCH_PIPELINE_ERROR });
export const fetchStageHistoryPending = () => ({
  type: FETCH_STAGE_HISTORY_PENDING,
});
export const fetchStageHistorySuccess = (payload: unknown) => ({
  type: FETCH_STAGE_HISTORY_SUCCESS,
  payload,
});
export const fetchStageHistoryError = () => ({
  type: FETCH_STAGE_HISTORY_ERROR,
});
export const createOpportunityPending = () => ({
  type: CREATE_OPPORTUNITY_PENDING,
});
export const createOpportunitySuccess = (payload: unknown) => ({
  type: CREATE_OPPORTUNITY_SUCCESS,
  payload,
});
export const createOpportunityError = () => ({
  type: CREATE_OPPORTUNITY_ERROR,
});
export const updateOpportunityPending = () => ({
  type: UPDATE_OPPORTUNITY_PENDING,
});
export const updateOpportunitySuccess = (payload: unknown) => ({
  type: UPDATE_OPPORTUNITY_SUCCESS,
  payload,
});
export const updateOpportunityError = () => ({
  type: UPDATE_OPPORTUNITY_ERROR,
});
export const deleteOpportunityPending = () => ({
  type: DELETE_OPPORTUNITY_PENDING,
});
export const deleteOpportunitySuccess = (id: string) => ({
  type: DELETE_OPPORTUNITY_SUCCESS,
  payload: id,
});
export const deleteOpportunityError = () => ({
  type: DELETE_OPPORTUNITY_ERROR,
});
export const updateStagePending = () => ({ type: UPDATE_STAGE_PENDING });
export const updateStageSuccess = (payload: unknown) => ({
  type: UPDATE_STAGE_SUCCESS,
  payload,
});
export const updateStageError = () => ({ type: UPDATE_STAGE_ERROR });
export const assignOpportunityPending = () => ({
  type: ASSIGN_OPPORTUNITY_PENDING,
});
export const assignOpportunitySuccess = (payload: unknown) => ({
  type: ASSIGN_OPPORTUNITY_SUCCESS,
  payload,
});
export const assignOpportunityError = () => ({
  type: ASSIGN_OPPORTUNITY_ERROR,
});
export const setSelectedOpportunity = (payload: unknown | null) => ({
  type: SET_SELECTED_OPPORTUNITY,
  payload,
});
