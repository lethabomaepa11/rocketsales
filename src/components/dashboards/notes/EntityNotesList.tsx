"use client";

import { useEffect, useState } from "react";
import {
  List,
  Button,
  Form,
  Input,
  Switch,
  Typography,
  Tag,
  Popconfirm,
  Space,
  Empty,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNoteState, useNoteActions } from "@/providers/noteProvider";
import { NoteDto, RelatedToType } from "@/providers/noteProvider/types";
import { useStyles } from "./style/EntityNotesList.style";
import dayjs from "dayjs";

const { Text, Paragraph } = Typography;

interface EntityNotesListProps {
  relatedToType: RelatedToType;
  relatedToId: string;
}

const EntityNotesList: React.FC<EntityNotesListProps> = ({
  relatedToType,
  relatedToId,
}) => {
  const { styles } = useStyles();
  const { notes, isPending } = useNoteState();
  const { fetchNotes, createNote, updateNote, deleteNote } = useNoteActions();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchNotes({ relatedToType, relatedToId });
  }, [relatedToType, relatedToId]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await createNote({
        content: values.content,
        relatedToType,
        relatedToId,
        isPrivate: values.isPrivate ?? false,
      });
      form.resetFields();
      setIsAdding(false);
      fetchNotes({ relatedToType, relatedToId });
    } catch {
      /* validation error */
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const values = await editForm.validateFields();
      await updateNote(id, {
        content: values.content,
        isPrivate: values.isPrivate ?? false,
      });
      setEditingId(null);
      fetchNotes({ relatedToType, relatedToId });
    } catch {
      /* validation error */
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    fetchNotes({ relatedToType, relatedToId });
  };

  const startEdit = (note: NoteDto) => {
    setEditingId(note.id);
    editForm.setFieldsValue({
      content: note.content,
      isPrivate: note.isPrivate,
    });
  };

  if (isPending && notes.length === 0) {
    return <Spin className={styles.loadingSpinner} />;
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <Text strong>Notes</Text>
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAdding(true)}
        >
          Add
        </Button>
      </div>

      {isAdding && (
        <Form form={form} layout="vertical" className={styles.addForm}>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.TextArea rows={3} placeholder="Write a note..." />
          </Form.Item>
          <Form.Item
            name="isPrivate"
            valuePropName="checked"
            className={styles.switchFormItem}
          >
            <Switch checkedChildren="Private" unCheckedChildren="Public" />
          </Form.Item>
          <Space>
            <Button size="small" type="primary" onClick={handleAdd}>
              Save
            </Button>
            <Button
              size="small"
              onClick={() => {
                setIsAdding(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Space>
        </Form>
      )}

      {notes.length === 0 && !isAdding ? (
        <Empty description="No notes yet" />
      ) : (
        <List
          dataSource={notes}
          renderItem={(note: NoteDto) => (
            <List.Item
              key={note.id}
              actions={[
                <Button
                  key="edit"
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => startEdit(note)}
                />,
                <Popconfirm
                  key="delete"
                  title="Delete?"
                  onConfirm={() => handleDelete(note.id)}
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
              {editingId === note.id ? (
                <Form
                  form={editForm}
                  layout="vertical"
                  className={styles.editForm}
                >
                  <Form.Item
                    name="content"
                    rules={[{ required: true }]}
                    className={styles.compactFormItem}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  <Form.Item
                    name="isPrivate"
                    valuePropName="checked"
                    className={styles.compactFormItem}
                  >
                    <Switch
                      checkedChildren="Private"
                      unCheckedChildren="Public"
                    />
                  </Form.Item>
                  <Space>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleUpdate(note.id)}
                    >
                      Save
                    </Button>
                    <Button size="small" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Space>
                </Form>
              ) : (
                <List.Item.Meta
                  title={
                    <Space>
                      {note.isPrivate && (
                        <Tag icon={<LockOutlined />} color="orange">
                          Private
                        </Tag>
                      )}
                      <Text type="secondary" className={styles.metaText}>
                        {note.createdByName} ·{" "}
                        {dayjs(note.createdAt).format("MMM D, HH:mm")}
                      </Text>
                    </Space>
                  }
                  description={
                    <Paragraph className={styles.noteParagraph}>
                      {note.content}
                    </Paragraph>
                  }
                />
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default EntityNotesList;
