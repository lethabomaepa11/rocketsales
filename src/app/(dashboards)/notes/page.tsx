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
  Tag,
  Typography,
  Popconfirm,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNoteState, useNoteActions } from "@/providers/noteProvider";
import {
  NoteDto,
  CreateNoteDto,
  RelatedToType,
} from "@/providers/noteProvider/types";
import RelatedEntitySelector from "@/components/common/RelatedEntitySelector";
import dayjs from "dayjs";
import { useStyles } from "./style/page.style";

const { Title, Text, Paragraph } = Typography;

const relatedToLabels: Record<number, string> = {
  [RelatedToType.Client]: "Client",
  [RelatedToType.Opportunity]: "Opportunity",
  [RelatedToType.Proposal]: "Proposal",
  [RelatedToType.Contract]: "Contract",
  [RelatedToType.Activity]: "Activity",
};

const NotesPage = () => {
  const { styles } = useStyles();
  const { notes, isPending } = useNoteState();
  const { fetchNotes, createNote, updateNote, deleteNote } = useNoteActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteDto | null>(null);
  const [filterType, setFilterType] = useState<RelatedToType | undefined>();
  const [form] = Form.useForm();
  const relatedToType = Form.useWatch("relatedToType", form);

  useEffect(() => {
    fetchNotes(filterType ? { relatedToType: filterType } : undefined);
  }, [filterType]);

  const handleAdd = () => {
    setEditingNote(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (note: NoteDto) => {
    setEditingNote(note);
    form.setFieldsValue({
      content: note.content,
      isPrivate: note.isPrivate,
      relatedToType: note.relatedToType,
      relatedToId: note.relatedToId,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    fetchNotes(filterType ? { relatedToType: filterType } : undefined);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingNote) {
        await updateNote(editingNote.id, {
          content: values.content,
          isPrivate: values.isPrivate ?? false,
        });
      } else {
        await createNote(values as CreateNoteDto);
      }
      setIsModalVisible(false);
      fetchNotes(filterType ? { relatedToType: filterType } : undefined);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      width: "35%",
      render: (text: string) => (
        <Paragraph ellipsis={{ rows: 2 }} className={styles.noteContent}>
          {text || "N/A"}
        </Paragraph>
      ),
    },
    {
      title: "Related To",
      key: "relatedTo",
      render: (_: unknown, record: NoteDto) =>
        record.relatedToTitle ? (
          <Space direction="vertical" size={0}>
            <span>{record.relatedToTitle}</span>
            <Text type="secondary" className={styles.relatedMetaText}>
              {relatedToLabels[record.relatedToType] ||
                record.relatedToTypeName}
            </Text>
          </Space>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Private",
      dataIndex: "isPrivate",
      key: "isPrivate",
      render: (isPrivate: boolean) =>
        isPrivate ? (
          <Tag icon={<LockOutlined />} color="orange">
            Private
          </Tag>
        ) : (
          <Tag color="blue">Public</Tag>
        ),
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: NoteDto) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this note?"
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
          <Title level={3}>Notes</Title>
          <Space>
            <Select
              placeholder="Filter by entity type"
              allowClear
              className={styles.filterSelect}
              onChange={(val) => setFilterType(val)}
              options={[
                { value: RelatedToType.Client, label: "Client" },
                { value: RelatedToType.Opportunity, label: "Opportunity" },
                { value: RelatedToType.Proposal, label: "Proposal" },
                { value: RelatedToType.Contract, label: "Contract" },
                { value: RelatedToType.Activity, label: "Activity" },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Note
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={notes}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editingNote ? "Edit Note" : "Add Note"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: "Please enter note content" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="isPrivate" label="Private" valuePropName="checked">
              <Switch />
            </Form.Item>
            {!editingNote && (
              <>
                <Form.Item
                  name="relatedToType"
                  label="Related To Type"
                  rules={[{ required: true }]}
                >
                  <Select
                    onChange={() =>
                      form.setFieldValue("relatedToId", undefined)
                    }
                    options={[
                      { value: RelatedToType.Client, label: "Client" },
                      {
                        value: RelatedToType.Opportunity,
                        label: "Opportunity",
                      },
                      { value: RelatedToType.Proposal, label: "Proposal" },
                      { value: RelatedToType.Contract, label: "Contract" },
                      { value: RelatedToType.Activity, label: "Activity" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="relatedToId"
                  label="Related To"
                  rules={[{ required: true }]}
                >
                  <RelatedEntitySelector relatedToType={relatedToType} />
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default NotesPage;
