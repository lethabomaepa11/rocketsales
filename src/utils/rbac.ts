import { UserRole } from "@/types/user";

export const ROLE_PRIORITY: Record<UserRole, number> = {
  SalesRep: 1,
  BusinessDevelopmentManager: 2,
  SalesManager: 3,
  Admin: 4,
};

const ROLE_ALIASES: Record<string, UserRole> = {
  admin: "Admin",
  salesmanager: "SalesManager",
  manager: "SalesManager",
  businessdevelopmentmanager: "BusinessDevelopmentManager",
  bdm: "BusinessDevelopmentManager",
  salesrep: "SalesRep",
  salesrepresentative: "SalesRep",
};

const SALES_REP_ALLOWED_ROUTES = [
  "/dashboard",
  "/opportunities",
  "/pricing-requests",
  "/activities",
] as const;

const BDM_ALLOWED_ROUTES = [
  "/dashboard",
  "/opportunities",
  "/pricing-requests",
  "/proposals",
  "/contracts",
  "/activities",
] as const;

export const DASHBOARD_ROUTES_BY_ROLE: Record<UserRole, readonly string[]> = {
  Admin: ["*"],
  SalesManager: ["*"],
  BusinessDevelopmentManager: BDM_ALLOWED_ROUTES,
  SalesRep: SALES_REP_ALLOWED_ROUTES,
};

export const normalizeRole = (
  role?: string | null,
): UserRole | undefined => {
  if (!role) return undefined;
  const normalized = ROLE_ALIASES[role.replace(/[^a-zA-Z]/g, "").toLowerCase()];
  return normalized;
};

export const normalizeRoles = (roles?: string[]): UserRole[] => {
  if (!roles?.length) {
    return [];
  }

  const unique = new Set<UserRole>();
  roles.forEach((role) => {
    const normalized = normalizeRole(role);
    if (normalized) unique.add(normalized);
  });

  return Array.from(unique);
};

export const hasAnyRole = (
  roles: string[] | undefined,
  requiredRoles: UserRole[],
): boolean => {
  const normalizedRoles = normalizeRoles(roles);
  return requiredRoles.some((role) => normalizedRoles.includes(role));
};

export const hasRole = (roles: string[] | undefined, role: UserRole): boolean =>
  hasAnyRole(roles, [role]);

export const isSalesRepRole = (roles?: string[]): boolean =>
  hasRole(roles, "SalesRep");

export const isManagerOrAdminRole = (roles?: string[]): boolean =>
  hasAnyRole(roles, ["SalesManager", "Admin"]);

export const isBDMOrHigherRole = (roles?: string[]): boolean =>
  hasAnyRole(roles, ["BusinessDevelopmentManager", "SalesManager", "Admin"]);

export const canAssignRecords = (roles?: string[]): boolean =>
  isManagerOrAdminRole(roles);

export const canApproveOrRejectProposals = (roles?: string[]): boolean =>
  isManagerOrAdminRole(roles);

export const canDeleteRecords = (roles?: string[]): boolean =>
  isManagerOrAdminRole(roles);

export const canManageOpportunities = (roles?: string[]): boolean =>
  isBDMOrHigherRole(roles);

export const canManagePricingRequests = (roles?: string[]): boolean =>
  isBDMOrHigherRole(roles);

export const canManageActivities = (roles?: string[]): boolean =>
  isBDMOrHigherRole(roles);

export const canManageProposals = (roles?: string[]): boolean =>
  isBDMOrHigherRole(roles);

export const canManageContracts = (roles?: string[]): boolean =>
  isBDMOrHigherRole(roles);

export const canCreateActivities = (roles?: string[]): boolean =>
  hasAnyRole(roles, [
    "SalesRep",
    "BusinessDevelopmentManager",
    "SalesManager",
    "Admin",
  ]);

export const canCreatePricingRequests = (roles?: string[]): boolean =>
  hasAnyRole(roles, [
    "SalesRep",
    "BusinessDevelopmentManager",
    "SalesManager",
    "Admin",
  ]);

export const canAccessDashboardRoute = (
  pathname: string,
  roles?: string[],
): boolean => {
  const normalizedRoles = normalizeRoles(roles);

  if (!normalizedRoles.length) {
    return false;
  }

  return normalizedRoles.some((role) => {
    const allowedRoutes = DASHBOARD_ROUTES_BY_ROLE[role];
    if (!allowedRoutes?.length) {
      return false;
    }

    if (allowedRoutes.includes("*")) {
      return true;
    }

    return allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
  });
};
