"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Modal,
  message,
} from "antd";
import { useOpportunityActions } from "@/providers/opportunityProvider";
import {
  OpportunityStage,
  OpportunitySource,
  OpportunityDto,
} from "@/providers/opportunityProvider/types";
import dayjs from "dayjs";
import { ClientDto } from "@/providers/clientProvider/types";
import { ContactDto } from "@/providers/contactProvider/types";
import { useStyles } from "./style/OpportunityForm.style";
import { AIGenerateButton } from "@/components/common/AIGenerateButton";
import { dealSimilarityEngine } from "@/utils/dealSimilarityEngine";
import { DealSimilarityResult } from "@/utils/dealSimilarityEngine";
import { useOpportunityState } from "@/providers/opportunityProvider";
import { Tag, Alert, Collapse, Progress, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

interface OpportunityFormProps {
  visible: boolean;
  onCancel: () => void;
  initialValues?: OpportunityDto;
  prefillValues?: Partial<OpportunityDto>;
  clients: ClientDto[];
  contacts: ContactDto[];
  loading?: boolean;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  visible,
  onCancel,
  initialValues,
  prefillValues,
  clients,
  contacts,
  loading = false,
}) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const selectedClientId = Form.useWatch("clientId", form);
  const filteredContacts = useMemo(() => {
    if (selectedClientId) {
      return contacts.filter((c) => c.clientId === selectedClientId);
    }
    return contacts;
  }, [selectedClientId, contacts]);
  const [similarDeals, setSimilarDeals] = useState<DealSimilarityResult[]>([]);
  const showSimilarDeals = similarDeals.length > 0;

  const { createOpportunity, updateOpportunity, fetchOpportunities } =
    useOpportunityActions();
  const { opportunities } = useOpportunityState();

  const formInitialValues = prefillValues || initialValues;

  useEffect(() => {
    if (formInitialValues) {
      form.setFieldsValue({
        ...formInitialValues,
        expectedCloseDate: formInitialValues.expectedCloseDate
          ? dayjs(formInitialValues.expectedCloseDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [formInitialValues, contacts, form]);

  const runSimilarityCheck = useCallback(() => {
    if (initialValues) return; // only for new opportunities
    const values = form.getFieldsValue();
    if (!values.clientId && !values.estimatedValue) return;

    const selectedClient = clients.find((c) => c.id === values.clientId);
    const selectedContact = contacts.find((c) => c.id === values.contactId);

    const dto = {
      title: values.title ?? null,
      clientId: values.clientId ?? "",
      clientName: selectedClient?.name ?? null,
      contactId: values.contactId ?? null,
      contactName: selectedContact?.fullName ?? null,
      estimatedValue: values.estimatedValue ?? 0,
      currency: values.currency ?? null,
      probability: values.probability ?? 0,
      source: values.source ?? OpportunitySource.Other,
      expectedCloseDate: values.expectedCloseDate?.toISOString() ?? null,
      description: values.description ?? null,
    };

    const results = dealSimilarityEngine.findSimilarDeals(dto, opportunities);
    setSimilarDeals(results);
  }, [form, clients, contacts, opportunities, initialValues]);

  const handleClientChange = useCallback(() => {
    form.setFieldsValue({ contactId: undefined });
    runSimilarityCheck();
  }, [form, runSimilarityCheck]);

  const handleCancel = useCallback(() => {
    setSimilarDeals([]);
    onCancel();
  }, [onCancel]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        expectedCloseDate: values.expectedCloseDate?.toISOString(),
      };
      if (initialValues) {
        await updateOpportunity(initialValues.id, data);
      } else {
        await createOpportunity(data);
      }
      fetchOpportunities();
      setSimilarDeals([]);
    } catch (error) {
      message.error("Failed to save opportunity");
    }

    onCancel();
  };

  const stageLabels: Record<OpportunityStage, string> = {
    [OpportunityStage.Lead]: "Lead",
    [OpportunityStage.Qualified]: "Qualified",
    [OpportunityStage.Proposal]: "Proposal",
    [OpportunityStage.Negotiation]: "Negotiation",
    [OpportunityStage.ClosedWon]: "Closed Won",
    [OpportunityStage.ClosedLost]: "Closed Lost",
  };

  const formatCurrency = (value: number, currency: string | null) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency || "ZAR",
      minimumFractionDigits: 0,
    }).format(value);

  const renderSimilarDeals = () => {
    if (!showSimilarDeals || similarDeals.length === 0) return null;

    return (
      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message={
          <span style={{ fontWeight: 600 }}>
            {similarDeals.length} similar deal
            {similarDeals.length > 1 ? "s" : ""} found in your history
          </span>
        }
        description={
          <Collapse
            ghost
            size="small"
            items={similarDeals.map((deal) => ({
              key: deal.opportunityId,
              label: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {deal.stage === OpportunityStage.ClosedWon ? (
                    <TrophyOutlined style={{ color: "#52c41a" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                  )}
                  <span style={{ fontWeight: 500 }}>
                    {deal.dealTitle ?? "Untitled Deal"}
                  </span>
                  <Tag color="blue">{deal.clientName}</Tag>
                  <Tag>
                    {formatCurrency(deal.estimatedValue, deal.currency)}
                  </Tag>
                  <Tooltip title="Similarity score">
                    <Progress
                      type="circle"
                      size={28}
                      percent={deal.similarityScore}
                      strokeColor={
                        deal.similarityScore >= 70
                          ? "#52c41a"
                          : deal.similarityScore >= 40
                            ? "#faad14"
                            : "#ff4d4f"
                      }
                      format={(p) => <span style={{ fontSize: 8 }}>{p}%</span>}
                    />
                  </Tooltip>
                  {deal.daysToClose !== null && (
                    <Tag color="purple">{deal.daysToClose}d to close</Tag>
                  )}
                </div>
              ),
              children: (
                <div style={{ paddingLeft: 8 }}>
                  {deal.successFactors.length > 0 && (
                    <div style={{ marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#52c41a",
                        }}
                      >
                        Success factors
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          flexWrap: "wrap",
                          marginTop: 4,
                        }}
                      >
                        {deal.successFactors.map((f) => (
                          <Tag
                            key={f}
                            icon={<CheckCircleOutlined />}
                            color="success"
                            style={{ fontSize: 11 }}
                          >
                            {f}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.riskFactors.length > 0 && (
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#ff4d4f",
                        }}
                      >
                        Risk factors
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          flexWrap: "wrap",
                          marginTop: 4,
                        }}
                      >
                        {deal.riskFactors.map((f) => (
                          <Tag
                            key={f}
                            icon={<WarningOutlined />}
                            color="error"
                            style={{ fontSize: 11 }}
                          >
                            {f}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        }
      />
    );
  };

  return (
    <Modal
      title={initialValues ? "Edit Opportunity" : "Add Opportunity"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={640}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={formInitialValues}>
        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: "Please select a client" }]}
        >
          <Select
            placeholder="Select a client"
            onChange={handleClientChange}
            showSearch
            filterOption={(input, option) =>
              String(option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {clients.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="contactId" label="Contact">
          <Select
            placeholder="Select a contact"
            allowClear
            showSearch
            filterOption={(input, option) =>
              String(option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {filteredContacts.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input
            placeholder="Enter opportunity title"
            onBlur={runSimilarityCheck}
          />
        </Form.Item>

        <Form.Item name="estimatedValue" label="Value">
          <InputNumber
            className={styles.fullWidthField}
            placeholder="Enter estimated value"
            min={0}
            onBlur={runSimilarityCheck}
          />
        </Form.Item>

        <Form.Item name="currency" label="Currency">
          <Input placeholder="ZAR" />
        </Form.Item>

        <Form.Item name="probability" label="Probability (%)">
          <InputNumber
            min={0}
            max={100}
            className={styles.fullWidthField}
            placeholder="Enter probability"
          />
        </Form.Item>

        <Form.Item
          name="stage"
          label="Stage"
          rules={[{ required: true, message: "Please select a stage" }]}
        >
          <Select placeholder="Select stage">
            {Object.entries(stageLabels).map(([key, label]) => (
              <Option key={key} value={Number(key)}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="source" label="Source">
          <Select placeholder="Select source" onChange={runSimilarityCheck}>
            {Object.values(OpportunitySource)
              .filter((s) => typeof s === "number")
              .map((s) => (
                <Option key={s} value={s}>
                  {OpportunitySource[s]}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="expectedCloseDate" label="Expected Close Date">
          <DatePicker
            className={styles.fullWidthField}
            onChange={runSimilarityCheck}
          />
        </Form.Item>

        {renderSimilarDeals()}

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <div style={{ marginTop: -16, marginBottom: 24 }}>
          <AIGenerateButton
            fieldType="description"
            onGenerate={(text) => form.setFieldValue("description", text)}
            context={
              formInitialValues?.title
                ? `Opportunity: ${formInitialValues.title}`
                : undefined
            }
          />
        </div>
      </Form>
    </Modal>
  );
};

export default OpportunityForm;
