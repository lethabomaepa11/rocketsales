"use client";

import { useContext, useReducer, useCallback } from "react";
import { App } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import {
  ContactStateContext,
  ContactActionContext,
  INITIAL_STATE,
  IContactStateContext,
} from "./context";
import { ContactReducer } from "./reducer";
import * as ContactActions from "./actions";
import {
  ContactQueryParams,
  CreateContactDto,
  UpdateContactDto,
} from "./types";

export const ContactProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ContactReducer, INITIAL_STATE);
  const instance = getAxiosInstance();
  const { message } = App.useApp();

  const fetchContacts = useCallback(
    async (params?: ContactQueryParams) => {
      dispatch(ContactActions.fetchContactsPending());
      try {
        const response = await instance.get("/Contacts", { params });
        dispatch(
          ContactActions.fetchContactsSuccess(response.data.items || []),
        );
      } catch (error) {
        dispatch(ContactActions.fetchContactsError());
        message.error("Failed to fetch contacts");
      }
    },
    [instance, message],
  );

  const fetchContactById = useCallback(
    async (id: string) => {
      dispatch(ContactActions.fetchContactByIdPending());
      try {
        const response = await instance.get(`/Contacts/${id}`);
        dispatch(ContactActions.fetchContactByIdSuccess(response.data));
      } catch (error) {
        dispatch(ContactActions.fetchContactByIdError());
        message.error("Failed to fetch contact");
      }
    },
    [instance, message],
  );

  const fetchContactsByClient = useCallback(
    async (clientId: string) => {
      dispatch(ContactActions.fetchContactsPending());
      try {
        const response = await instance.get(`/Contacts/by-client/${clientId}`);
        dispatch(ContactActions.fetchContactsSuccess(response.data || []));
      } catch (error) {
        dispatch(ContactActions.fetchContactsError());
        message.error("Failed to fetch contacts");
      }
    },
    [instance, message],
  );

  const createContact = useCallback(
    async (contact: CreateContactDto) => {
      dispatch(ContactActions.createContactPending());
      try {
        const response = await instance.post("/Contacts", contact);
        dispatch(ContactActions.createContactSuccess(response.data));
        message.success("Contact created successfully");
        return response.data;
      } catch (error) {
        dispatch(ContactActions.createContactError());
        message.error("Failed to create contact");
        throw error;
      }
    },
    [instance, message],
  );

  const updateContact = useCallback(
    async (id: string, contact: UpdateContactDto) => {
      dispatch(ContactActions.updateContactPending());
      try {
        const response = await instance.put(`/Contacts/${id}`, contact);
        dispatch(ContactActions.updateContactSuccess(response.data));
        message.success("Contact updated successfully");
      } catch (error) {
        dispatch(ContactActions.updateContactError());
        message.error("Failed to update contact");
      }
    },
    [instance, message],
  );

  const deleteContact = useCallback(
    async (id: string) => {
      dispatch(ContactActions.deleteContactPending());
      try {
        await instance.delete(`/Contacts/${id}`);
        dispatch(ContactActions.deleteContactSuccess(id));
        message.success("Contact deleted successfully");
      } catch (error) {
        dispatch(ContactActions.deleteContactError());
        message.error("Failed to delete contact");
      }
    },
    [instance, message],
  );

  const setPrimaryContact = useCallback(
    async (id: string, clientId: string) => {
      dispatch(ContactActions.setPrimaryContactPending());
      try {
        await instance.put(`/Contacts/${id}/set-primary`);
        dispatch(ContactActions.setPrimaryContactSuccess({ id, clientId }));
        message.success("Primary contact set successfully");
      } catch (error) {
        dispatch(ContactActions.setPrimaryContactError());
        message.error("Failed to set primary contact");
      }
    },
    [instance, message],
  );

  const setSelectedContact = useCallback(
    (contact: IContactStateContext["selectedContact"]) => {
      dispatch(ContactActions.setSelectedContact(contact));
    },
    [],
  );

  return (
    <ContactStateContext.Provider value={state}>
      <ContactActionContext.Provider
        value={{
          fetchContacts,
          fetchContactById,
          fetchContactsByClient,
          createContact,
          updateContact,
          deleteContact,
          setPrimaryContact,
          setSelectedContact,
        }}
      >
        {children}
      </ContactActionContext.Provider>
    </ContactStateContext.Provider>
  );
};

export const useContactState = () => {
  const context = useContext(ContactStateContext);
  if (!context)
    throw new Error("useContactState must be used within ContactProvider");
  return context;
};

export const useContactActions = () => {
  const context = useContext(ContactActionContext);
  if (!context)
    throw new Error("useContactActions must be used within ContactProvider");
  return context;
};
