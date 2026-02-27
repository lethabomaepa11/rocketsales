"use client";

import { Button, InputNumber, Input, Space, Table } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { CreateProposalLineItemDto } from "@/providers/proposalProvider/types";
import { useStyles } from "./style/ProposalLineItemsForm.style";

interface ProposalLineItemsFormProps {
  lineItems: CreateProposalLineItemDto[];
  onChange: (items: CreateProposalLineItemDto[]) => void;
  disabled?: boolean;
}

const emptyItem: CreateProposalLineItemDto = {
  productServiceName: "",
  description: "",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  taxRate: 15,
};

const calcTotal = (item: CreateProposalLineItemDto) => {
  const base = item.quantity * item.unitPrice * (1 - item.discount / 100);
  return base * (1 + item.taxRate / 100);
};

const ProposalLineItemsForm = ({
  lineItems,
  onChange,
  disabled,
}: ProposalLineItemsFormProps) => {
  const { styles } = useStyles();
  const updateItem = (
    index: number,
    field: keyof CreateProposalLineItemDto,
    value: string | number | null,
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = () => onChange([...lineItems, { ...emptyItem }]);

  const removeItem = (index: number) => {
    const updated = lineItems.filter((_, i) => i !== index);
    onChange(updated);
  };

  const columns = [
    {
      title: "Product / Service",
      dataIndex: "productServiceName",
      key: "productServiceName",
      render: (_: string, __: CreateProposalLineItemDto, idx: number) => (
        <Input
          size="small"
          value={lineItems[idx].productServiceName || ""}
          disabled={disabled}
          onChange={(e) =>
            updateItem(idx, "productServiceName", e.target.value)
          }
          placeholder="Service name"
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      width: 80,
      render: (_: number, __: CreateProposalLineItemDto, idx: number) => (
        <InputNumber
          size="small"
          min={1}
          value={lineItems[idx].quantity}
          disabled={disabled}
          onChange={(v) => updateItem(idx, "quantity", v ?? 1)}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      width: 120,
      render: (_: number, __: CreateProposalLineItemDto, idx: number) => (
        <InputNumber
          size="small"
          min={0}
          precision={2}
          value={lineItems[idx].unitPrice}
          disabled={disabled}
          onChange={(v) => updateItem(idx, "unitPrice", v ?? 0)}
        />
      ),
    },
    {
      title: "Disc %",
      dataIndex: "discount",
      width: 80,
      render: (_: number, __: CreateProposalLineItemDto, idx: number) => (
        <InputNumber
          size="small"
          min={0}
          max={100}
          value={lineItems[idx].discount}
          disabled={disabled}
          onChange={(v) => updateItem(idx, "discount", v ?? 0)}
        />
      ),
    },
    {
      title: "Tax %",
      dataIndex: "taxRate",
      width: 80,
      render: (_: number, __: CreateProposalLineItemDto, idx: number) => (
        <InputNumber
          size="small"
          min={0}
          max={100}
          value={lineItems[idx].taxRate}
          disabled={disabled}
          onChange={(v) => updateItem(idx, "taxRate", v ?? 15)}
        />
      ),
    },
    {
      title: "Total",
      key: "total",
      width: 120,
      render: (_: unknown, __: CreateProposalLineItemDto, idx: number) => (
        <span>R{calcTotal(lineItems[idx]).toFixed(2)}</span>
      ),
    },
    ...(!disabled
      ? [
          {
            title: "",
            key: "action",
            width: 50,
            render: (
              _: unknown,
              __: CreateProposalLineItemDto,
              idx: number,
            ) => (
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeItem(idx)}
              />
            ),
          },
        ]
      : []),
  ];

  const grandTotal = lineItems.reduce((sum, item) => sum + calcTotal(item), 0);

  return (
    <div>
      <Table
        dataSource={lineItems}
        columns={columns}
        rowKey={(_, idx) => String(idx)}
        size="small"
        pagination={false}
      />
      <Space className={styles.summaryRow}>
        {!disabled && (
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={addItem}
          >
            Add Line Item
          </Button>
        )}
        <strong>Grand Total: R{grandTotal.toFixed(2)}</strong>
      </Space>
    </div>
  );
};

export default ProposalLineItemsForm;
