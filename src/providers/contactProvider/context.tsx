"use client";

import { createContext } from "react";
import {
  ContactDto,
  CreateContactDto,
  UpdateContactDto,
  ContactQueryParams,
} from "./types";

export interface IContactStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  contacts: ContactDto[];
  selectedContact: ContactDto | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface IContactActionContext {
  fetchContacts: (params?: ContactQueryParams) => void;
  fetchContactById: (id: string) => void;
  fetchContactsByClient: (clientId: string) => void;
  createContact: (contact: CreateContactDto) => void;
  updateContact: (id: string, contact: UpdateContactDto) => void;
  deleteContact: (id: string) => void;
  setPrimaryContact: (id: string, clientId: string) => void;
  setSelectedContact: (contact: ContactDto | null) => void;
}

export const INITIAL_STATE: IContactStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  contacts: [],
  selectedContact: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
};

export const ContactStateContext =
  createContext<IContactStateContext>(INITIAL_STATE);
export const ContactActionContext = createContext<IContactActionContext>(
  undefined as unknown as IContactActionContext,
);
