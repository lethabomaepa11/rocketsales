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
  const { notification } = App.useApp();

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
        notification.error({
          title: "Error",
          description: "Failed to fetch contacts",
        });
      }
    },
    [instance, notification],
  );

  const fetchContactById = useCallback(
    async (id: string) => {
      dispatch(ContactActions.fetchContactByIdPending());
      try {
        const response = await instance.get(`/Contacts/${id}`);
        dispatch(ContactActions.fetchContactByIdSuccess(response.data));
      } catch (error) {
        dispatch(ContactActions.fetchContactByIdError());
        notification.error({
          title: "Error",
          description: "Failed to fetch contact",
        });
      }
    },
    [instance, notification],
  );

  const fetchContactsByClient = useCallback(
    async (clientId: string) => {
      dispatch(ContactActions.fetchContactsPending());
      try {
        const response = await instance.get(`/Contacts/by-client/${clientId}`);
        dispatch(ContactActions.fetchContactsSuccess(response.data || []));
      } catch (error) {
        dispatch(ContactActions.fetchContactsError());
        notification.error({
          title: "Error",
          description: "Failed to fetch contacts",
        });
      }
    },
    [instance, notification],
  );

  const createContact = useCallback(
    async (contact: CreateContactDto) => {
      dispatch(ContactActions.createContactPending());
      try {
        const response = await instance.post("/Contacts", contact);
        dispatch(ContactActions.createContactSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Contact created successfully",
        });
        return response.data;
      } catch (error) {
        dispatch(ContactActions.createContactError());
        notification.error({
          title: "Error",
          description: "Failed to create contact",
        });
        throw error;
      }
    },
    [instance, notification],
  );

  const updateContact = useCallback(
    async (id: string, contact: UpdateContactDto) => {
      dispatch(ContactActions.updateContactPending());
      try {
        const response = await instance.put(`/Contacts/${id}`, contact);
        dispatch(ContactActions.updateContactSuccess(response.data));
        notification.success({
          title: "Success",
          description: "Contact updated successfully",
        });
      } catch (error) {
        dispatch(ContactActions.updateContactError());
        notification.error({
          title: "Error",
          description: "Failed to update contact",
        });
      }
    },
    [instance, notification],
  );

  const deleteContact = useCallback(
    async (id: string) => {
      dispatch(ContactActions.deleteContactPending());
      try {
        await instance.delete(`/Contacts/${id}`);
        dispatch(ContactActions.deleteContactSuccess(id));
        notification.success({
          title: "Success",
          description: "Contact deleted successfully",
        });
      } catch (error) {
        dispatch(ContactActions.deleteContactError());
        notification.error({
          title: "Error",
          description: "Failed to delete contact",
        });
      }
    },
    [instance, notification],
  );

  const setPrimaryContact = useCallback(
    async (id: string, clientId: string) => {
      dispatch(ContactActions.setPrimaryContactPending());
      try {
        await instance.put(`/Contacts/${id}/set-primary`);
        dispatch(ContactActions.setPrimaryContactSuccess({ id, clientId }));
        notification.success({
          title: "Success",
          description: "Primary contact set successfully",
        });
      } catch (error) {
        dispatch(ContactActions.setPrimaryContactError());
        notification.error({
          title: "Error",
          description: "Failed to set primary contact",
        });
      }
    },
    [instance, notification],
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
