"use client";

import { useAuthState } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";
import { useStyles } from "./style/withAuth.style";
import { logoutUser } from "@/providers/authProvider/actions";

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
    const { user, isLoading } = useAuthState();
    const router = useRouter();
    const { styles } = useStyles();

    // Check token expiry on mount and whenever user changes
    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.push(redirectTo);
          return;
        }

        if (typeof window !== "undefined") {
          if (user?.expiresAt && Date.now() >= Date.parse(user.expiresAt)) {
            logoutUser();
            router.push(redirectTo);
            return;
          }
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
    }, [isLoading, user, router]);

    // Continuously check token expiry every 60 seconds while page is open
    useEffect(() => {
      if (!user?.expiresAt) return;

      const interval = setInterval(() => {
        if (Date.now() >= Date.parse(user.expiresAt)) {
          logoutUser();
          router.push(redirectTo);
        }
      }, 60_000);

      return () => clearInterval(interval);
    }, [user, router]);

    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className={styles.loadingContainer}>
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

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

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
