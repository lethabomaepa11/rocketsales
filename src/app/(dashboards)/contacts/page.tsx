"use client";

import { useEffect, useState } from "react";
import { Card } from "antd";
import {
  useContactState,
  useContactActions,
} from "@/providers/contactProvider";
import { useClientState } from "@/providers/clientProvider";
import {
  ContactDto,
  CreateContactDto,
  UpdateContactDto,
} from "@/providers/contactProvider/types";
import ClientListView from "@/components/dashboards/contacts/ClientListView";
import ContactListView from "@/components/dashboards/contacts/ContactListView";
import ContactForm from "@/components/dashboards/contacts/ContactForm";

const ContactsPage = () => {
  const { contacts, isPending, pagination } = useContactState();
  const {
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
  } = useContactActions();
  const { clients } = useClientState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactDto | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [viewingContacts, setViewingContacts] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState<string>("");

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchContacts({ clientId: selectedClientId });
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId);
      if (client) {
        setSelectedClientName(client.name || "");
      }
    }
  }, [selectedClientId, clients]);

  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalVisible(true);
  };

  const handleEditContact = (contact: ContactDto) => {
    setEditingContact(contact);
    setIsModalVisible(true);
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
    fetchContacts({ clientId: selectedClientId });
  };

  const handleSetPrimary = async (id: string, clientId: string) => {
    await setPrimaryContact(id, clientId);
    fetchContacts({ clientId });
  };

  const handleModalOk = async (values: any) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, values as UpdateContactDto);
      } else {
        await createContact(values as CreateContactDto);
      }
      setIsModalVisible(false);
      fetchContacts({ clientId: selectedClientId });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setViewingContacts(true);
  };

  const handleBackToClients = () => {
    setSelectedClientId("");
    setViewingContacts(false);
    setSelectedClientName("");
    fetchContacts();
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchContacts({
      pageNumber: page,
      pageSize,
      clientId: selectedClientId,
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        {viewingContacts ? (
          <ContactListView
            contacts={contacts}
            isPending={isPending}
            selectedClientName={selectedClientName}
            onBackToClients={handleBackToClients}
            onAddContact={handleAddContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onSetPrimary={handleSetPrimary}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        ) : (
          <ClientListView
            clients={clients}
            onAddContact={handleAddContact}
            onViewContacts={handleClientSelect}
          />
        )}
        <ContactForm
          visible={isModalVisible}
          editingContact={editingContact}
          clients={clients}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleModalOk}
        />
      </Card>
    </div>
  );
};

export default ContactsPage;
