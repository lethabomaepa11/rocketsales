"use client";

import { IProposalStateContext } from "./context";
import * as ProposalActions from "./actions";

export const ProposalReducer = (
  state: IProposalStateContext,
  action: { type: string; payload?: unknown },
): IProposalStateContext => {
  switch (action.type) {
    case ProposalActions.FETCH_PROPOSALS_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ProposalActions.FETCH_PROPOSALS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        proposals: action.payload as IProposalStateContext["proposals"],
      };
    case ProposalActions.FETCH_PROPOSALS_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ProposalActions.CREATE_PROPOSAL_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ProposalActions.CREATE_PROPOSAL_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        proposals: [
          action.payload as IProposalStateContext["proposals"][0],
          ...state.proposals,
        ],
      };
    case ProposalActions.CREATE_PROPOSAL_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ProposalActions.UPDATE_PROPOSAL_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ProposalActions.UPDATE_PROPOSAL_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        proposals: state.proposals.map((p) =>
          p.id === (action.payload as { id: string }).id
            ? (action.payload as IProposalStateContext["proposals"][0])
            : p,
        ),
      };
    case ProposalActions.UPDATE_PROPOSAL_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case ProposalActions.DELETE_PROPOSAL_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ProposalActions.DELETE_PROPOSAL_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        proposals: state.proposals.filter((p) => p.id !== action.payload),
      };
    case ProposalActions.DELETE_PROPOSAL_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    default:
      return state;
  }
};
