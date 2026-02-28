"use client";

import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { ClientDto } from "@/providers/clientProvider/types";

export const useCreateOpportunityPrompt = () => {
  const router = useRouter();

  const promptCreateOpportunity = (client: ClientDto) => {
    const clientName = client.name || "this client";
    Modal.confirm({
      title: "Create Opportunity?",
      content: `Would you like to create an opportunity for ${clientName}?`,
      okText: "Yes, create opportunity",
      cancelText: "Not now",
      onOk: () => {
        router.push(
          `/opportunities?clientId=${client.id}&clientName=${encodeURIComponent(client.name || "")}`,
        );
      },
    });
  };

  return { promptCreateOpportunity };
};
