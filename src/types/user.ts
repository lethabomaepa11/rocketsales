export type UserRole =
  | "Admin"
  | "SalesManager"
  | "BusinessDevelopmentManager"
  | "SalesRep";

export interface TenantUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  isActive: boolean;
  roles: UserRole[];
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UsersPagedResultDto {
  items: TenantUserDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}