"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Modal,
  Upload,
  Typography,
  Divider,
  message,
} from "antd";
import { UploadOutlined, CalendarOutlined } from "@ant-design/icons";
import { useActivityActions } from "@/providers/activityProvider";
import {
  ActivityType,
  Priority,
  RelatedToType,
  CreateActivityDto,
} from "@/providers/activityProvider/types";
import { useAuthState } from "@/providers/authProvider";
import { useClientState } from "@/providers/clientProvider";
import { useOpportunityState } from "@/providers/opportunityProvider";
import { useProposalState } from "@/providers/proposalProvider";
import { useContractState } from "@/providers/contractProvider";
import { useDocumentActions } from "@/providers/documentProvider";
import { ContractDto } from "@/providers/contractProvider/types";
import { DocumentCategory } from "@/providers/documentProvider/types";
import { useStyles } from "./style/ActivityForm.style";
import { AIGenerateButton } from "@/components/common/AIGenerateButton";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Text } = Typography;

interface ActivityFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  prefillRelatedToType?: RelatedToType;
  prefillRelatedToId?: string;
  prefillRelatedToTitle?: string;
}

const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.Meeting]: "Meeting",
  [ActivityType.Call]: "Call",
  [ActivityType.Email]: "Email",
  [ActivityType.Task]: "Task",
  [ActivityType.Presentation]: "Presentation",
  [ActivityType.Other]: "Other",
};

const priorityLabels: Record<Priority, string> = {
  [Priority.Low]: "Low",
  [Priority.Medium]: "Medium",
  [Priority.High]: "High",
  [Priority.Urgent]: "Urgent",
};

const relatedToTypeLabels: Record<number, string> = {
  [RelatedToType.Client]: "Client",
  [RelatedToType.Opportunity]: "Opportunity",
  [RelatedToType.Proposal]: "Proposal",
  [RelatedToType.Contract]: "Contract",
  [RelatedToType.PricingRequest]: "Pricing Request",
};

// Helper to get contracts array from different response formats
const getContractsArray = (contracts: unknown): ContractDto[] => {
  if (Array.isArray(contracts)) return contracts as ContractDto[];
  if (contracts && typeof contracts === "object") {
    const resp = contracts as { items?: ContractDto[] };
    return resp.items || [];
  }
  return [];
};

