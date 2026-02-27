"use client";

import { useState } from "react";
import { Modal, Form, Input, Button, Table, Tag, Space, message } from "antd";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ContractDto,
  ContractRenewalDto,
  ContractStatus,
} from "@/providers/contractProvider/types";
import { useContractActions } from "@/providers/contractProvider";
import dayjs from "dayjs";
import { useStyles } from "./style/ContractRenewalModal.style";

interface ContractRenewalModalProps {
  open: boolean;
  contract: ContractDto | null;
  renewals: ContractRenewalDto[];
  onClose: () => void;
  onRefresh: () => void;
}

const renewalStatusColors: Record<number, string> = {
  1: "orange",
  2: "blue",
  3: "green",
  4: "red",
};
const renewalStatusLabels: Record<number, string> = {
  1: "Pending",
  2: "In Progress",
  3: "Completed",
  4: "Cancelled",
};

const ContractRenewalModal = ({
  open,
  contract,
  renewals,
  onClose,
  onRefresh,
}: ContractRenewalModalProps) => {
  const { styles } = useStyles();
  const { createRenewal, completeRenewal } = useContractActions();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form] = Form.useForm();

  const handleCreateRenewal = async () => {
    if (!contract) return;
    const values = await form.validateFields();
    await createRenewal(contract.id, {
      renewalOpportunityId: values.renewalOpportunityId || null,
      notes: values.notes || "",
    });
    form.resetFields();
    setShowCreateForm(false);
    onRefresh();
    message.success("Renewal created");
  };

  const handleCompleteRenewal = async (renewalId: string) => {
    await completeRenewal(renewalId);
    onRefresh();
    message.success("Renewal completed");
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => dayjs(d).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: number) => (
        <Tag color={renewalStatusColors[s] || "default"}>
          {renewalStatusLabels[s] || s}
        </Tag>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ContractRenewalDto) =>
        record.status === 1 || record.status === 2 ? (
          <Button
            type="link"
            icon={<CheckOutlined />}
            onClick={() => handleCompleteRenewal(record.id)}
          >
            Complete
          </Button>
        ) : null,
    },
  ];

  const canCreateRenewal = contract?.status === ContractStatus.Active;

  return (
    <Modal
      title={`Renewals — ${contract?.title || ""}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className={styles.contractMetaRow}>
        <Space>
          <span>
            Contract expires:{" "}
            <strong>
              {contract?.endDate
                ? dayjs(contract.endDate).format("DD MMM YYYY")
                : "N/A"}
            </strong>
          </span>
          {contract?.isExpiringSoon && <Tag color="warning">Expiring Soon</Tag>}
          {contract?.daysUntilExpiry !== undefined && (
            <Tag>{contract.daysUntilExpiry} days remaining</Tag>
          )}
        </Space>
      </div>

      <Table
        dataSource={renewals}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
      />

      {canCreateRenewal && !showCreateForm && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateForm(true)}
          className={styles.createRenewalButton}
        >
          Create Renewal
        </Button>
      )}

      {showCreateForm && (
        <Form
          form={form}
          layout="vertical"
          className={styles.createRenewalForm}
        >
          <Form.Item name="notes" label="Renewal Notes">
            <Input.TextArea rows={2} placeholder="e.g. Annual CPI adjustment" />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={handleCreateRenewal}>
              Save Renewal
            </Button>
            <Button onClick={() => setShowCreateForm(false)}>Cancel</Button>
          </Space>
        </Form>
      )}
    </Modal>
  );
};

export default ContractRenewalModal;
