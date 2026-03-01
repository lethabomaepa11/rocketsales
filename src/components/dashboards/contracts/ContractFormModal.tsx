"use client";

import {
  Form,
  Modal,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
} from "antd";
import {
  ContractDto,
  CreateContractDto,
  UpdateContractDto,
} from "@/providers/contractProvider/types";
import { ClientDto } from "@/providers/clientProvider/types";
import { OpportunityDto } from "@/providers/opportunityProvider/types";
import dayjs from "dayjs";
import { useStyles } from "./style/ContractFormModal.style";
import { AIGenerateButton } from "@/components/common/AIGenerateButton";

interface ContractFormModalProps {
  open: boolean;
  editingContract: ContractDto | null;
  clients: ClientDto[];
  opportunities: OpportunityDto[];
  ownerId: string;
  prefillValues?: {
    opportunityId?: string;
    clientId?: string;
    title?: string;
    contractValue?: number;
    currency?: string;
  };
  onSubmit: (
    data: CreateContractDto | UpdateContractDto,
    isEdit: boolean,
  ) => void;
  onCancel: () => void;
}

const ContractFormModal = ({
  open,
  editingContract,
  clients,
  opportunities,
  ownerId,
  prefillValues,
  onSubmit,
  onCancel,
}: ContractFormModalProps) => {
  const { styles } = useStyles();
  const [form] = Form.useForm();

  const handleOpen = () => {
    if (editingContract) {
      form.setFieldsValue({
        ...editingContract,
        startDate: editingContract.startDate
          ? dayjs(editingContract.startDate)
          : null,
        endDate: editingContract.endDate
          ? dayjs(editingContract.endDate)
          : null,
      });
    } else if (prefillValues) {
      // Set pre-fill values when creating from opportunity
      form.setFieldsValue(prefillValues);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    // Get clientId from opportunity when creating new contract
    let clientId = values.clientId;
    if (!editingContract && values.opportunityId) {
      const selectedOpp = opportunities.find(
        (o) => o.id === values.opportunityId,
      );
      if (selectedOpp?.clientId) {
        clientId = selectedOpp.clientId;
      }
    }

    const payload = {
      clientId,
      opportunityId: values.opportunityId ?? null,
      proposalId: values.proposalId ?? null,
      title: values.title ?? null,
      contractValue: Number(values.contractValue ?? 0),
      currency: values.currency ?? "ZAR",
      startDate: values.startDate?.toISOString() ?? new Date().toISOString(),
      endDate: values.endDate?.toISOString() ?? new Date().toISOString(),
      renewalNoticePeriod: Number(values.renewalNoticePeriod ?? 90),
      autoRenew: Boolean(values.autoRenew ?? false),
      terms: values.terms ?? null,
      ownerId,
    };
    onSubmit(payload as CreateContractDto, !!editingContract);
  };

  // Only show client field when editing an existing contract
  const showClientField = !!editingContract;

  return (
    <Modal
      title={editingContract ? "Edit Contract" : "Create Contract"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      afterOpenChange={(visible) => visible && handleOpen()}
      width={600}
    >
      <Form form={form} layout="vertical">
        {showClientField && (
          <Form.Item
            name="clientId"
            label="Client"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a client"
              showSearch
              optionFilterProp="children"
            >
              {clients.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="opportunityId" label="Opportunity">
          <Select
            placeholder="Select opportunity"
            allowClear
            showSearch
            optionFilterProp="children"
            onChange={(value) => {
              if (value) {
                const selectedOpp = opportunities.find((o) => o.id === value);
                if (selectedOpp?.clientId) {
                  form.setFieldValue("clientId", selectedOpp.clientId);
                }
              }
            }}
          >
            {opportunities.map((o) => (
              <Select.Option key={o.id} value={o.id}>
                {o.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="contractValue" label="Value (ZAR)">
          <InputNumber
            className={styles.fullWidthField}
            min={0}
            precision={2}
          />
        </Form.Item>
        <Form.Item name="currency" label="Currency" initialValue="ZAR">
          <Select>
            <Select.Option value="ZAR">ZAR</Select.Option>
            <Select.Option value="USD">USD</Select.Option>
            <Select.Option value="EUR">EUR</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="startDate" label="Start Date">
          <DatePicker className={styles.fullWidthField} />
        </Form.Item>
        <Form.Item name="endDate" label="End Date">
          <DatePicker className={styles.fullWidthField} />
        </Form.Item>
        <Form.Item
          name="renewalNoticePeriod"
          label="Renewal Notice (days)"
          initialValue={90}
        >
          <InputNumber className={styles.fullWidthField} min={0} />
        </Form.Item>
        <Form.Item name="autoRenew" label="Auto Renew" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="terms" label="Terms">
          <Input.TextArea rows={3} />
        </Form.Item>
        <div style={{ marginTop: -16, marginBottom: 24 }}>
          <AIGenerateButton
            fieldType="terms"
            onGenerate={(text) => form.setFieldValue("terms", text)}
            context={
              prefillValues?.title
                ? `Contract: ${prefillValues.title}`
                : undefined
            }
          />
        </div>
      </Form>
    </Modal>
  );
};

export default ContractFormModal;