const ActivityForm: React.FC<ActivityFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  prefillRelatedToType,
  prefillRelatedToId,
  prefillRelatedToTitle,
}) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const { user } = useAuthState();
  const { createActivity, fetchActivities } = useActivityActions();

  const { clients } = useClientState();
  const { opportunities } = useOpportunityState();
  const { proposals } = useProposalState();
  const { contracts: contractsData } = useContractState();

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contracts = getContractsArray(contractsData);

  // Set default values when modal opens
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        type: ActivityType.Meeting,
        priority: Priority.Medium,
        assignedToId: user?.userId,
        relatedToType: prefillRelatedToType,
        relatedToId: prefillRelatedToId,
        relatedToTitle: prefillRelatedToTitle,
        dueDate: dayjs(),
      });
      setAttachedFiles([]);
    }
  }, [
    visible,
    prefillRelatedToType,
    prefillRelatedToId,
    prefillRelatedToTitle,
    user,
    form,
  ]);

  const handleRelatedToTypeChange = (type: RelatedToType) => {
    form.setFieldsValue({ relatedToId: undefined, relatedToTitle: undefined });
  };

  const handleRelatedToIdChange = (id: string, type: RelatedToType) => {
    let title = "";
    switch (type) {
      case RelatedToType.Client: {
        const client = clients.find((c) => c.id === id);
        title = client?.name || "";
        break;
      }
      case RelatedToType.Opportunity: {
        const opp = opportunities.find((o) => o.id === id);
        title = opp?.title || "";
        break;
      }
      case RelatedToType.Proposal: {
        const proposal = proposals.find((p) => p.id === id);
        title = proposal?.title || "";
        break;
      }
      case RelatedToType.Contract: {
        const contract = contracts.find((c) => c.id === id);
        title = contract?.title || "";
        break;
      }
      default:
        break;
    }
    form.setFieldsValue({ relatedToTitle: title });
  };

  const handleFileChange = (info: unknown) => {
    const fileInfo = info as { fileList?: Array<{ originFileObj?: File }> };
    const files = fileInfo.fileList
      ?.map((f) => f.originFileObj)
      .filter(Boolean) as File[] | undefined;
    if (files) setAttachedFiles(files);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const activityData: CreateActivityDto = {
        type: values.type,
        subject: values.subject,
        description: values.description,
        relatedToType: values.relatedToType,
        relatedToId: values.relatedToId,
        assignedToId: values.assignedToId || user?.userId || "",
        priority: values.priority,
        dueDate: values.dueDate?.toISOString() || null,
        duration: values.duration || null,
        location: values.location || null,
      };

      // Create the activity
      await createActivity(activityData);

      // Note: Document upload would need activity ID from response
      // For now, users can add documents separately through entity details

      form.resetFields();
      setAttachedFiles([]);
      onCancel();

      // Refresh activities
      fetchActivities();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error("Failed to create activity:");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRelatedEntityOptions = (type: RelatedToType) => {
    switch (type) {
      case RelatedToType.Client:
        return clients.map((c) => ({ value: c.id, label: c.name }));
      case RelatedToType.Opportunity:
        return opportunities.map((o) => ({ value: o.id, label: o.title }));
      case RelatedToType.Proposal:
        return proposals.map((p) => ({ value: p.id, label: p.title }));
      case RelatedToType.Contract:
        return contracts.map((c) => ({
          value: c.id,
          label: c.title || c.contractNumber || c.id,
        }));
      default:
        return [];
    }
  };

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          <span>Schedule Activity</span>
        </Space>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      confirmLoading={isSubmitting}
      okText="Create Activity"
    >
      <Form form={form} layout="vertical" className={styles.form}>
        <Form.Item
          name="type"
          label="Activity Type"
          rules={[{ required: true, message: "Please select activity type" }]}
        >
          <Select placeholder="Select type">
            {Object.entries(activityTypeLabels).map(([key, label]) => (
              <Select.Option key={key} value={Number(key)}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please enter subject" }]}
        >
          <Input placeholder="Enter subject" />
        </Form.Item>

        <div style={{ marginTop: -16, marginBottom: 16 }}>
          <AIGenerateButton
            fieldType="description"
            onGenerate={(text) => form.setFieldValue("description", text)}
            context={form.getFieldValue("subject") || "Activity"}
          />
        </div>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Space size="large" style={{ width: "100%" }}>
          <Form.Item name="priority" label="Priority" style={{ flex: 1 }}>
            <Select placeholder="Select priority">
              {Object.entries(priorityLabels).map(([key, label]) => (
                <Select.Option key={key} value={Number(key)}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date" style={{ flex: 1 }}>
            <DatePicker
              showTime
              className={styles.fullWidth}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
        </Space>

        <Space size="large" style={{ width: "100%" }}>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              className={styles.fullWidth}
              placeholder="e.g. 60"
            />
          </Form.Item>

          <Form.Item name="location" label="Location" style={{ flex: 1 }}>
            <Input placeholder="Enter location" />
          </Form.Item>
        </Space>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Link to Entity
          </Text>
        </Divider>

        <Space size="large" style={{ width: "100%" }}>
          <Form.Item
            name="relatedToType"
            label="Related To"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Select entity type" }]}
          >
            <Select
              placeholder="Select type"
              onChange={handleRelatedToTypeChange}
            >
              {Object.entries(relatedToTypeLabels).map(([key, label]) => (
                <Select.Option key={key} value={Number(key)}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev.relatedToType !== curr.relatedToType
            }
          >
            {() => {
              const relatedToType = form.getFieldValue("relatedToType");
              if (!relatedToType) return null;

              return (
                <Form.Item
                  name="relatedToId"
                  label="Select Entity"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Select entity" }]}
                >
                  <Select
                    placeholder="Select"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={(value) =>
                      handleRelatedToIdChange(value, relatedToType)
                    }
                    options={getRelatedEntityOptions(relatedToType)}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Space>

        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Attach Documents
          </Text>
        </Divider>

        <Form.Item>
          <Upload
            beforeUpload={(file) => {
              setAttachedFiles((prev) => [...prev, file]);
              return false;
            }}
            fileList={attachedFiles.map((file, index) => ({
              uid: String(index),
              name: file.name,
              size: file.size,
              type: file.type,
            }))}
            onChange={handleFileChange}
            onRemove={(file) => {
              const index = attachedFiles.findIndex(
                (f) => f.name === file.name,
              );
              const newFiles = [...attachedFiles];
              newFiles.splice(index, 1);
              setAttachedFiles(newFiles);
            }}
            multiple
          >
            <Button icon={<UploadOutlined />}>Attach Files</Button>
          </Upload>
          {attachedFiles.length > 0 && (
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              {attachedFiles.length} file(s) will be attached after creation
            </Text>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ActivityForm;
