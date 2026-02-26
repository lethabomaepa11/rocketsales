"use client";

import { useEffect, useState } from "react";
import {
  List,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Typography,
  Tag,
  Popconfirm,
  Space,
  Empty,
  Spin,
} from "antd";
import {
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
import dayjs from "dayjs";

const { Text } = Typography;

const categoryLabels: Record<number, string> = {
  [DocumentCategory.Contract]: "Contract",
  [DocumentCategory.Proposal]: "Proposal",
  [DocumentCategory.Presentation]: "Presentation",
  [DocumentCategory.Quote]: "Quote",
  [DocumentCategory.Report]: "Report",
  [DocumentCategory.Other]: "Other",
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
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

interface EntityDocumentsListProps {
  relatedToType: RelatedToType;
  relatedToId: string;
}

const EntityDocumentsList: React.FC<EntityDocumentsListProps> = ({
  relatedToType,
  relatedToId,
}) => {
  const { documents, isPending } = useDocumentState();
  const { fetchDocuments, uploadDocument, downloadDocument, deleteDocument } =
    useDocumentActions();
  const [isUploading, setIsUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDocuments({ relatedToType, relatedToId });
  }, [relatedToType, relatedToId]);

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      if (!fileToUpload) return;
      await uploadDocument({
        file: fileToUpload,
        category: values.category,
        relatedToType,
        relatedToId,
        description: values.description,
      });
      form.resetFields();
      setFileToUpload(null);
      setIsUploading(false);
      fetchDocuments({ relatedToType, relatedToId });
    } catch {
      /* validation error */
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    fetchDocuments({ relatedToType, relatedToId });
  };

  const handleDownload = (doc: DocumentDto) => {
    downloadDocument(doc.id, doc.fileName || "document");
  };

  if (isPending && documents.length === 0) {
    return (
      <Spin style={{ display: "block", textAlign: "center", padding: 24 }} />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text strong>Documents</Text>
        <Button
          size="small"
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setIsUploading(true)}
        >
          Upload
        </Button>
      </div>

      {isUploading && (
        <Form form={form} layout="vertical" style={{ marginBottom: 16 }}>
          <Form.Item label="File" required>
            <Upload
              beforeUpload={(file) => {
                setFileToUpload(file);
                return false;
              }}
              maxCount={1}
              onRemove={() => setFileToUpload(null)}
            >
              <Button icon={<UploadOutlined />} size="small">
                Select File
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select
              size="small"
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
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={handleUpload}
              disabled={!fileToUpload}
            >
              Upload
            </Button>
            <Button
              size="small"
              onClick={() => {
                setIsUploading(false);
                setFileToUpload(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form>
      )}

      {documents.length === 0 && !isUploading ? (
        <Empty description="No documents yet" />
      ) : (
        <List
          dataSource={documents}
          renderItem={(doc: DocumentDto) => (
            <List.Item
              key={doc.id}
              actions={[
                <Button
                  key="download"
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(doc)}
                />,
                <Popconfirm
                  key="delete"
                  title="Delete?"
                  onConfirm={() => handleDelete(doc.id)}
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <span>{doc.fileName || "Unnamed"}</span>
                    {doc.category && (
                      <Tag color={categoryColors[doc.category]}>
                        {categoryLabels[doc.category]}
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatFileSize(doc.fileSize || 0)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {doc.uploadedByName || ""}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(doc.createdAt).format("MMM D, HH:mm")}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default EntityDocumentsList;
