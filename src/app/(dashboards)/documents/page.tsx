"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useDocumentState,
  useDocumentActions,
} from "@/providers/documentProvider";
import {
  DocumentDto,
  DocumentCategory,
  RelatedToType,
} from "@/providers/documentProvider/types";
import RelatedEntitySelector from "@/components/common/RelatedEntitySelector";
import dayjs from "dayjs";
import { useStyles } from "./style/page.style";

const { Title, Text } = Typography;

const categoryLabels: Record<number, string> = {
  [DocumentCategory.Contract]: "Contract",
  [DocumentCategory.Proposal]: "Proposal",
  [DocumentCategory.Presentation]: "Presentation",
  [DocumentCategory.Quote]: "Quote",
  [DocumentCategory.Report]: "Report",
  [DocumentCategory.Other]: "Other",
};

const relatedToLabels: Record<number, string> = {
  [RelatedToType.Client]: "Client",
  [RelatedToType.Opportunity]: "Opportunity",
  [RelatedToType.Proposal]: "Proposal",
  [RelatedToType.Contract]: "Contract",
  [RelatedToType.Activity]: "Activity",
};

const categoryColors: Record<number, string> = {
  [DocumentCategory.Contract]: "blue",
  [DocumentCategory.Proposal]: "green",
  [DocumentCategory.Presentation]: "purple",
  [DocumentCategory.Quote]: "orange",
  [DocumentCategory.Report]: "cyan",
  [DocumentCategory.Other]: "default",
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const DocumentsPage = () => {
  const { styles } = useStyles();
  const { documents, isPending } = useDocumentState();
  const { fetchDocuments, uploadDocument, downloadDocument, deleteDocument } =
    useDocumentActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<
    DocumentCategory | undefined
  >();
  const [fileList, setFileList] = useState<File | null>(null);
  const [form] = Form.useForm();
  const relatedToType = Form.useWatch("relatedToType", form);

  useEffect(() => {
    fetchDocuments(filterCategory ? { category: filterCategory } : undefined);
  }, [filterCategory]);

  const handleUploadClick = () => {
    form.resetFields();
    setFileList(null);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    fetchDocuments(filterCategory ? { category: filterCategory } : undefined);
  };

  const handleDownload = (record: DocumentDto) => {
    downloadDocument(record.id, record.fileName || "document");
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!fileList) return;
      await uploadDocument({
        file: fileList,
        category: values.category,
        relatedToType: values.relatedToType,
        relatedToId: values.relatedToId,
        description: values.description,
      });
      setIsModalVisible(false);
      fetchDocuments(filterCategory ? { category: filterCategory } : undefined);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Size",
      dataIndex: "fileSize",
      key: "fileSize",
      render: (size: number) => formatFileSize(size),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: DocumentCategory) => (
        <Tag color={categoryColors[cat]}>{categoryLabels[cat] || "N/A"}</Tag>
      ),
    },
    {
      title: "Related To",
      key: "relatedTo",
      render: (_: unknown, record: DocumentDto) =>
        record.relatedToTitle ? (
          <Space direction="vertical" size={0}>
            <span>{record.relatedToTitle}</span>
            <Text type="secondary" className={styles.relatedToMeta}>
              {record.relatedToType
                ? relatedToLabels[record.relatedToType] ||
                  record.relatedToTypeName
                : ""}
            </Text>
          </Space>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Uploaded By",
      dataIndex: "uploadedByName",
      key: "uploadedByName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Uploaded",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: DocumentDto) => (
        <Space>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          />
          <Popconfirm
            title="Delete this document?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <Card>
        <div className={styles.headerRow}>
          <Title level={3}>Documents</Title>
          <Space>
            <Select
              placeholder="Filter by category"
              allowClear
              className={styles.filterSelect}
              onChange={(val) => setFilterCategory(val)}
              options={Object.entries(categoryLabels).map(([k, v]) => ({
                value: Number(k),
                label: v,
              }))}
            />
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUploadClick}
            >
              Upload Document
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={documents}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title="Upload Document"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ disabled: !fileList }}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="File" required>
              <Upload
                beforeUpload={(file) => {
                  setFileList(file);
                  return false;
                }}
                maxCount={1}
                onRemove={() => setFileList(null)}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select
                placeholder="Select category"
                options={Object.entries(categoryLabels).map(([k, v]) => ({
                  value: Number(k),
                  label: v,
                }))}
              />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="relatedToType" label="Related To Type">
              <Select
                allowClear
                onChange={() => form.setFieldValue("relatedToId", undefined)}
                options={[
                  { value: RelatedToType.Client, label: "Client" },
                  { value: RelatedToType.Opportunity, label: "Opportunity" },
                  { value: RelatedToType.Proposal, label: "Proposal" },
                  { value: RelatedToType.Contract, label: "Contract" },
                  { value: RelatedToType.Activity, label: "Activity" },
                ]}
              />
            </Form.Item>
            <Form.Item name="relatedToId" label="Related To">
              <RelatedEntitySelector relatedToType={relatedToType} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default DocumentsPage;
