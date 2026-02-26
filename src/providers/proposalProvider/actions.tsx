"use client";

export const FETCH_PROPOSALS_PENDING = "FETCH_PROPOSALS_PENDING";
export const FETCH_PROPOSALS_SUCCESS = "FETCH_PROPOSALS_SUCCESS";
export const FETCH_PROPOSALS_ERROR = "FETCH_PROPOSALS_ERROR";
export const CREATE_PROPOSAL_PENDING = "CREATE_PROPOSAL_PENDING";
export const CREATE_PROPOSAL_SUCCESS = "CREATE_PROPOSAL_SUCCESS";
export const CREATE_PROPOSAL_ERROR = "CREATE_PROPOSAL_ERROR";
export const UPDATE_PROPOSAL_PENDING = "UPDATE_PROPOSAL_PENDING";
export const UPDATE_PROPOSAL_SUCCESS = "UPDATE_PROPOSAL_SUCCESS";
export const UPDATE_PROPOSAL_ERROR = "UPDATE_PROPOSAL_ERROR";
export const DELETE_PROPOSAL_PENDING = "DELETE_PROPOSAL_PENDING";
export const DELETE_PROPOSAL_SUCCESS = "DELETE_PROPOSAL_SUCCESS";
export const DELETE_PROPOSAL_ERROR = "DELETE_PROPOSAL_ERROR";

export const fetchProposalsPending = () => ({ type: FETCH_PROPOSALS_PENDING });
export const fetchProposalsSuccess = (payload: unknown) => ({
  type: FETCH_PROPOSALS_SUCCESS,
  payload,
});
export const fetchProposalsError = () => ({ type: FETCH_PROPOSALS_ERROR });
export const createProposalPending = () => ({ type: CREATE_PROPOSAL_PENDING });
export const createProposalSuccess = (payload: unknown) => ({
  type: CREATE_PROPOSAL_SUCCESS,
  payload,
});
export const createProposalError = () => ({ type: CREATE_PROPOSAL_ERROR });
export const updateProposalPending = () => ({ type: UPDATE_PROPOSAL_PENDING });
export const updateProposalSuccess = (payload: unknown) => ({
  type: UPDATE_PROPOSAL_SUCCESS,
  payload,
});
export const updateProposalError = () => ({ type: UPDATE_PROPOSAL_ERROR });
export const deleteProposalPending = () => ({ type: DELETE_PROPOSAL_PENDING });
export const deleteProposalSuccess = (id: string) => ({
  type: DELETE_PROPOSAL_SUCCESS,
  payload: id,
});
export const deleteProposalError = () => ({ type: DELETE_PROPOSAL_ERROR });

export const SET_SELECTED_PROPOSAL = "SET_SELECTED_PROPOSAL";
export const setSelectedProposal = (payload: unknown) => ({
  type: SET_SELECTED_PROPOSAL,
  payload,
});
