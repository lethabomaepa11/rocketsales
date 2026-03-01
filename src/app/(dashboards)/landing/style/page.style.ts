"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  container: {
    minHeight: "100vh",
    background: token.colorBgLayout,
  },
  header: {
    padding: "16px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorder}`,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    fontSize: 28,
    color: token.colorPrimary,
  },
  logoText: {
    margin: 0,
    color: token.colorText,
  },
  loginButton: {
    height: 40,
  },
  heroSection: {
    padding: "80px 48px",
    textAlign: "center",
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorder}`,
  },
  heroTitle: {
    color: token.colorText,
    fontSize: 42,
    marginBottom: 24,
    fontWeight: 600,
  },
  heroDescription: {
    color: token.colorTextSecondary,
    fontSize: 18,
    maxWidth: 700,
    margin: "0 auto 40px",
  },
  heroPrimaryButton: {
    height: 48,
    padding: "0 32px",
  },
  featuresSection: {
    padding: "80px 48px",
    background: token.colorBgLayout,
  },
  featuresContainer: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  featuresTitle: {
    textAlign: "center",
    marginBottom: 16,
    color: token.colorText,
  },
  featuresSubtitle: {
    display: "block",
    textAlign: "center",
    marginBottom: 48,
    fontSize: 16,
  },
  featureCard: {
    height: "100%",
    textAlign: "center",
    padding: "24px",
    borderRadius: token.borderRadius,
    background: token.colorBgContainer,
    border: `1px solid ${token.colorBorder}`,
  },
  featureIcon: {
    marginBottom: 24,
  },
  featureIconSize: {
    fontSize: 40,
    color: token.colorPrimary,
  },
  ctaSection: {
    padding: "80px 48px",
    background: token.colorBgContainer,
    textAlign: "center",
    borderTop: `1px solid ${token.colorBorder}`,
  },
  ctaContainer: {
    maxWidth: 600,
    margin: "0 auto",
  },
  ctaDescription: {
    fontSize: 16,
    marginBottom: 32,
    color: token.colorTextSecondary,
  },
  ctaButton: {
    height: 48,
    padding: "0 40px",
  },
  footer: {
    padding: "24px 48px",
    background: token.colorBgLayout,
    textAlign: "center",
    borderTop: `1px solid ${token.colorBorder}`,
  },
  footerText: {
    color: token.colorTextSecondary,
  },
}));
