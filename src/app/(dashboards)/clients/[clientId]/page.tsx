"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, Tabs, Typography, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useClientState, useClientActions } from "@/providers/clientProvider";
import {
  useContactState,
  useContactActions,
} from "@/providers/contactProvider";
import {
  useOpportunityState,
  useOpportunityActions,
} from "@/providers/opportunityProvider";
import {
  usePricingRequestState,
  usePricingRequestActions,
} from "@/providers/pricingRequestProvider";
import {
  useProposalState,
  useProposalActions,
} from "@/providers/proposalProvider";
import {
  useContractState,
  useContractActions,
} from "@/providers/contractProvider";
import ClientDetails from "@/components/dashboards/client/ClientDetails";
import ContactsTable from "@/components/dashboards/client/ContactsTable";
import OpportunitiesTable from "@/components/dashboards/client/OpportunitiesTable";
import PricingRequestsTable from "@/components/dashboards/client/PricingRequestsTable";
import ProposalsTable from "@/components/dashboards/client/ProposalsTable";
import ContractsTable from "@/components/dashboards/client/ContractsTable";
import { useStyles } from "@/components/dashboards/client/style/page.style";
import { OpportunityDto } from "@/providers/opportunityProvider/types";
import { ProposalDto } from "@/providers/proposalProvider/types";
import { ContractDto } from "@/providers/contractProvider/types";
import { useCreateEntityPrompts } from "@/hooks/useCreateEntityPrompts";
import { ClientDto } from "@/providers/clientProvider/types";

const { Title } = Typography;

const ClientPage = () => {
  const { clientId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { styles } = useStyles();
  const { selectedClient, isPending } = useClientState();
  const { fetchClientById } = useClientActions();
  const { contacts, isPending: contactsPending } = useContactState();
  const { fetchContactsByClient } = useContactActions();
  const { opportunities, isPending: opportunitiesPending } =
    useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();
  const { pricingRequests, isPending: pricingPending } =
    usePricingRequestState();
  const { fetchPricingRequests } = usePricingRequestActions();
  const { proposals, isPending: proposalsPending } = useProposalState();
  const { fetchProposals } = useProposalActions();
  const { contracts, isPending: contractsPending } = useContractState();
  const { fetchContracts } = useContractActions();

  // Check for addContact query param
  const shouldAddContact = searchParams.get("addContact") === "true";
  const { promptCreateOpportunity } = useCreateEntityPrompts();

  // Ref to control contacts table
  const contactsTableRef = useRef<{ openAddModal: () => void }>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (clientId) {
      fetchClientById(clientId as string);
      fetchContactsByClient(clientId as string);
      fetchOpportunities({ clientId: clientId as string });
      fetchPricingRequests();
      fetchProposals({ clientId: clientId as string });
      fetchContracts({ clientId: clientId as string });
    }
  }, []);

  // Handle addContact param - switch to contacts tab and open modal
  useEffect(() => {
    if (shouldAddContact && selectedClient && contacts.length >= 0) {
      // Use state updater function to avoid cascading render warnings
      setActiveTab((prev) => {
        if (prev !== "contacts") {
          // Schedule the modal open after state update
          setTimeout(() => {
            if (contactsTableRef.current) {
              contactsTableRef.current.openAddModal();
            }
          }, 100);
          return "contacts";
        }
        return prev;
      });
    }
  }, [shouldAddContact, selectedClient, contacts.length]);

  const handleBack = () => {
    router.push("/clients");
  };

  // Extract arrays from state
  const opportunitiesList = useMemo(() => {
    return Array.isArray(opportunities)
      ? opportunities
      : (opportunities as { items?: OpportunityDto[] })?.items || [];
  }, [opportunities]);

  const proposalsList = useMemo(() => {
    return Array.isArray(proposals)
      ? proposals
      : (proposals as { items?: ProposalDto[] })?.items || [];
  }, [proposals]);

  const contractsList = useMemo(() => {
    return Array.isArray(contracts)
      ? contracts
      : (contracts as { items?: ContractDto[] })?.items || [];
  }, [contracts]);

  // Filter pricing requests by client (since API doesn't support clientId filter)
  const clientPricingRequests = useMemo(() => {
    return pricingRequests.filter((pr) => {
      // Try to match by checking if the opportunity belongs to this client
      // This is a workaround since pricing requests don't have direct clientId
      return true; // Show all for now, can be refined based on actual data structure
    });
  }, [pricingRequests]);

  // Handle contact created - prompt for opportunity
  const handleContactCreated = (contactId: string) => {
    if (selectedClient) {
      promptCreateOpportunity(selectedClient as ClientDto, contactId);
    }
  };

  if (isPending || !selectedClient) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: "about",
      label: "About",
      children: <ClientDetails client={selectedClient} />,
    },
    {
      key: "contacts",
      label: `Contacts (${contacts.length})`,
      children: (
        <ContactsTable
          ref={contactsTableRef}
          contacts={contacts}
          clientId={clientId as string}
          loading={contactsPending}
          onContactCreated={handleContactCreated}
        />
      ),
    },
    {
      key: "opportunities",
      label: `Opportunities (${opportunitiesList.length})`,
      children: (
        <OpportunitiesTable
          opportunities={opportunitiesList}
          clientId={clientId as string}
          loading={opportunitiesPending}
        />
      ),
    },
    {
      key: "pricing",
      label: `Pricing Requests (${clientPricingRequests.length})`,
      children: (
        <PricingRequestsTable
          pricingRequests={clientPricingRequests}
          clientId={clientId as string}
          loading={pricingPending}
        />
      ),
    },
    {
      key: "proposals",
      label: `Proposals (${proposalsList.length})`,
      children: (
        <ProposalsTable
          proposals={proposalsList}
          clientId={clientId as string}
          loading={proposalsPending}
        />
      ),
    },
    {
      key: "contracts",
      label: `Contracts (${contractsList.length})`,
      children: (
        <ContractsTable
          contracts={contractsList}
          clientId={clientId as string}
          loading={contractsPending}
        />
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          Back to Clients
        </Button>
        <Title level={3} className={styles.pageTitle}>
          {selectedClient.name}
        </Title>
      </div>
      <Card className={styles.card}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
        />
      </Card>
    </div>
  );
};

export default ClientPage;
