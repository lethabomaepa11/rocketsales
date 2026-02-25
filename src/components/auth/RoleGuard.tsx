"use client";

import { useAuthState } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, isSuccess } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && user?.roles) {
      const hasRole = user.roles.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        router.push("/dashboard");
      }
    }
  }, [user, isSuccess, allowedRoles, router]);

  if (!isSuccess || !user?.roles) {
    return null;
  }

  const hasRole = user.roles.some((role) => allowedRoles.includes(role));
  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
};

export const isSalesManager = (userRoles?: string[]): boolean => {
  return (
    userRoles?.some((role) => role.toLowerCase().includes("manager")) ?? false
  );
};

export const isSalesRep = (userRoles?: string[]): boolean => {
  return (
    userRoles?.some(
      (role) =>
        role.toLowerCase().includes("rep") ||
        role.toLowerCase().includes("representative"),
    ) ?? false
  );
};
