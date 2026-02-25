"use client";

import { IOpportunityStateContext } from "./context";
import * as OpportunityActions from "./actions";

export const OpportunityReducer = (
  state: IOpportunityStateContext,
  action: { type: string; payload?: unknown },
): IOpportunityStateContext => {
  switch (action.type) {
    case OpportunityActions.FETCH_OPPORTUNITIES_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case OpportunityActions.FETCH_OPPORTUNITIES_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        opportunities:
          action.payload as IOpportunityStateContext["opportunities"],
      };
    case OpportunityActions.FETCH_OPPORTUNITIES_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case OpportunityActions.FETCH_OPPORTUNITY_BY_ID_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case OpportunityActions.FETCH_OPPORTUNITY_BY_ID_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        selectedOpportunity:
          action.payload as IOpportunityStateContext["selectedOpportunity"],
      };
    case OpportunityActions.FETCH_OPPORTUNITY_BY_ID_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case OpportunityActions.CREATE_OPPORTUNITY_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case OpportunityActions.CREATE_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        opportunities: [
          action.payload,
          ...state.opportunities,
        ] as IOpportunityStateContext["opportunities"],
      };
    case OpportunityActions.CREATE_OPPORTUNITY_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case OpportunityActions.UPDATE_OPPORTUNITY_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case OpportunityActions.UPDATE_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        opportunities: state.opportunities.map((o) =>
          o.id === (action.payload as { id: string }).id
            ? (action.payload as IOpportunityStateContext["opportunities"][0])
            : o,
        ) as IOpportunityStateContext["opportunities"],
      };
    case OpportunityActions.UPDATE_OPPORTUNITY_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case OpportunityActions.DELETE_OPPORTUNITY_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case OpportunityActions.DELETE_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        opportunities: state.opportunities.filter(
          (o) => o.id !== action.payload,
        ) as IOpportunityStateContext["opportunities"],
      };
    case OpportunityActions.DELETE_OPPORTUNITY_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };
    case OpportunityActions.SET_SELECTED_OPPORTUNITY:
      return {
        ...state,
        selectedOpportunity:
          action.payload as IOpportunityStateContext["selectedOpportunity"],
      };
    default:
      return state;
  }
};
