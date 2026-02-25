"use client";

export const FETCH_CONTRACTS_PENDING = "FETCH_CONTRACTS_PENDING";
export const FETCH_CONTRACTS_SUCCESS = "FETCH_CONTRACTS_SUCCESS";
export const FETCH_CONTRACTS_ERROR = "FETCH_CONTRACTS_ERROR";
export const CREATE_CONTRACT_PENDING = "CREATE_CONTRACT_PENDING";
export const CREATE_CONTRACT_SUCCESS = "CREATE_CONTRACT_SUCCESS";
export const CREATE_CONTRACT_ERROR = "CREATE_CONTRACT_ERROR";
export const UPDATE_CONTRACT_PENDING = "UPDATE_CONTRACT_PENDING";
export const UPDATE_CONTRACT_SUCCESS = "UPDATE_CONTRACT_SUCCESS";
export const UPDATE_CONTRACT_ERROR = "UPDATE_CONTRACT_ERROR";
export const DELETE_CONTRACT_PENDING = "DELETE_CONTRACT_PENDING";
export const DELETE_CONTRACT_SUCCESS = "DELETE_CONTRACT_SUCCESS";
export const DELETE_CONTRACT_ERROR = "DELETE_CONTRACT_ERROR";

export const fetchContractsPending = () => ({ type: FETCH_CONTRACTS_PENDING });
export const fetchContractsSuccess = (payload: unknown) => ({
  type: FETCH_CONTRACTS_SUCCESS,
  payload,
});
export const fetchContractsError = () => ({ type: FETCH_CONTRACTS_ERROR });
export const createContractPending = () => ({ type: CREATE_CONTRACT_PENDING });
export const createContractSuccess = (payload: unknown) => ({
  type: CREATE_CONTRACT_SUCCESS,
  payload,
});
export const createContractError = () => ({ type: CREATE_CONTRACT_ERROR });
export const updateContractPending = () => ({ type: UPDATE_CONTRACT_PENDING });
export const updateContractSuccess = (payload: unknown) => ({
  type: UPDATE_CONTRACT_SUCCESS,
  payload,
});
export const updateContractError = () => ({ type: UPDATE_CONTRACT_ERROR });
export const deleteContractPending = () => ({ type: DELETE_CONTRACT_PENDING });
export const deleteContractSuccess = (id: string) => ({
  type: DELETE_CONTRACT_SUCCESS,
  payload: id,
});
export const deleteContractError = () => ({ type: DELETE_CONTRACT_ERROR });
