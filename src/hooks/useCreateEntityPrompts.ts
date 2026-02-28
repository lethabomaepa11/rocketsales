"use client";

import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { ClientDto } from "@/providers/clientProvider/types";
import { ContactDto } from "@/providers/contactProvider/types";

export const useCreateEntityPrompts = () => {
  const router = useRouter();

  const promptCreateContact = (client: ClientDto) => {
    const clientName = client.name || "this client";
    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: "Create Contact?",
        content: `Would you like to create a contact for ${clientName}?`,
        okText: "Yes, add contact",
        cancelText: "Not now",
        onOk: () => {
          // Navigate to client details page where they can add contact
          router.push(`/clients/${client.id}?tab=contacts&addContact=true`);
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };

  const promptCreateOpportunity = (
    client: ClientDto,
    contactId?: string,
  ) => {
    const clientName = client.name || "this client";
    Modal.confirm({
      title: "Create Opportunity?",
      content: `Would you like to create an opportunity for ${clientName}?`,
      okText: "Yes, create opportunity",
      cancelText: "Not now",
      onOk: () => {
        // Build URL with client and contact params
        const params = new URLSearchParams({
          new: "true",
          clientId: client.id,
          clientName: client.name || "",
        });
        if (contactId) {
          params.append("contactId", contactId);
        }
        router.push(`/opportunities?${params.toString()}`);
      },
    });
  };

  // Combined flow: after client is created, prompt for contact then opportunity
  const promptAfterClientCreate = async (client: ClientDto) => {
    // First prompt for contact
    const wantsContact = await promptCreateContact(client);

    // If user said yes to contact, they'll be redirected to client page
    // If not, prompt for opportunity
    if (!wantsContact) {
      promptCreateOpportunity(client);
    }
    // If wantsContact is true, user is redirected to client page
    // where they can add contact, then they'll be prompted for opportunity
  };

  const promptCreateContract = (opportunity: {
    id: string;
    title: string | null;
    clientId: string;
    clientName: string | null;
    estimatedValue: number;
    currency: string | null;
  }) => {
    const oppName = opportunity.title || "this opportunity";
    const clientName = opportunity.clientName || "the client";
    const value = opportunity.currency
      ? `${opportunity.currency} ${opportunity.estimatedValue?.toLocaleString() || 0}`
      : `R ${opportunity.estimatedValue?.toLocaleString() || 0}`;

    Modal.confirm({
      title: "Create Contract?",
      content: `Would you like to create a contract for "${oppName}" (${clientName}) worth ${value}?`,
      okText: "Yes, create contract",
      cancelText: "Not now",
      onOk: () => {
        // Navigate to contracts page with pre-filled opportunity data
        const params = new URLSearchParams({
          new: "true",
          opportunityId: opportunity.id,
          clientId: opportunity.clientId,
          clientName: opportunity.clientName || "",
          value: opportunity.estimatedValue?.toString() || "0",
          currency: opportunity.currency || "R",
        });
        router.push(`/contracts?${params.toString()}`);
      },
    });
  };

  return {
    promptCreateContact,
    promptCreateOpportunity,
    promptAfterClientCreate,
    promptCreateContract,
  };
};
