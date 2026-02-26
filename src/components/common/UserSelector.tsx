"use client";

import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getCurrentUser } from "@/utils/tenantUtils";

interface UserOption {
  id: string;
  name: string;
  email: string;
}

interface UserSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select user",
  disabled = false,
  style,
}) => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get current user to understand the tenant context
      const currentUser = getCurrentUser();
      if (!currentUser?.tenantId) {
        setLoading(false);
        return;
      }

      // For now, we'll create a mock list of users based on the current user
      // In a real implementation, this would call an API endpoint to get all users in the tenant
      const mockUsers: UserOption[] = [
        {
          id: currentUser.userId,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
        },
        {
          id: "user-2",
          name: "John Doe",
          email: "john@company.com",
        },
        {
          id: "user-3",
          name: "Jane Smith",
          email: "jane@company.com",
        },
        {
          id: "user-4",
          name: "Bob Wilson",
          email: "bob@company.com",
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={style}
      loading={loading}
      filterOption={(input, option) =>
        (option?.title ?? "").toLowerCase().includes(input.toLowerCase())
      }
      notFoundContent={loading ? <Spin size="small" /> : null}
      suffixIcon={loading ? <Spin size="small" /> : <UserOutlined />}
    >
      {users.map((user) => (
        <Select.Option key={user.id} value={user.id} title={user.name}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 500 }}>{user.name}</span>
            <span style={{ fontSize: 12, color: "#666" }}>{user.email}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default UserSelector;
