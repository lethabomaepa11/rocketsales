import { Modal, Form, Input, Select, Switch } from "antd";
import { ClientDto } from "@/providers/clientProvider/types";
import {
  ContactDto,
  CreateContactDto,
  UpdateContactDto,
} from "@/providers/contactProvider/types";

interface ContactFormProps {
  visible: boolean;
  editingContact: ContactDto | null;
  clients: ClientDto[];
  onCancel: () => void;
  onOk: (values: CreateContactDto | UpdateContactDto) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  visible,
  editingContact,
  clients,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={editingContact ? "Edit Contact" : "Add Contact"}
      open={visible}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          onOk(values);
        } catch (error) {
          console.error("Validation failed:", error);
        }
      }}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical" initialValues={editingContact || {}}>
        <Form.Item name="clientId" label="Client" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="">Select Client</Select.Option>
            {clients.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input type="email" />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Position">
          <Input />
        </Form.Item>
        <Form.Item
          name="isPrimaryContact"
          label="Primary Contact"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactForm;
