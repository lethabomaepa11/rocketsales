/**
 * Multi-Tenancy Utilities
 * Provides helper functions for managing tenant context and data scoping
 */

import { IUser } from "@/providers/authProvider/context";
import { getTenantId } from "./axiosInstance";

/**
 * Gets the current user's tenant ID from localStorage
 */
export const getCurrentTenantId = (): string | null => {
  return getTenantId();
};

/**
 * Checks if a user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Gets the current authenticated user from localStorage
 */
export const getCurrentUser = (): IUser | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as IUser;
  } catch {
    return null;
  }
};

/**
 * Gets current user's roles
 */
export const getUserRoles = (): string[] => {
  const user = getCurrentUser();
  return user?.roles || [];
};

/**
 * Checks if user has a specific role
 */
export const hasRole = (role: string): boolean => {
  return getUserRoles().includes(role);
};

/**
 * Checks if user is an Admin
 */
export const isAdmin = (): boolean => {
  return hasRole("Admin");
};

/**
 * Checks if user is a SalesManager or Admin
 */
export const isManagerOrAdmin = (): boolean => {
  return hasRole("SalesManager") || hasRole("Admin");
};

/**
 * Checks if user is a BusinessDevelopmentManager or higher
 */
export const isBDMOrHigher = (): boolean => {
  return (
    hasRole("BusinessDevelopmentManager") ||
    hasRole("SalesManager") ||
    hasRole("Admin")
  );
};

/**
 * Gets token expiration date
 */
export const getTokenExpiresAt = (): Date | null => {
  const user = getCurrentUser();
  if (!user?.expiresAt) return null;

  try {
    return new Date(user.expiresAt);
  } catch {
    return null;
  }
};

/**
 * Checks if token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return false;

  return new Date() > expiresAt;
};

/**
 * Gets user's full name
 */
export const getUserFullName = (): string => {
  const user = getCurrentUser();
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`.trim();
};