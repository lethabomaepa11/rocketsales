"use client";

import { useEffect, useRef, useState } from "react";
import { message, Select, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { TenantUserDto, UserRole } from "@/types/user";
import { useStyles } from "./style/UserSelector.style";

interface UserOption {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  isActive: boolean;
}

interface UserSelectorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  role?: UserRole;
  isActive?: boolean;
  pageSize?: number;
  allowClear?: boolean;
  style?: React.CSSProperties;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select user",
  disabled = false,
  role,
  isActive = true,
  pageSize = 100,
  allowClear = true,
  style,
}) => {
  const { styles } = useStyles();
  const instance = getAxiosInstance();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapUserToOption = (user: TenantUserDto): UserOption => ({
    id: user.id,
    name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    roles: user.roles,
    isActive: user.isActive,
  });

  useEffect(() => {
    fetchUsers();
  }, [role, isActive, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!value || users.some((u) => u.id === value)) {
      return;
    }

    fetchUserById(value);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async (search?: string) => {
    setLoading(true);
    try {
      const response = await instance.get("/Users", {
        params: {
          pageNumber: 1,
          pageSize,
          role,
          searchTerm: search || undefined,
          isActive,
        },
      });

      const items = (response.data?.items || []) as TenantUserDto[];
      const mappedUsers = items.map(mapUserToOption);
      setUsers(mappedUsers);
    } catch (error) {
      message.error("Failed to fetch users:");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (userId: string) => {
    try {
      const response = await instance.get(`/Users/${userId}`);
      const mappedUser = mapUserToOption(response.data as TenantUserDto);
      setUsers((prev) => {
        if (prev.some((user) => user.id === mappedUser.id)) {
          return prev;
        }
        return [mappedUser, ...prev];
      });
    } catch {
      // If user is not visible in current tenant or no longer active/available,
      // we silently keep current options list.
    }
  };

  const handleSearch = (nextSearchTerm: string) => {
    setSearchTerm(nextSearchTerm);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchUsers(nextSearchTerm);
    }, 300);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    if (open && !users.length) {
      fetchUsers(searchTerm);
    }
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      allowClear={allowClear}
      style={style}
      loading={loading}
      filterOption={false}
      onSearch={handleSearch}
      onOpenChange={handleDropdownOpenChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      suffixIcon={loading ? <Spin size="small" /> : <UserOutlined />}
    >
      {users.map((user) => (
        <Select.Option key={user.id} value={user.id} title={user.name}>
          <div className={styles.optionContent}>
            <span className={styles.optionName}>{user.name}</span>
            <span className={styles.optionEmail}>{user.email}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default UserSelector;
