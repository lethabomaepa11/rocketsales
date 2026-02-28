"use client";

import { IContactStateContext } from "./context";
import * as ContactActions from "./actions";

export const ContactReducer = (
  state: IContactStateContext,
  action: { type: string; payload?: unknown },
): IContactStateContext => {
  switch (action.type) {
    case ContactActions.FETCH_CONTACTS_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContactActions.FETCH_CONTACTS_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contacts: (action.payload as IContactStateContext["contacts"])?.filter(
          (contact) => contact.isActive !== false,
        ),
      };
    case ContactActions.FETCH_CONTACTS_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case ContactActions.FETCH_CONTACT_BY_ID_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContactActions.FETCH_CONTACT_BY_ID_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        selectedContact:
          action.payload as IContactStateContext["selectedContact"],
      };
    case ContactActions.FETCH_CONTACT_BY_ID_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case ContactActions.CREATE_CONTACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContactActions.CREATE_CONTACT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contacts: [
          action.payload,
          ...state.contacts,
        ] as IContactStateContext["contacts"],
      };
    case ContactActions.CREATE_CONTACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case ContactActions.UPDATE_CONTACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContactActions.UPDATE_CONTACT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contacts: state.contacts.map((c) =>
          c.id === (action.payload as { id: string }).id
            ? (action.payload as IContactStateContext["contacts"][0])
            : c,
        ) as IContactStateContext["contacts"],
      };
    case ContactActions.UPDATE_CONTACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case ContactActions.DELETE_CONTACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContactActions.DELETE_CONTACT_SUCCESS:
      return {
        ...state,
        isPending: false,
        isSuccess: true,
        isError: false,
        contacts: state.contacts.filter(
          (c) => c.id !== action.payload,
        ) as IContactStateContext["contacts"],
      };
    case ContactActions.DELETE_CONTACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case ContactActions.SET_PRIMARY_CONTACT_PENDING:
      return { ...state, isPending: true, isSuccess: false, isError: false };
    case ContactActions.SET_PRIMARY_CONTACT_SUCCESS:
      return { ...state, isPending: false, isSuccess: true, isError: false };
    case ContactActions.SET_PRIMARY_CONTACT_ERROR:
      return { ...state, isPending: false, isSuccess: false, isError: true };

    case ContactActions.SET_SELECTED_CONTACT:
      return {
        ...state,
        selectedContact:
          action.payload as IContactStateContext["selectedContact"],
      };

    default:
      return state;
  }
};
