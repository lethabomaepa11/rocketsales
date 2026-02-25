"use client";

import { useAuthState } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";

interface WithAuthOptions {
  allowedRoles?: string[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {},
) {
  const { allowedRoles, redirectTo = "/login" } = options;

  const WithAuthComponent: React.FC<P> = (props) => {
    const { user, isSuccess } = useAuthState();
    const router = useRouter();

    useEffect(() => {
      if (isSuccess) {
        if (!user) {
          router.push(redirectTo);
          return;
        }

        if (allowedRoles && allowedRoles.length > 0) {
          const hasRole = user.roles?.some((role) =>
            allowedRoles.includes(role),
          );
          if (!hasRole) {
            router.push("/dashboard");
          }
        }
      }
    }, [isSuccess, user, allowedRoles, redirectTo, router]);

    if (!isSuccess || !user) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = user.roles?.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return WithAuthComponent;
}

export function withManagerAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return withAuth(WrappedComponent, {
    allowedRoles: ["Manager", "SalesManager", "Admin"],
    redirectTo: "/login",
  });
}

export function withSalesRepAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return withAuth(WrappedComponent, {
    allowedRoles: ["SalesRep", "SalesRepresentative", "Manager", "Admin"],
    redirectTo: "/login",
  });
}
